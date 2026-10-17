import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const cardStyles = "rounded-lg border border-border bg-card";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(cardStyles, className)} {...props} />;
}

export function Window({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn(cardStyles, "overflow-hidden", className)}>
      <div className="flex items-center gap-2 border-b border-border bg-background/60 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-syn-red/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-syn-amber/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-syn-green/80" />
        <span className="ml-2 truncate text-xs text-muted">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function ListCard({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn(cardStyles, "flex items-center gap-3 p-3", className)} {...props} />;
}

export function StatTile({ value, label, className }: { value: React.ReactNode; label: string; className?: string }) {
  return (
    <div className={cn(cardStyles, "px-2 py-2", className)}>
      <div className="truncate text-[11px] text-muted">{label}</div>
      <div className="text-lg font-semibold tabular-nums text-syn-orange">{value}</div>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm text-muted">{"// "}{children}</h2>;
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">{children}</div>
  );
}
