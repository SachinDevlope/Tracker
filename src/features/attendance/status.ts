// Client-safe constants shared by UI, model, calendar and reports

export const STATUSES = ["present", "half_day", "leave", "absent", "holiday"] as const;
export type Status = (typeof STATUSES)[number];

type Meta = {
  label: string;
  short: string;
  credit: number; // how much of a working day it counts as attended
  textClass: string;
  activeClass: string; // selected button
  cellClass: string; // calendar cell
};

export const STATUS_META: Record<Status, Meta> = {
  present: { label: "office", short: "OFC", credit: 1, textClass: "text-syn-green", activeClass: "border-syn-green bg-syn-green/15 text-syn-green", cellClass: "border border-syn-green/50 bg-syn-green/20 text-syn-green" },
  half_day: { label: "half_day", short: "½", credit: 0.5, textClass: "text-syn-amber", activeClass: "border-syn-amber bg-syn-amber/15 text-syn-amber", cellClass: "border border-syn-amber/50 bg-syn-amber/20 text-syn-amber" },
  leave: { label: "leave", short: "LV", credit: 0, textClass: "text-syn-purple", activeClass: "border-syn-purple bg-syn-purple/15 text-syn-purple", cellClass: "border border-syn-purple/50 bg-syn-purple/20 text-syn-purple" },
  absent: { label: "absent", short: "ABS", credit: 0, textClass: "text-syn-red", activeClass: "border-syn-red bg-syn-red/15 text-syn-red", cellClass: "border border-syn-red/50 bg-syn-red/20 text-syn-red" },
  holiday: { label: "holiday", short: "HOL", credit: 0, textClass: "text-syn-orange", activeClass: "border-syn-orange bg-syn-orange/15 text-syn-orange", cellClass: "border border-syn-orange/50 bg-syn-orange/20 text-syn-orange" },
};

export function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

export function emptyCounts(): Record<Status, number> {
  return { present: 0, half_day: 0, leave: 0, absent: 0, holiday: 0 };
}

// Days off by default (0 = Sunday, 6 = Saturday). Weekends are only shaded, never counted as absent.
export const WEEKEND_DAYS = [0, 6];
