"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/money";
import { deleteDebtAction, deletePaymentAction } from "../actions";
import type { DueState } from "../summary";
import type { Debt } from "../types";
import { PaymentForm } from "./PaymentForm";

const DUE_CLASS: Record<DueState, string> = {
  overdue: "border-syn-red/50 bg-syn-red/10 text-syn-red",
  soon: "border-syn-amber/50 bg-syn-amber/10 text-syn-amber",
  ok: "border-border text-muted",
  none: "border-border text-muted",
  settled: "border-syn-green/50 bg-syn-green/10 text-syn-green",
};

export type DebtView = Debt & { due: DueState; dueLabel: string; borrowedLabel: string; paymentLabels: Record<string, string> };

export function DebtCard({ debt, today }: { debt: DebtView; today: string }) {
  const [mode, setMode] = useState<"none" | "pay" | "history">("none");
  const [pending, startTransition] = useTransition();
  const paidShare = debt.amount ? debt.paid / debt.amount : 0;
  const settled = debt.remaining === 0;

  function removeDebt() {
    if (!confirm(`Delete the debt to ${debt.lender} and all its payments?`)) return;
    startTransition(() => deleteDebtAction(debt.id));
  }

  function removePayment(paymentId: string, amount: number) {
    if (!confirm(`Undo payment of ${formatMoney(amount)}?`)) return;
    startTransition(() => deletePaymentAction(debt.id, paymentId));
  }

  return (
    <Card className={cn("space-y-3 p-3", pending && "opacity-60")}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-syn-blue">{debt.lender}</div>
          <div className="truncate text-xs text-muted">
            {debt.borrowedLabel}
            {debt.note && ` · ${debt.note}`}
          </div>
        </div>
        <div className="text-right">
          <div className={cn("font-semibold tabular-nums", settled ? "text-syn-green" : "text-syn-orange")}>
            {settled ? "settled" : formatMoney(debt.remaining)}
          </div>
          <div className="text-xs text-muted tabular-nums">of {formatMoney(debt.amount)}</div>
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-background">
        <div className="h-full rounded-full bg-syn-green" style={{ width: `${paidShare * 100}%` }} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {debt.dueLabel && <span className={cn("rounded border px-2 py-1", DUE_CLASS[debt.due])}>{debt.dueLabel}</span>}
        <span className="text-muted">{Math.round(paidShare * 100)}% repaid</span>
        <div className="ml-auto flex gap-1">
          {!settled && (
            <Button variant={mode === "pay" ? "primary" : "secondary"} size="sm" onClick={() => setMode(mode === "pay" ? "none" : "pay")}>
              pay
            </Button>
          )}
          {debt.payments.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setMode(mode === "history" ? "none" : "history")}>
              log({debt.payments.length})
            </Button>
          )}
          <Button variant="ghost" size="sm" className="hover:text-syn-red" onClick={removeDebt}>
            rm
          </Button>
        </div>
      </div>

      {mode === "pay" && <PaymentForm debtId={debt.id} remaining={debt.remaining} today={today} onDone={() => setMode("none")} />}

      {mode === "history" && (
        <ul className="space-y-1 border-t border-border pt-3 text-sm">
          {debt.payments.map((p) => (
            <li key={p.id} className="flex items-center gap-2">
              <span className="text-muted">{debt.paymentLabels[p.id]}</span>
              <span className="min-w-0 flex-1 truncate text-xs text-muted">{p.note}</span>
              <span className="tabular-nums text-syn-green">−{formatMoney(p.amount)}</span>
              <button className="px-1 text-xs text-muted hover:text-syn-red" onClick={() => removePayment(p.id, p.amount)} aria-label="Undo payment">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
