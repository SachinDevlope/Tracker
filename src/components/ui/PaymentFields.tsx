"use client";

import type { RefObject } from "react";
import { NOTE_MAX } from "@/lib/form";
import { Button } from "./Button";
import { Input } from "./Input";
import { MoneyInput } from "./MoneyInput";

// Amount (+ optional "full" fill), date and note inputs for payment forms
export function PaymentFields({
  amountRef,
  today,
  full,
  autoFocus,
}: {
  amountRef: RefObject<HTMLInputElement | null>;
  today: string;
  full?: number;
  autoFocus?: boolean;
}) {
  return (
    <>
      <div className="flex gap-2">
        <div className="flex-1">
          <MoneyInput ref={amountRef} name="amount" size="md" autoFocus={autoFocus} />
        </div>
        {full ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => amountRef.current && (amountRef.current.value = (full / 100).toFixed(2))}
          >
            full
          </Button>
        ) : null}
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <Input type="date" name="date" defaultValue={today} max={today} required className="px-2" />
        <Input name="note" maxLength={NOTE_MAX} placeholder="// note" autoComplete="off" />
      </div>
    </>
  );
}
