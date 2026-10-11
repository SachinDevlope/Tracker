"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { ListCard } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { deleteExpenseAction } from "../actions";
import { CATEGORY_META } from "../categories";
import { formatMoney } from "@/lib/money";
import type { Expense } from "../types";

type Group = { date: string; label: string; items: Expense[]; total: number };

export function ExpenseList({ groups }: { groups: Group[] }) {
  const [pending, startTransition] = useTransition();

  function remove(e: Expense) {
    if (!confirm(`Delete ${formatMoney(e.amount)} (${e.category})?`)) return;
    startTransition(() => deleteExpenseAction(e.id));
  }

  return (
    <div className={cn("space-y-4", pending && "opacity-60")}>
      {groups.map((g) => (
        <section key={g.date} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">{"// "}{g.label}</span>
            <span className="tabular-nums text-syn-orange">{formatMoney(g.total)}</span>
          </div>
          <ul className="space-y-2">
            {g.items.map((e) => (
              <ListCard key={e.id}>
                <div className="min-w-0 flex-1">
                  <div className={cn("text-sm font-semibold", CATEGORY_META[e.category].textClass)}>{e.category}</div>
                  {e.note && <div className="truncate text-xs text-muted">{e.note}</div>}
                </div>
                <span className="shrink-0 font-semibold tabular-nums">{formatMoney(e.amount)}</span>
                <Button variant="ghost" size="sm" className="px-2 hover:text-syn-red" aria-label="Delete" onClick={() => remove(e)}>
                  rm
                </Button>
              </ListCard>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
