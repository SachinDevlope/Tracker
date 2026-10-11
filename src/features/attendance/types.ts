import type { Status } from "./status";

// Plain, serializable shape passed from server to client components
export type DayEntry = {
  date: string; // YYYY-MM-DD
  status: Status;
  checkInAt: string | null; // ISO timestamp, stamped by the check-in button
  checkOutAt: string | null; // ISO timestamp, stamped by the check-out button
  note: string;
};

export type DayInput = Pick<DayEntry, "status" | "note">;

export const NOTE_MAX = 500;
