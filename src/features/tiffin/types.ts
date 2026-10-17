export const MEALS = ["lunch", "dinner"] as const;
export type Meal = (typeof MEALS)[number];

export function isMeal(value: unknown): value is Meal {
  return MEALS.includes(value as Meal);
}

// Price is copied onto each meal, so later price changes don't rewrite history
export type TiffinMeal = { date: string; meal: Meal; price: number };

export type TiffinSettings = { lunchPrice: number; dinnerPrice: number; vendor: string };

// 0 = no price set
export function priceFor(settings: TiffinSettings | null, meal: Meal) {
  return (meal === "lunch" ? settings?.lunchPrice : settings?.dinnerPrice) ?? 0;
}

export type TiffinPayment = { id: string; date: string; amount: number; note: string };
export type TiffinPaymentInput = Omit<TiffinPayment, "id">;
