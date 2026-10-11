import { isDateString } from "@/lib/date";
import { isCategory } from "./categories";
import { parseAmount } from "@/lib/money";
import { EXPENSE_NOTE_MAX, type ExpenseInput } from "./types";

type Result = { ok: true; data: ExpenseInput } | { ok: false; error: string };

export function parseExpenseForm(formData: FormData): Result {
  const get = (key: string) => String(formData.get(key) ?? "").trim();
  const amount = parseAmount(get("amount"));
  const category = get("category");
  const date = get("date");
  const note = get("note");

  if (amount === null) return { ok: false, error: "Enter a valid amount, e.g. 249 or 249.50" };
  if (!isCategory(category)) return { ok: false, error: "Pick a category" };
  if (!isDateString(date)) return { ok: false, error: "Pick a date" };
  if (note.length > EXPENSE_NOTE_MAX) return { ok: false, error: `Note must be at most ${EXPENSE_NOTE_MAX} characters` };

  return { ok: true, data: { amount, category, date, note } };
}
