import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { datesBetween, monthEnd, weekday } from "@/lib/date";
import { STATUSES, STATUS_META, WEEKEND_DAYS } from "@/features/attendance/status";
import type { DayEntry } from "@/features/attendance/types";

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Monday-first month grid; each day links to its editor
export function MonthGrid({ month, entries, today }: { month: string; entries: DayEntry[]; today: string }) {
  const byDate = new Map(entries.map((e) => [e.date, e]));
  const days = datesBetween(`${month}-01`, monthEnd(month));
  const leadingBlanks = (weekday(days[0]) + 6) % 7;

  return (
    <Card className="p-3">
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted">
        {WEEK_LABELS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((date) => {
          const entry = byDate.get(date);
          const isWeekend = WEEKEND_DAYS.includes(weekday(date));
          return (
            <Link
              key={date}
              href={`/?date=${date}`}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-md text-sm",
                entry ? STATUS_META[entry.status].cellClass : isWeekend ? "bg-background/40 text-muted/60" : "border border-border bg-background",
                date === today && "ring-2 ring-syn-green ring-offset-1 ring-offset-card",
                date > today && !entry && "opacity-50",
              )}
            >
              <span className="font-semibold tabular-nums">{Number(date.slice(8))}</span>
              {entry && <span className="text-[9px] leading-none opacity-90">{STATUS_META[entry.status].short}</span>}
            </Link>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-muted">
        {STATUSES.map((s) => (
          <span key={s} className="flex items-center gap-1">
            <span className={cn("h-2.5 w-2.5 rounded-sm", STATUS_META[s].cellClass)} />
            {STATUS_META[s].label}
          </span>
        ))}
      </div>
    </Card>
  );
}
