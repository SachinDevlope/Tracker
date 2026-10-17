import { datesBetween, isDateString, shiftDate, weekday, zonedTime } from "@/lib/date";
import { field as get, noteError, type Result } from "@/lib/form";
import { WEEKEND_DAYS, isStatus } from "./status";
import { BACKFILL_MAX_DAYS, DAY_NOTE_MAX, type BackfillDay, type DayInput } from "./types";

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

// "HH:MM" pair → timestamps; check-out before check-in = next day (night shift)
function parseTimes(date: string, inTime: string, outTime: string): Result<{ checkInAt: Date | null; checkOutAt: Date | null }> {
  if (!inTime && !outTime) return { ok: true, data: { checkInAt: null, checkOutAt: null } };
  if (!TIME_RE.test(inTime)) return { ok: false, error: "Enter a check-in time" };
  if (outTime && !TIME_RE.test(outTime)) return { ok: false, error: "Check-out time is invalid" };
  if (outTime === inTime) return { ok: false, error: "Check-out must differ from check-in" };

  const checkOutDate = outTime && outTime < inTime ? shiftDate(date, 1) : date;
  return {
    ok: true,
    data: { checkInAt: zonedTime(date, inTime), checkOutAt: outTime ? zonedTime(checkOutDate, outTime) : null },
  };
}

// Pass `backdate` to also read check-in/out times
export function parseDayForm(formData: FormData, backdate?: string): Result<DayInput> {
  const status = get(formData, "status");
  const note = get(formData, "note");

  if (!isStatus(status)) return { ok: false, error: "Pick a status" };
  const noteErr = noteError(note, DAY_NOTE_MAX);
  if (noteErr) return { ok: false, error: noteErr };
  if (!backdate) return { ok: true, data: { status, note } };

  const times = parseTimes(backdate, get(formData, "checkIn"), get(formData, "checkOut"));
  if (!times.ok) return times;
  return { ok: true, data: { status, note, ...times.data } };
}

export function parseBackfillForm(formData: FormData, today: string): Result<BackfillDay[]> {
  const from = get(formData, "from");
  const to = get(formData, "to");
  const status = get(formData, "status");
  const skipWeekends = formData.get("skipWeekends") === "on";

  if (!isDateString(from) || !isDateString(to)) return { ok: false, error: "Pick a date range" };
  if (from > to) return { ok: false, error: "'from' must be before 'to'" };
  if (to > today) return { ok: false, error: "Can't backfill future days" };
  if (!isStatus(status)) return { ok: false, error: "Pick a status" };

  const dates = datesBetween(from, to).filter((d) => !skipWeekends || !WEEKEND_DAYS.includes(weekday(d)));
  if (dates.length > BACKFILL_MAX_DAYS) return { ok: false, error: `At most ${BACKFILL_MAX_DAYS} days at once` };
  if (!dates.length) return { ok: false, error: "No days in that range" };

  const inTime = get(formData, "checkIn");
  const outTime = get(formData, "checkOut");
  const days: BackfillDay[] = [];
  for (const date of dates) {
    const times = parseTimes(date, inTime, outTime);
    if (!times.ok) return times;
    days.push({ date, status, ...times.data });
  }
  return { ok: true, data: days };
}
