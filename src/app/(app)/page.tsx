import { Suspense } from "react";
import { SectionLabel } from "@/components/ui/Card";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { requireAuth } from "@/features/auth/session";
import { getDay, listDays } from "@/features/attendance/service";
import { summarize } from "@/features/attendance/summary";
import { DayEditor } from "@/features/attendance/components/DayEditor";
import { DayNavigator } from "@/features/attendance/components/DayNavigator";
import { PunchCard } from "@/features/attendance/components/PunchCard";
import { SummaryTiles } from "@/features/attendance/components/SummaryTiles";
import { formatMonth, monthOf, monthStart, today, validDate } from "@/lib/date";

async function TodayContent({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  await requireAuth();
  const now = today();
  const date = validDate((await searchParams).date, now);
  const [entry, monthEntries] = await Promise.all([getDay(date), listDays(monthStart(now), now)]);

  return (
    <div className="space-y-4">
      <DayNavigator date={date} today={now} />
      <PunchCard entry={entry} isToday={date === now} now={new Date().toISOString()} />
      {/* key resets the form when the saved entry changes (e.g. after check in) */}
      <DayEditor key={`${date}:${entry?.status}:${entry?.note}`} date={date} entry={entry} />
      <SectionLabel>{formatMonth(monthOf(now)).toLowerCase()} so far</SectionLabel>
      <SummaryTiles summary={summarize(monthEntries)} />
    </div>
  );
}

export default function TodayPage({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <TodayContent searchParams={searchParams} />
    </Suspense>
  );
}
