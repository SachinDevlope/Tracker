import { toCsv } from "@/lib/csv";
import type { Expense } from "./types";

export function expensesToCsv(expenses: Expense[]) {
  return toCsv(
    [...expenses].reverse(),
    [
      ["Date", (e) => e.date],
      ["Category", (e) => e.category],
      ["Amount (INR)", (e) => (e.amount / 100).toFixed(2)],
      ["Note", (e) => e.note],
    ],
  );
}
