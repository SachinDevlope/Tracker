import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { TiffinMealModel, TiffinPaymentModel, TiffinSettingsModel } from "./model";
import type { Meal, TiffinMeal, TiffinPayment, TiffinPaymentInput, TiffinSettings } from "./types";

// DB access only; callers handle auth

const KEY = "default";

export async function getSettings(): Promise<TiffinSettings | null> {
  await connectDB();
  const doc = await TiffinSettingsModel.findOne({ key: KEY }).lean();
  return doc ? { lunchPrice: doc.lunchPrice, dinnerPrice: doc.dinnerPrice, vendor: doc.vendor ?? "" } : null;
}

export async function saveSettings(settings: TiffinSettings) {
  await connectDB();
  await TiffinSettingsModel.updateOne({ key: KEY }, { $set: settings }, { upsert: true, runValidators: true });
}

export async function listMeals(from: string, to: string): Promise<TiffinMeal[]> {
  await connectDB();
  const docs = await TiffinMealModel.find({ date: { $gte: from, $lte: to } }).sort({ date: -1 }).lean();
  return docs.map((d) => ({ date: d.date, meal: d.meal as Meal, price: d.price }));
}

// on: add at today's price (keeps an existing one); off: remove
export async function setMeal(date: string, meal: Meal, on: boolean, price: number) {
  await connectDB();
  if (on) await TiffinMealModel.updateOne({ date, meal }, { $setOnInsert: { price } }, { upsert: true });
  else await TiffinMealModel.deleteOne({ date, meal });
}

export async function listPayments(from: string, to: string): Promise<TiffinPayment[]> {
  await connectDB();
  const docs = await TiffinPaymentModel.find({ date: { $gte: from, $lte: to } }).sort({ date: -1, createdAt: -1 }).lean();
  return docs.map((d) => ({ id: String(d._id), date: d.date, amount: d.amount, note: d.note ?? "" }));
}

export async function addPayment(input: TiffinPaymentInput) {
  await connectDB();
  await TiffinPaymentModel.create(input);
}

export async function deletePayment(id: string) {
  if (!isValidObjectId(id)) return;
  await connectDB();
  await TiffinPaymentModel.deleteOne({ _id: id });
}

// All-time bill minus all-time payments
export async function balanceDue() {
  await connectDB();
  const sum = (rows: { total: number }[]) => rows[0]?.total ?? 0;
  const [billed, paid] = await Promise.all([
    TiffinMealModel.aggregate<{ total: number }>([{ $group: { _id: null, total: { $sum: "$price" } } }]),
    TiffinPaymentModel.aggregate<{ total: number }>([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
  ]);
  return sum(billed) - sum(paid);
}
