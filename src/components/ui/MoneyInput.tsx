import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// ₹-prefixed amount field
export function MoneyInput({ className, size = "lg", ...props }: Omit<ComponentProps<"input">, "size"> & { size?: "md" | "lg" }) {
  return (
    <div className="flex items-center rounded-md border border-border bg-background focus-within:border-syn-green/70 focus-within:ring-1 focus-within:ring-syn-green/40">
      <span className={cn("pl-3 text-syn-orange", size === "lg" ? "text-lg" : "text-base")}>₹</span>
      <input
        required
        inputMode="decimal"
        autoComplete="off"
        placeholder="0.00"
        className={cn(
          "min-w-0 flex-1 bg-transparent px-2 font-semibold tabular-nums text-syn-orange outline-none placeholder:text-muted/50",
          size === "lg" ? "py-3 text-xl" : "py-2.5",
          className,
        )}
        {...props}
      />
    </div>
  );
}
