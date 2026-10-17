"use client";

import { cn } from "@/lib/cn";

type ChipOption<T extends string> = { value: T; label: string; activeClass: string };

// Radio-style grid; submits `name` inside a form
export function ChipPicker<T extends string>({
  name,
  options,
  value,
  onChange,
  label,
}: {
  name: string;
  options: ChipOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={label}>
      <input type="hidden" name={name} value={value ?? ""} />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "h-12 truncate rounded-md border px-1 text-sm font-semibold transition-colors",
            value === o.value ? o.activeClass : "border-border bg-background text-muted hover:border-muted",
          )}
        >
          {value === o.value ? `"${o.label}"` : o.label}
        </button>
      ))}
    </div>
  );
}
