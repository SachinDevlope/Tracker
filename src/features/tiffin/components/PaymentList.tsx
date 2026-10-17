"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { ListCard } from "@/components/ui/Card";
import { formatMoney } from "@/lib/money";
import { deletePaymentAction } from "../actions";
import type { TiffinPayment } from "../types";

export function PaymentList({ payments }: { payments: (TiffinPayment & { label: string })[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <ul className="space-y-1">
      {payments.map((p) => (
        <ListCard key={p.id} className="py-2 text-sm">
          <div className="min-w-0 flex-1">
            <div>{p.label}</div>
            {p.note && <div className="truncate text-xs text-muted">{p.note}</div>}
          </div>
          <span className="tabular-nums text-syn-green">{formatMoney(p.amount)}</span>
          <Button
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={() => confirm("Delete this payment?") && startTransition(() => deletePaymentAction(p.id))}
            aria-label="Delete payment"
          >
            rm
          </Button>
        </ListCard>
      ))}
    </ul>
  );
}
