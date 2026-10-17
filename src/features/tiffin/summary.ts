import type { TiffinMeal } from "./types";

export type TiffinSummary = ReturnType<typeof summarizeMeals>;

export function summarizeMeals(meals: TiffinMeal[]) {
  const lunch = meals.filter((m) => m.meal === "lunch");
  const dinner = meals.filter((m) => m.meal === "dinner");
  const cost = (list: TiffinMeal[]) => list.reduce((n, m) => n + m.price, 0);

  return {
    daysOrdered: new Set(meals.map((m) => m.date)).size,
    lunches: lunch.length,
    dinners: dinner.length,
    lunchCost: cost(lunch),
    dinnerCost: cost(dinner),
    bill: cost(meals),
  };
}

// date → set of meals taken
export function mealsByDate(meals: TiffinMeal[]) {
  const map: Record<string, { lunch: boolean; dinner: boolean }> = {};
  for (const m of meals) (map[m.date] ??= { lunch: false, dinner: false })[m.meal] = true;
  return map;
}
