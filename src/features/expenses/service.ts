import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import type { Category } from "./categories";
import { ExpenseModel, type ExpenseDoc } from "./model";
import type { Expense, ExpenseInput } from "./types";

// DB access only; callers handle auth

function toExpense(doc: ExpenseDoc & { _id: unknown }): Expense {
  return {
    id: String(doc._id),
    date: doc.date,
    amount: doc.amount,
    category: doc.category as Category,
    note: doc.note ?? "",
  };
}

export async function listExpenses(from: string, to: string): Promise<Expense[]> {
  await connectDB();
  const docs = await ExpenseModel.find({ date: { $gte: from, $lte: to } })
    .sort({ date: -1, createdAt: -1 })
    .lean();
  return docs.map(toExpense);
}

export async function createExpense(input: ExpenseInput) {
  await connectDB();
  await ExpenseModel.create(input);
}

export async function deleteExpense(id: string) {
  if (!isValidObjectId(id)) return;
  await connectDB();
  await ExpenseModel.deleteOne({ _id: id });
}
