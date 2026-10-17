"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, FormError, Input } from "@/components/ui/Input";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { saveSettingsAction } from "../actions";
import { NAME_MAX } from "@/lib/form";
import type { TiffinSettings } from "../types";

const rupees = (paise?: number) => (paise ? (paise / 100).toString() : "");

export function SettingsForm({ settings }: { settings: TiffinSettings | null }) {
  const [state, action, pending] = useActionState(saveSettingsAction, undefined);

  return (
    <form action={action} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="lunch_price">
          <MoneyInput name="lunchPrice" size="md" required={false} defaultValue={rupees(settings?.lunchPrice)} />
        </Field>
        <Field label="dinner_price">
          <MoneyInput name="dinnerPrice" size="md" required={false} defaultValue={rupees(settings?.dinnerPrice)} />
        </Field>
      </div>
      <Field label="vendor">
        <Input name="vendor" maxLength={NAME_MAX} defaultValue={settings?.vendor} placeholder="// optional, e.g. Annapurna Tiffins" autoComplete="off" />
      </Field>
      <p className="text-xs text-muted">{"// optional · new prices apply to meals marked from now on, older meals stay unpriced"}</p>
      <FormError message={state?.error} />
      {state?.doneAt && !state.error && <p className="text-sm text-syn-green">✔ saved</p>}
      <Button disabled={pending} className="w-full">
        {pending ? "saving…" : "$ save_config"}
      </Button>
    </form>
  );
}
