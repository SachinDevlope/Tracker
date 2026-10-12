import { datesBetween, monthOf, shiftDate, weekday } from "@/lib/date";
import type { DateRange } from "./range";

export type Bucket = { key: string; label: string; value: number };
export type Grain = "day" | "week" | "month";

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function grainFor({ from, to }: DateRange): Grain {
  const days = datesBetween(from, to).length;
  return days <= 31 ? "day" : days <= 120 ? "week" : "month";
}

// Week buckets start on Monday
function keyOf(date: string, grain: Grain) {
  if (grain === "day") return date;
  if (grain === "month") return monthOf(date);
  return shiftDate(date, -((weekday(date) + 6) % 7));
}

function labelOf(key: string, grain: Grain) {
  if (grain === "month") return SHORT_MONTHS[Number(key.slice(5)) - 1];
  const day = Number(key.slice(8));
  return grain === "week" ? `${day}/${Number(key.slice(5, 7))}` : String(day);
}

// Sums values per bucket; every bucket in range is present, even if empty
export function bucketize<T>(range: DateRange, items: T[], dateOf: (t: T) => string, valueOf: (t: T) => number) {
  const grain = grainFor(range);
  const buckets = new Map<string, Bucket>();
  for (const d of datesBetween(range.from, range.to)) {
    const key = keyOf(d, grain);
    if (!buckets.has(key)) buckets.set(key, { key, label: labelOf(key, grain), value: 0 });
  }
  for (const item of items) {
    const b = buckets.get(keyOf(dateOf(item), grain));
    if (b) b.value += valueOf(item);
  }
  return { grain, buckets: [...buckets.values()] };
}
