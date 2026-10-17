import { isDateString } from "@/lib/date";
import { parseAmount } from "@/lib/money";
import { NAME_MAX, field as get, noteError, type Result } from "@/lib/form";
import type { DebtInput, PaymentInput } from "./types";

export function parseDebtForm(formData: FormData): Result<DebtInput> {
  const lender = get(formData, "lender");
  const amount = parseAmount(get(formData, "amount"));
  const borrowedOn = get(formData, "borrowedOn");
  const dueOn = get(formData, "dueOn") || null;
  const note = get(formData, "note");

  if (!lender) return { ok: false, error: "Who do you owe?" };
  if (lender.length > NAME_MAX) return { ok: false, error: `Name must be at most ${NAME_MAX} characters` };
  if (amount === null) return { ok: false, error: "Enter a valid amount, e.g. 5000" };
  if (!isDateString(borrowedOn)) return { ok: false, error: "Pick the date you borrowed" };
  if (dueOn !== null && (!isDateString(dueOn) || dueOn < borrowedOn)) {
    return { ok: false, error: "Due date must be on or after the borrowed date" };
  }
  const noteErr = noteError(note);
  if (noteErr) return { ok: false, error: noteErr };

  return { ok: true, data: { lender, amount, borrowedOn, dueOn, note } };
}

export function parsePaymentForm(formData: FormData): Result<PaymentInput> {
  const amount = parseAmount(get(formData, "amount"));
  const date = get(formData, "date");
  const note = get(formData, "note");

  if (amount === null) return { ok: false, error: "Enter a valid amount" };
  if (!isDateString(date)) return { ok: false, error: "Pick a date" };
  const noteErr = noteError(note);
  if (noteErr) return { ok: false, error: noteErr };

  return { ok: true, data: { amount, date, note } };
}
