"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { SHIFT } from "../status";
import { formatDuration } from "../time";

function minutesBetween(inTime: string, outTime: string) {
  if (!inTime || !outTime) return 0;
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  const diff = toMin(outTime) - toMin(inTime);
  return diff > 0 ? diff : diff < 0 ? diff + 24 * 60 : 0;
}

// Typed check-in/out for past days; submits checkIn + checkOut
export function TimeRangeFields({ defaultIn = "", defaultOut = "" }: { defaultIn?: string; defaultOut?: string }) {
  const [checkIn, setCheckIn] = useState(defaultIn);
  const [checkOut, setCheckOut] = useState(defaultOut);
  const worked = minutesBetween(checkIn, checkOut);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3">
        <Field label="check_in">
          <Input type="time" name="checkIn" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="px-2" />
        </Field>
        <Field label="check_out">
          <Input type="time" name="checkOut" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="px-2" />
        </Field>
      </div>
      <p className="text-sm">
        <span className="text-syn-blue">hours_worked</span>
        <span className="text-muted">: </span>
        <span className="font-semibold text-syn-orange">{worked ? `"${formatDuration(worked)}"` : "null"}</span>
        {checkIn && checkOut && checkOut < checkIn && <span className="text-xs text-muted"> {"// ends next day"}</span>}
      </p>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => { setCheckIn(SHIFT.start); setCheckOut(SHIFT.end); }}>
          shift {SHIFT.start}–{SHIFT.end}
        </Button>
        {(checkIn || checkOut) && (
          <Button type="button" variant="ghost" size="sm" onClick={() => { setCheckIn(""); setCheckOut(""); }}>
            clear
          </Button>
        )}
      </div>
    </div>
  );
}
