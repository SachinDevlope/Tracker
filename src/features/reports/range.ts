import { monthStart, today, validDate } from "@/lib/date";

export type DateRange = { from: string; to: string };

// Defaults to the current month so far; swaps the ends if given backwards
export function parseRange(params: { from?: unknown; to?: unknown }): DateRange {
  const now = today();
  const from = validDate(params.from, monthStart(now));
  const to = validDate(params.to, now);
  return from <= to ? { from, to } : { from: to, to: from };
}
