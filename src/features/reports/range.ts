import { monthStart, today, validDate } from "@/lib/date";

export type DateRange = { from: string; to: string };

// Default: this month so far
export function parseRange(params: { from?: unknown; to?: unknown }): DateRange {
  const now = today();
  const from = validDate(params.from, monthStart(now));
  const to = validDate(params.to, now);
  return from <= to ? { from, to } : { from: to, to: from };
}
