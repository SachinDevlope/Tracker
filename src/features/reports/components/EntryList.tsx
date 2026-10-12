import Link from "next/link";
import { ListCard } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatClock, formatDate } from "@/lib/date";
import { STATUS_META } from "@/features/attendance/status";
import { formatDuration, workedMinutes } from "@/features/attendance/time";
import type { DayEntry } from "@/features/attendance/types";

export function EntryList({ entries }: { entries: DayEntry[] }) {
  return (
    <ul className="space-y-2">
      {[...entries].reverse().map((e) => (
        <ListCard key={e.date} className="p-0">
          <Link href={`/?date=${e.date}`} className="flex w-full items-center gap-3 p-3">
            <span className={cn("w-20 shrink-0 rounded-md py-1 text-center text-xs font-semibold", STATUS_META[e.status].cellClass)}>
              {STATUS_META[e.status].label}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{formatDate(e.date, "short")}</div>
              <div className="truncate text-xs text-muted">
                {e.checkInAt ? `${formatClock(e.checkInAt)} → ${formatClock(e.checkOutAt)}` : "// no punch"}
                {e.late && <span className="text-syn-red"> · late</span>}
                {e.note && ` · ${e.note}`}
              </div>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-syn-orange">
              {formatDuration(workedMinutes(e.checkInAt, e.checkOutAt))}
            </span>
          </Link>
        </ListCard>
      ))}
    </ul>
  );
}
