export const CATEGORIES = [
  "food",
  "groceries",
  "transport",
  "bills",
  "rent",
  "shopping",
  "health",
  "fun",
  "other",
] as const;
export type Category = (typeof CATEGORIES)[number];

type Meta = { textClass: string; activeClass: string; barClass: string };

export const CATEGORY_META: Record<Category, Meta> = {
  food: { textClass: "text-syn-orange", activeClass: "border-syn-orange bg-syn-orange/15 text-syn-orange", barClass: "bg-syn-orange" },
  groceries: { textClass: "text-syn-green", activeClass: "border-syn-green bg-syn-green/15 text-syn-green", barClass: "bg-syn-green" },
  transport: { textClass: "text-syn-blue", activeClass: "border-syn-blue bg-syn-blue/15 text-syn-blue", barClass: "bg-syn-blue" },
  bills: { textClass: "text-syn-amber", activeClass: "border-syn-amber bg-syn-amber/15 text-syn-amber", barClass: "bg-syn-amber" },
  rent: { textClass: "text-syn-purple", activeClass: "border-syn-purple bg-syn-purple/15 text-syn-purple", barClass: "bg-syn-purple" },
  shopping: { textClass: "text-syn-red", activeClass: "border-syn-red bg-syn-red/15 text-syn-red", barClass: "bg-syn-red" },
  health: { textClass: "text-syn-green", activeClass: "border-syn-green bg-syn-green/15 text-syn-green", barClass: "bg-syn-green" },
  fun: { textClass: "text-syn-purple", activeClass: "border-syn-purple bg-syn-purple/15 text-syn-purple", barClass: "bg-syn-purple" },
  other: { textClass: "text-foreground", activeClass: "border-foreground bg-foreground/10 text-foreground", barClass: "bg-muted" },
};

export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}
