import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { DebtModel } from "./model";
import type { Debt, DebtInput, PaymentInput } from "./types";

// DB access only; callers handle auth

type RawDebt = {
  _id: unknown;
  lender: string;
  amount: number;
  borrowedOn: string;
  dueOn?: string | null;
  note?: string | null;
  payments?: { _id: unknown; date: string; amount: number; note?: string | null }[];
};

function toDebt(doc: RawDebt): Debt {
  const payments = (doc.payments ?? [])
    .map((p) => ({ id: String(p._id), date: p.date, amount: p.amount, note: p.note ?? "" }))
    .sort((a, b) => b.date.localeCompare(a.date));
  const paid = payments.reduce((n, p) => n + p.amount, 0);
  return {
    id: String(doc._id),
    lender: doc.lender,
    amount: doc.amount,
    borrowedOn: doc.borrowedOn,
    dueOn: doc.dueOn ?? null,
    note: doc.note ?? "",
    payments,
    paid,
    remaining: Math.max(doc.amount - paid, 0),
  };
}

export async function listDebts(): Promise<Debt[]> {
  await connectDB();
  const docs = await DebtModel.find().sort({ borrowedOn: -1 }).lean<RawDebt[]>();
  return docs.map(toDebt);
}

export async function createDebt(input: DebtInput) {
  await connectDB();
  await DebtModel.create(input);
}

export async function deleteDebt(id: string) {
  if (!isValidObjectId(id)) return;
  await connectDB();
  await DebtModel.deleteOne({ _id: id });
}

// Returns an error message, or null on success
export async function addPayment(debtId: string, input: PaymentInput): Promise<string | null> {
  if (!isValidObjectId(debtId)) return "Debt not found";
  await connectDB();
  const doc = await DebtModel.findById(debtId).lean<RawDebt>();
  if (!doc) return "Debt not found";

  const { remaining } = toDebt(doc);
  if (input.amount > remaining) return "That's more than what's left to pay";
  if (input.date < doc.borrowedOn) return "Payment date is before the borrowed date";

  await DebtModel.updateOne({ _id: debtId }, { $push: { payments: input } }, { runValidators: true });
  return null;
}

export async function deletePayment(debtId: string, paymentId: string) {
  if (!isValidObjectId(debtId) || !isValidObjectId(paymentId)) return;
  await connectDB();
  await DebtModel.updateOne({ _id: debtId }, { $pull: { payments: { _id: paymentId } } });
}
