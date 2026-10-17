import { env } from "./env";

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;

export function isDateString(value: unknown): value is string {
  return typeof value === "string" && DATE_RE.test(value);
}

export function today() {
  // en-CA = YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone: env.APP_TIMEZONE }).format(new Date());
}

export function formatClock(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: env.APP_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
}

// Local date + "HH:MM" in APP_TIMEZONE → Date
export function zonedTime(date: string, time: string) {
  const guess = Date.parse(`${date}T${time}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: env.APP_TIMEZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(guess));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asLocal = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return new Date(guess - (asLocal - guess));
}

function utc(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

export function shiftDate(date: string, days: number) {
  const d = utc(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function weekday(date: string) {
  return utc(date).getUTCDay(); // 0 = Sunday
}

export function monthOf(date: string) {
  return date.slice(0, 7);
}

export function monthStart(date: string) {
  return `${monthOf(date)}-01`;
}

export function monthEnd(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
}

export function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + delta, 1)).toISOString().slice(0, 7);
}

export function datesBetween(from: string, to: string) {
  const out: string[] = [];
  for (let d = from; d <= to; d = shiftDate(d, 1)) out.push(d);
  return out;
}

// Days in from..to that are on or before today (for daily averages)
export function daysSoFar(from: string, to: string, today: string) {
  return from > today ? 0 : datesBetween(from, to < today ? to : today).length;
}

export function formatDate(date: string, style: "long" | "short" = "long") {
  return utc(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(style === "long" && { year: "numeric" }),
    timeZone: "UTC",
  });
}

export function formatMonth(month: string) {
  return utc(`${month}-01`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function validDate(value: unknown, fallback: string) {
  return isDateString(value) ? value : fallback;
}

export function validMonth(value: unknown, fallback: string) {
  return typeof value === "string" && MONTH_RE.test(value) ? value : fallback;
}
