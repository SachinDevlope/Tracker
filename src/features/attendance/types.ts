import type { Status } from "./status";

export type DayEntry = {
  date: string; // YYYY-MM-DD
  status: Status;
  checkInAt: string | null; // ISO
  checkOutAt: string | null; // ISO
  note: string;
};

export type DayInput = Pick<DayEntry, "status" | "note">;

export const NOTE_MAX = 500;
