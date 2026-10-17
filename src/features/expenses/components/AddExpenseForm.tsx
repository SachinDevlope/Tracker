"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Window } from "@/components/ui/Card";
import { ChipPicker } from "@/components/ui/ChipPicker";
import { Field, FormError, Input } from "@/components/ui/Input";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { addExpenseAction } from "../actions";
import { CATEGORIES, CATEGORY_META, type Category } from "../categories";
import { NOTE_MAX } from "@/lib/form";

const OPTIONS = CATEGORIES.map((c) => ({ value: c, label: c, activeClass: CATEGORY_META[c].activeClass }));

export function AddExpenseForm({ today }: { today: string }) {
  const [state, action, pending] = useActionState(addExpenseAction, undefined);
  const [category, setCategory] = useState<Category>();
  const amountRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);

  // Keep category + date for quick repeat entries
  useEffect(() => {
    if (!state?.doneAt) return;
    if (amountRef.current) amountRef.current.value = "";
    if (noteRef.current) noteRef.current.value = "";
    amountRef.current?.focus();
  }, [state]);

  return (
    <Window title="expenses/new.ts">
      <form action={action} className="space-y-4">
        <Field label="amount">
          <MoneyInput ref={amountRef} name="amount" />
        </Field>

        <Field label="category">
          <ChipPicker name="category" label="Category" options={OPTIONS} value={category} onChange={setCategory} />
        </Field>

        <div className="grid grid-cols-[auto_1fr] gap-3">
          <Field label="date">
            <Input type="date" name="date" defaultValue={today} max={today} required className="px-2" />
          </Field>
          <Field label="note">
            <Input ref={noteRef} name="note" maxLength={NOTE_MAX} placeholder="// optional" autoComplete="off" />
          </Field>
        </div>

        <FormError message={state?.error} />
        {state?.doneAt && !state.error && <p className="text-sm text-syn-green">✔ added</p>}

        <Button disabled={pending || !category} className="w-full py-3">
          {pending ? "saving…" : "$ add_expense"}
        </Button>
      </form>
    </Window>
  );
}
