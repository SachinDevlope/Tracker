import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import { formatMonth, shiftMonth } from "@/lib/date";

const navButton = buttonStyles({ variant: "secondary", size: "icon", className: "text-lg" });

export function MonthNavigator({ basePath, month, currentMonth }: { basePath: string; month: string; currentMonth: string }) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`${basePath}?month=${shiftMonth(month, -1)}`} aria-label="Previous month" className={navButton}>
        ‹
      </Link>
      <div className="flex-1 text-center">
        <div className="font-semibold">{formatMonth(month)}</div>
        {month !== currentMonth && (
          <Link href={basePath} className="text-xs text-muted underline">
            this month
          </Link>
        )}
      </div>
      <Link href={`${basePath}?month=${shiftMonth(month, 1)}`} aria-label="Next month" className={navButton}>
        ›
      </Link>
    </div>
  );
}
