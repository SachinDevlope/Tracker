"use client";

import { cn } from "@/lib/cn";
import { STATUSES, STATUS_META, type Status } from "../status";

// Radio-style grid; submits as "status" inside a form
export function StatusPicker({
  value,
  onChange,
  name = "status",
}: {
  value?: Status;
  onChange: (status: Status) => void;
  name?: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Status">
      <input type="hidden" name={name} value={value ?? ""} />
      {STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={value === s}
          onClick={() => onChange(s)}
          className={cn(
            "h-12 rounded-md border text-sm font-semibold transition-colors",
            value === s ? STATUS_META[s].activeClass : "border-border bg-background text-muted hover:border-muted",
          )}
        >
          {value === s ? `"${STATUS_META[s].label}"` : STATUS_META[s].label}
        </button>
      ))}
    </div>
  );
}
