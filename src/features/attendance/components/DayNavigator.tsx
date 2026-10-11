import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import { formatDate, shiftDate } from "@/lib/date";
import { DatePicker } from "./DatePicker";

const navButton = buttonStyles({ variant: "secondary", size: "icon", className: "text-lg" });

export function DayNavigator({ date, today }: { date: string; today: string }) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/?date=${shiftDate(date, -1)}`} aria-label="Previous day" className={navButton}>
        ‹
      </Link>
      <div className="min-w-0 flex-1 text-center">
        <div className="truncate font-semibold">{formatDate(date)}</div>
        {date === today ? (
          <div className="text-xs text-syn-green">{"// today"}</div>
        ) : (
          <Link href="/" className="text-xs text-muted underline">
            cd ~/today
          </Link>
        )}
      </div>
      <Link href={`/?date=${shiftDate(date, 1)}`} aria-label="Next day" className={navButton}>
        ›
      </Link>
      <DatePicker value={date} />
    </div>
  );
}
