import { shiftDate } from "@/lib/date";
import type { Debt } from "./types";

export const DUE_SOON_DAYS = 7;

export type DueState = "settled" | "overdue" | "soon" | "ok" | "none";

export function dueState(debt: Debt, today: string): DueState {
  if (debt.remaining === 0) return "settled";
  if (!debt.dueOn) return "none";
  if (debt.dueOn < today) return "overdue";
  if (debt.dueOn <= shiftDate(today, DUE_SOON_DAYS)) return "soon";
  return "ok";
}

export function summarizeDebts(debts: Debt[], today: string) {
  const open = debts.filter((d) => d.remaining > 0);
  const byLender = new Map<string, number>();
  for (const d of open) byLender.set(d.lender, (byLender.get(d.lender) ?? 0) + d.remaining);

  return {
    outstanding: open.reduce((n, d) => n + d.remaining, 0),
    repaid: debts.reduce((n, d) => n + d.paid, 0),
    openCount: open.length,
    overdueCount: open.filter((d) => dueState(d, today) === "overdue").length,
    byLender: [...byLender].map(([lender, amount]) => ({ lender, amount })).sort((a, b) => b.amount - a.amount),
  };
}

export type DebtSummary = ReturnType<typeof summarizeDebts>;
