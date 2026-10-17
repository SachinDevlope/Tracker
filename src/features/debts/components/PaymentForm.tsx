"use client";

import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/Input";
import { PaymentFields } from "@/components/ui/PaymentFields";
import type { FormState } from "@/lib/form";
import { addPaymentAction } from "../actions";

export function PaymentForm({ debtId, remaining, today, onDone }: { debtId: string; remaining: number; today: string; onDone: () => void }) {
  const [state, action, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    const result = await addPaymentAction(debtId, prev, formData);
    if (result?.doneAt) onDone();
    return result;
  }, undefined);
  const amountRef = useRef<HTMLInputElement>(null);

  return (
    <form action={action} className="space-y-2 border-t border-border pt-3">
      <PaymentFields amountRef={amountRef} today={today} full={remaining} autoFocus />
      <FormError message={state?.error} />
      <Button disabled={pending} className="w-full">
        {pending ? "saving…" : "$ record_payment"}
      </Button>
    </form>
  );
}
