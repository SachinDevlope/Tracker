import { STATUSES, STATUS_META, emptyCounts } from "./status";
import { workedMinutes } from "./time";
import type { DayEntry } from "./types";

export const RATE_GOOD = 90;

export type Summary = ReturnType<typeof summarize>;

// Attendance % = credited days (office + ½ half days) ÷ working days marked.
// Holidays and leave don't count against you, so they're left out of the denominator.
export function summarize(entries: DayEntry[]) {
  const counts = emptyCounts();
  let attended = 0;
  let totalMinutes = 0;
  let timedDays = 0;

  for (const e of entries) {
    counts[e.status]++;
    attended += STATUS_META[e.status].credit;
    const mins = workedMinutes(e.checkInAt, e.checkOutAt);
    if (mins) {
      totalMinutes += mins;
      timedDays++;
    }
  }

  const marked = STATUSES.reduce((n, s) => n + counts[s], 0);
  const workingDays = marked - counts.holiday - counts.leave;
  const rate = workingDays ? Math.round((attended / workingDays) * 100) : 0;

  return {
    counts,
    marked,
    attended,
    workingDays,
    rate,
    totalMinutes,
    avgMinutes: timedDays ? Math.round(totalMinutes / timedDays) : 0,
  };
}
