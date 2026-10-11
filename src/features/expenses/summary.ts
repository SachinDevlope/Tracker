import { CATEGORIES, type Category } from "./categories";
import type { Expense } from "./types";

export type ExpenseSummary = ReturnType<typeof summarizeExpenses>;

export function summarizeExpenses(expenses: Expense[], daysElapsed: number) {
  const byCategory = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
  let total = 0;
  for (const e of expenses) {
    total += e.amount;
    byCategory[e.category] += e.amount;
  }

  const categories = CATEGORIES.filter((c) => byCategory[c] > 0)
    .map((c) => ({ category: c, amount: byCategory[c], share: total ? byCategory[c] / total : 0 }))
    .sort((a, b) => b.amount - a.amount);

  return {
    total,
    count: expenses.length,
    dailyAvg: daysElapsed > 0 ? Math.round(total / daysElapsed) : 0,
    categories,
  };
}

export function groupByDate(expenses: Expense[]) {
  const groups = new Map<string, Expense[]>();
  for (const e of expenses) groups.set(e.date, [...(groups.get(e.date) ?? []), e]);
  return [...groups].map(([date, items]) => ({ date, items, total: items.reduce((n, e) => n + e.amount, 0) }));
}
