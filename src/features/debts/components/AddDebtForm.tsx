"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Window } from "@/components/ui/Card";
import { Field, FormError, Input } from "@/components/ui/Input";
import { MoneyInput } from "@/components/ui/MoneyInput";
import type { FormState } from "@/lib/form";
import { addDebtAction } from "../actions";
import { NAME_MAX, NOTE_MAX } from "@/lib/form";

export function AddDebtForm({ today }: { today: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    const result = await addDebtAction(prev, formData);
    if (result?.doneAt) setOpen(false);
    return result;
  }, undefined);

  if (!open) {
    return (
      <Button variant="secondary" className="w-full py-3" onClick={() => setOpen(true)}>
        + new_debt()
      </Button>
    );
  }

  return (
    <Window title="debts/new.ts">
      <form action={action} className="space-y-4">
        <Field label="owed_to">
          <Input name="lender" required maxLength={NAME_MAX} placeholder="Rahul, HDFC card, Mom…" autoComplete="off" autoFocus />
        </Field>
        <Field label="amount">
          <MoneyInput name="amount" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="borrowed_on">
            <Input type="date" name="borrowedOn" defaultValue={today} max={today} required className="px-2" />
          </Field>
          <Field label="due_on">
            <Input type="date" name="dueOn" className="px-2" />
          </Field>
        </div>
        <Field label="note">
          <Input name="note" maxLength={NOTE_MAX} placeholder="// optional" autoComplete="off" />
        </Field>

        <FormError message={state?.error} />
        <div className="flex gap-2">
          <Button disabled={pending} className="flex-1 py-3">
            {pending ? "saving…" : "$ add_debt"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            cancel
          </Button>
        </div>
      </form>
    </Window>
  );
}
