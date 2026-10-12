"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/features/auth/session";
import { isCategory } from "@/features/expenses/categories";
import { createExpenses } from "@/features/expenses/service";
import { EXPENSE_NOTE_MAX, type ExpenseInput } from "@/features/expenses/types";
import { isDateString } from "@/lib/date";
import { MAX_PAISE } from "@/lib/money";
import { MAX_IMPORT_ROWS } from "./types";

type Row = { date: string; amount: number; category: string; note: string };

export async function importExpensesAction(rows: Row[]): Promise<{ imported?: number; error?: string }> {
  await requireAuth();
  if (!Array.isArray(rows) || !rows.length) return { error: "Nothing selected" };
  if (rows.length > MAX_IMPORT_ROWS) return { error: `At most ${MAX_IMPORT_ROWS} rows at once` };

  const inputs: ExpenseInput[] = [];
  for (const r of rows) {
    const valid =
      isDateString(r?.date) &&
      Number.isInteger(r.amount) &&
      r.amount > 0 &&
      r.amount <= MAX_PAISE &&
      isCategory(r.category) &&
      typeof r.note === "string";
    if (!valid) return { error: "Some rows are invalid — re-upload the statement" };
    inputs.push({ date: r.date, amount: r.amount, category: r.category as ExpenseInput["category"], note: r.note.trim().slice(0, EXPENSE_NOTE_MAX) });
  }

  const imported = await createExpenses(inputs);
  revalidatePath("/expenses");
  return { imported };
}
