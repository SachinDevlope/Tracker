import { env } from "./env";

// All dates are "YYYY-MM-DD" strings and months "YYYY-MM", interpreted in APP_TIMEZONE.

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const MONTH_RE = /^\d{4}-\d{2}$/;

export function isDateString(value: unknown): value is string {
  return typeof value === "string" && DATE_RE.test(value);
}

export function today() {
  // en-CA formats as YYYY-MM-DD
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
