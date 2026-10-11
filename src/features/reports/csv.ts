import { formatClock } from "@/lib/date";
import { STATUS_META } from "@/features/attendance/status";
import { workedMinutes } from "@/features/attendance/time";
import type { DayEntry } from "@/features/attendance/types";

function csvCell(value: string | number) {
  const s = String(value);
  // Neutralise leading formula characters so spreadsheets don't execute them
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

const time = (iso: string | null) => (iso ? formatClock(iso) : "");

const COLUMNS: [string, (e: DayEntry) => string | number][] = [
  ["Date", (e) => e.date],
  ["Status", (e) => STATUS_META[e.status].label],
  ["Check In", (e) => time(e.checkInAt)],
  ["Check Out", (e) => time(e.checkOutAt)],
  ["Hours", (e) => (workedMinutes(e.checkInAt, e.checkOutAt) / 60).toFixed(2)],
  ["Check In (ISO)", (e) => e.checkInAt ?? ""],
  ["Check Out (ISO)", (e) => e.checkOutAt ?? ""],
  ["Note", (e) => e.note],
];

export function entriesToCsv(entries: DayEntry[]) {
  const header = COLUMNS.map(([title]) => csvCell(title)).join(",");
  const lines = entries.map((e) => COLUMNS.map(([, get]) => csvCell(get(e))).join(","));
  // BOM so Excel reads UTF-8 correctly
  return "﻿" + [header, ...lines].join("\r\n");
}
