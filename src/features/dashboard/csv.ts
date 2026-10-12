import { toCsv } from "@/lib/csv";
import { formatClock } from "@/lib/date";
import { STATUS_META } from "@/features/attendance/status";
import { workedMinutes } from "@/features/attendance/time";
import type { DayEntry } from "@/features/attendance/types";

const time = (iso: string | null) => (iso ? formatClock(iso) : "");

export function entriesToCsv(entries: DayEntry[]) {
  return toCsv(entries, [
    ["Date", (e) => e.date],
    ["Status", (e) => STATUS_META[e.status].label],
    ["Check In", (e) => time(e.checkInAt)],
    ["Check Out", (e) => time(e.checkOutAt)],
    ["Late", (e) => (e.late ? "yes" : "")],
    ["Hours", (e) => (workedMinutes(e.checkInAt, e.checkOutAt) / 60).toFixed(2)],
    ["Check In (ISO)", (e) => e.checkInAt ?? ""],
    ["Check Out (ISO)", (e) => e.checkOutAt ?? ""],
    ["Note", (e) => e.note],
  ]);
}
