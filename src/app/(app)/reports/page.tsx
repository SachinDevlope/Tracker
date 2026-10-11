import { Suspense } from "react";
import { EmptyState, SectionLabel } from "@/components/ui/Card";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { requireAuth } from "@/features/auth/session";
import { listDays } from "@/features/attendance/service";
import { summarize } from "@/features/attendance/summary";
import { SummaryTiles } from "@/features/attendance/components/SummaryTiles";
import { parseRange } from "@/features/reports/range";
import { EntryList } from "@/features/reports/components/EntryList";
import { ReportFilters } from "@/features/reports/components/ReportFilters";

async function ReportContent({ searchParams }: { searchParams: PageProps<"/reports">["searchParams"] }) {
  await requireAuth();
  const range = parseRange(await searchParams);
  const entries = await listDays(range.from, range.to);

  return (
    <div className="space-y-4">
      <ReportFilters {...range} />
      <SummaryTiles summary={summarize(entries)} />
      <p className="text-xs text-muted">
        {"// attendance = (office + ½·half_day) / (marked days − leave − holiday)"}
      </p>
      <SectionLabel>{entries.length} entries</SectionLabel>
      {entries.length === 0 ? <EmptyState>{"// nothing logged in this range"}</EmptyState> : <EntryList entries={entries} />}
    </div>
  );
}

export default function ReportsPage({ searchParams }: PageProps<"/reports">) {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <ReportContent searchParams={searchParams} />
    </Suspense>
  );
}
