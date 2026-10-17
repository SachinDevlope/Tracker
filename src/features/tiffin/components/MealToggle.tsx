"use client";

import { useOptimistic, useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import { setMealAction } from "../actions";
import type { Meal } from "../types";

const ON_CLASS = { lunch: "border-syn-amber bg-syn-amber/15 text-syn-amber", dinner: "border-syn-purple bg-syn-purple/15 text-syn-purple" };

export function MealToggle({ date, meal, on, size = "sm", detail }: { date: string; meal: Meal; on: boolean; size?: "sm" | "lg"; detail?: string }) {
  const [optimistic, setOptimistic] = useOptimistic(on);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  function toggle() {
    const next = !optimistic;
    setError("");
    startTransition(async () => {
      setOptimistic(next);
      const res = await setMealAction(date, meal, next);
      if (res.error) setError(res.error);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={optimistic}
      title={error || undefined}
      className={cn(
        "rounded-md border transition-colors",
        size === "lg" ? "flex-1 py-4 text-base" : "w-20 py-1.5 text-xs",
        optimistic ? ON_CLASS[meal] : "border-border text-muted hover:border-muted",
        error && "border-syn-red text-syn-red",
      )}
    >
      {optimistic ? "✔ " : "+ "}
      {meal}
      {detail && <span className="block text-xs opacity-70">{error || detail}</span>}
    </button>
  );
}
