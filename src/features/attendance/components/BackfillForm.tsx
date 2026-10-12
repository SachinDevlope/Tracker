"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Window } from "@/components/ui/Card";
import { Field, FormError, Input } from "@/components/ui/Input";
import { backfillAction } from "../actions";
import { SHIFT, type Status } from "../status";
import { StatusPicker } from "./StatusPicker";
import { TimeRangeFields } from "./TimeRangeFields";

// Fill a past date range in one go; never overwrites logged days
export function BackfillForm({ defaultFrom, defaultTo, today }: { defaultFrom: string; defaultTo: string; today: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("present");
  const [state, action, pending] = useActionState(backfillAction, undefined);

  if (!open) {
    return (
      <Button variant="secondary" className="w-full py-3" onClick={() => setOpen(true)}>
        + backfill()
      </Button>
    );
  }

  return (
    <Window title="entries/backfill.ts">
      <form action={action} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="from">
            <Input type="date" name="from" defaultValue={defaultFrom} max={today} required className="px-2" />
          </Field>
          <Field label="to">
            <Input type="date" name="to" defaultValue={defaultTo} max={today} required className="px-2" />
          </Field>
        </div>

        <Field label="status">
          <StatusPicker value={status} onChange={setStatus} />
        </Field>

        <TimeRangeFields defaultIn={SHIFT.start} defaultOut={SHIFT.end} />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="skipWeekends" defaultChecked className="h-4 w-4 accent-[var(--syn-green)]" />
          <span>skip sundays</span>
        </label>

        <p className="text-xs text-muted">{"// days you've already logged are left untouched"}</p>
        <FormError message={state?.error} />
        {state?.added !== undefined && (
          <p className="text-sm text-syn-green">
            ✔ added {state.added} {state.added === 1 ? "day" : "days"}
            {state.skipped ? <span className="text-muted"> · {state.skipped} already logged</span> : null}
          </p>
        )}

        <div className="flex gap-2">
          <Button disabled={pending} className="flex-1 py-3">
            {pending ? "saving…" : "$ backfill"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            close
          </Button>
        </div>
      </form>
    </Window>
  );
}
