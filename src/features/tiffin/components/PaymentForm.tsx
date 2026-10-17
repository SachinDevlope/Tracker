"use client";

import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/Input";
import { PaymentFields } from "@/components/ui/PaymentFields";
import type { FormState } from "@/lib/form";
import { addPaymentAction } from "../actions";

export function PaymentForm({ today, due }: { today: string; due: number }) {
  const amountRef = useRef<HTMLInputElement>(null);
  const [state, action, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    const result = await addPaymentAction(prev, formData);
    if (result?.doneAt && amountRef.current) amountRef.current.value = "";
    return result;
  }, undefined);

  return (
    <form action={action} className="space-y-2">
      <PaymentFields amountRef={amountRef} today={today} full={due > 0 ? due : undefined} />
      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" name="logExpense" defaultChecked className="h-4 w-4 accent-[var(--syn-green)]" />
        also add to expenses (food)
      </label>
      <FormError message={state?.error} />
      {state?.doneAt && !state.error && <p className="text-sm text-syn-green">✔ payment saved</p>}
      <Button disabled={pending} className="w-full">
        {pending ? "saving…" : "$ record_payment"}
      </Button>
    </form>
  );
}
