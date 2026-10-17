import { isDateString } from "@/lib/date";
import { parseAmount } from "@/lib/money";
import { NAME_MAX, field as get, noteError, type Result } from "@/lib/form";
import type { TiffinPaymentInput, TiffinSettings } from "./types";

// Blank or "0" = no price
function parsePrice(input: string) {
  return input === "" || /^0+(\.0+)?$/.test(input) ? 0 : parseAmount(input);
}

export function parseSettingsForm(formData: FormData): Result<TiffinSettings> {
  const lunchPrice = parsePrice(get(formData, "lunchPrice"));
  const dinnerPrice = parsePrice(get(formData, "dinnerPrice"));
  const vendor = get(formData, "vendor");

  if (lunchPrice === null || dinnerPrice === null) return { ok: false, error: "Enter valid prices, e.g. 80" };
  if (vendor.length > NAME_MAX) return { ok: false, error: `Name must be at most ${NAME_MAX} characters` };

  return { ok: true, data: { lunchPrice, dinnerPrice, vendor } };
}

export function parsePaymentForm(formData: FormData, today: string): Result<TiffinPaymentInput> {
  const amount = parseAmount(get(formData, "amount"));
  const date = get(formData, "date");
  const note = get(formData, "note");

  if (amount === null) return { ok: false, error: "Enter a valid amount" };
  if (!isDateString(date) || date > today) return { ok: false, error: "Pick a date up to today" };
  const noteErr = noteError(note);
  if (noteErr) return { ok: false, error: noteErr };

  return { ok: true, data: { amount, date, note } };
}
