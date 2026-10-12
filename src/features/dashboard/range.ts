import { monthEnd, monthOf, monthStart, shiftDate, shiftMonth, today, validDate } from "@/lib/date";

export type DateRange = { from: string; to: string };

export function rangePresets(now: string) {
  const lastMonth = shiftMonth(monthOf(now), -1);
  return [
    { label: "this_month", from: monthStart(now), to: now },
    { label: "last_month", from: `${lastMonth}-01`, to: monthEnd(lastMonth) },
    { label: "90_days", from: shiftDate(now, -89), to: now },
    { label: "this_year", from: `${now.slice(0, 4)}-01-01`, to: now },
  ];
}

// Default: this month so far
export function parseRange(params: { from?: unknown; to?: unknown }): DateRange {
  const now = today();
  const from = validDate(params.from, monthStart(now));
  const to = validDate(params.to, now);
  return from <= to ? { from, to } : { from: to, to: from };
}
