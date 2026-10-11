import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export const fieldStyles =
  "w-full min-w-0 rounded-md border border-border bg-background px-3 py-2.5 text-foreground outline-none placeholder:text-muted/70 focus:border-syn-green/70 focus:ring-1 focus:ring-syn-green/40";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldStyles, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldStyles, className)} {...props} />;
}

// Label rendered like an object key: `check_in:`
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-syn-blue">
        {label}
        <span className="text-muted">:</span>
      </span>
      {children}
    </label>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="rounded-md border border-syn-red/40 bg-syn-red/10 px-3 py-2 text-sm text-syn-red">
      <span className="font-semibold">Error:</span> {message}
    </p>
  );
}
