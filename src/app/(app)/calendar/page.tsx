import { Suspense } from "react";
import { SectionLabel } from "@/components/ui/Card";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { requireAuth } from "@/features/auth/session";
import { listDays } from "@/features/attendance/service";
import { summarize } from "@/features/attendance/summary";
import { SummaryTiles } from "@/features/attendance/components/SummaryTiles";
import { MonthGrid } from "@/features/calendar/components/MonthGrid";
import { MonthNavigator } from "@/features/calendar/components/MonthNavigator";
import { monthEnd, monthOf, today, validMonth } from "@/lib/date";

async function CalendarContent({ searchParams }: { searchParams: PageProps<"/calendar">["searchParams"] }) {
  await requireAuth();
  const now = today();
  const month = validMonth((await searchParams).month, monthOf(now));
  const entries = await listDays(`${month}-01`, monthEnd(month));

  return (
    <div className="space-y-4">
      <MonthNavigator month={month} currentMonth={monthOf(now)} />
      <MonthGrid month={month} entries={entries} today={now} />
      <SectionLabel>month summary — tap a day to edit</SectionLabel>
      <SummaryTiles summary={summarize(entries)} />
    </div>
  );
}

export default function CalendarPage({ searchParams }: PageProps<"/calendar">) {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <CalendarContent searchParams={searchParams} />
    </Suspense>
  );
}
