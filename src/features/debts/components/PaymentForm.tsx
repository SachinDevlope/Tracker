"use client";

import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { FormError, Input } from "@/components/ui/Input";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { addPaymentAction, type FormState } from "../actions";
import { DEBT_NOTE_MAX } from "../types";

export function PaymentForm({ debtId, remaining, today, onDone }: { debtId: string; remaining: number; today: string; onDone: () => void }) {
  const [state, action, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    const result = await addPaymentAction(debtId, prev, formData);
    if (result?.doneAt) onDone();
    return result;
  }, undefined);
  const amountRef = useRef<HTMLInputElement>(null);

  return (
    <form action={action} className="space-y-2 border-t border-border pt-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <MoneyInput ref={amountRef} name="amount" size="md" autoFocus />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => amountRef.current && (amountRef.current.value = (remaining / 100).toFixed(2))}
        >
          full
        </Button>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <Input type="date" name="date" defaultValue={today} max={today} required className="px-2" />
        <Input name="note" maxLength={DEBT_NOTE_MAX} placeholder="// note" autoComplete="off" />
      </div>
      <FormError message={state?.error} />
      <Button disabled={pending} className="w-full">
        {pending ? "saving…" : "$ record_payment"}
      </Button>
    </form>
  );
}
