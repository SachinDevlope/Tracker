import Link from "next/link";
import { Button, buttonStyles } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { rangePresets, type DateRange } from "../range";

export function RangeFilters({ from, to, today }: DateRange & { today: string }) {
  const query = `from=${from}&to=${to}`;

  return (
    <Card className="space-y-3 p-4">
      <div className="flex flex-wrap gap-2">
        {rangePresets(today).map((p) => (
          <Link
            key={p.label}
            href={`/dashboard?from=${p.from}&to=${p.to}`}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs",
              p.from === from && p.to === to
                ? "border-syn-green bg-syn-green/15 text-syn-green"
                : "border-border text-muted hover:text-foreground",
            )}
          >
            {p.label}
          </Link>
        ))}
      </div>
      <form className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label="from">
          <Input type="date" name="from" defaultValue={from} className="bg-background" />
        </Field>
        <Field label="to">
          <Input type="date" name="to" defaultValue={to} className="bg-background" />
        </Field>
        <Button className="col-span-2 sm:col-span-1">apply</Button>
      </form>
      <div className="flex gap-2">
        <a href={`/api/export?${query}`} className={buttonStyles({ variant: "secondary", size: "sm" })}>
          attendance.csv
        </a>
        <a href={`/api/expenses/export?${query}`} className={buttonStyles({ variant: "secondary", size: "sm" })}>
          expenses.csv
        </a>
      </div>
    </Card>
  );
}
