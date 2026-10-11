import { Button, buttonStyles } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import type { DateRange } from "../range";

// Plain GET form: works without JS and keeps the range in the URL
export function ReportFilters({ from, to }: DateRange) {
  return (
    <Card className="p-4">
      <form className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
        <Field label="From">
          <Input type="date" name="from" defaultValue={from} className="bg-background" />
        </Field>
        <Field label="To">
          <Input type="date" name="to" defaultValue={to} className="bg-background" />
        </Field>
        <Button>Apply</Button>
        <a href={`/api/export?from=${from}&to=${to}`} className={buttonStyles({ variant: "secondary" })}>
          Export CSV
        </a>
      </form>
    </Card>
  );
}
