import { isDateString } from "@/lib/date";
import { isCategory } from "./categories";
import { parseAmount } from "@/lib/money";
import { field, noteError, type Result } from "@/lib/form";
import type { ExpenseInput } from "./types";

export function parseExpenseForm(formData: FormData): Result<ExpenseInput> {
  const get = (key: string) => field(formData, key);
  const amount = parseAmount(get("amount"));
  const category = get("category");
  const date = get("date");
  const note = get("note");

  if (amount === null) return { ok: false, error: "Enter a valid amount, e.g. 249 or 249.50" };
  if (!isCategory(category)) return { ok: false, error: "Pick a category" };
  if (!isDateString(date)) return { ok: false, error: "Pick a date" };
  const noteErr = noteError(note);
  if (noteErr) return { ok: false, error: noteErr };

  return { ok: true, data: { amount, category, date, note } };
}
