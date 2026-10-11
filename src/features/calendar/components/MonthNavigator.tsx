import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import { formatMonth, shiftMonth } from "@/lib/date";

const navButton = buttonStyles({ variant: "secondary", size: "icon", className: "text-lg" });

export function MonthNavigator({ month, currentMonth }: { month: string; currentMonth: string }) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/calendar?month=${shiftMonth(month, -1)}`} aria-label="Previous month" className={navButton}>
        ‹
      </Link>
      <div className="flex-1 text-center">
        <div className="font-semibold">{formatMonth(month)}</div>
        {month !== currentMonth && (
          <Link href="/calendar" className="text-xs text-muted underline">
            This month
          </Link>
        )}
      </div>
      <Link href={`/calendar?month=${shiftMonth(month, 1)}`} aria-label="Next month" className={navButton}>
        ›
      </Link>
    </div>
  );
}
