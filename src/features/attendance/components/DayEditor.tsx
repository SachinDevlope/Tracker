"use client";

import { useActionState, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Window } from "@/components/ui/Card";
import { Field, FormError, Textarea } from "@/components/ui/Input";
import { clearDayAction, saveDayAction } from "../actions";
import type { Status } from "../status";
import { NOTE_MAX, type DayEntry } from "../types";
import { StatusPicker } from "./StatusPicker";
import { TimeRangeFields } from "./TimeRangeFields";

type Props = {
  date: string;
  entry: DayEntry | null;
  backdated: boolean;
  defaultIn?: string;
  defaultOut?: string;
};

export function DayEditor({ date, entry, backdated, defaultIn, defaultOut }: Props) {
  const [state, action, saving] = useActionState(saveDayAction.bind(null, date), undefined);
  const [clearing, startClear] = useTransition();
  const [status, setStatus] = useState<Status | undefined>(entry?.status);

  return (
    <Window title={`entries/${date}.json${entry ? "" : " (new)"}`}>
      <form action={action} className="space-y-4">
        <Field label="status">
          <StatusPicker value={status} onChange={setStatus} />
        </Field>

        {backdated && <TimeRangeFields defaultIn={defaultIn} defaultOut={defaultOut} />}

        <Field label="note">
          <Textarea name="note" defaultValue={entry?.note} maxLength={NOTE_MAX} rows={2} placeholder="// optional — client visit, sick, travel…" />
        </Field>

        <FormError message={state?.error} />
        {state?.savedAt && !state.error && <p className="text-sm text-syn-green">✔ saved</p>}

        <div className="flex gap-2">
          <Button disabled={saving || !status} className="flex-1">
            {saving ? "saving…" : "save()"}
          </Button>
          {entry && (
            <Button
              type="button"
              variant="danger"
              disabled={clearing}
              onClick={() => confirm("Delete this day's entry, including check-in/out times?") && startClear(() => clearDayAction(date))}
            >
              rm
            </Button>
          )}
        </div>
      </form>
    </Window>
  );
}
