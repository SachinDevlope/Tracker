import type { Status } from "./status";

export type DayEntry = {
  date: string; // YYYY-MM-DD
  status: Status;
  checkInAt: string | null; // ISO
  checkOutAt: string | null; // ISO
  note: string;
  late: boolean; // checked in after LATE_AFTER
};

// Times only set for backdated days
export type DayInput = Pick<DayEntry, "status" | "note"> & { checkInAt?: Date | null; checkOutAt?: Date | null };

export type BackfillDay = { date: string; status: Status; checkInAt: Date | null; checkOutAt: Date | null };

export const DAY_NOTE_MAX = 500;
export const BACKFILL_MAX_DAYS = 93;
