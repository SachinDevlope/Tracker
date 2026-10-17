import Link from "next/link";
import { Suspense } from "react";
import { BarChart } from "@/components/ui/BarChart";
import { Collapsible } from "@/components/ui/Collapsible";
import { EmptyState, ListCard, SectionLabel } from "@/components/ui/Card";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { requireAuth } from "@/features/auth/session";
import { listDays } from "@/features/attendance/service";
import { summarize } from "@/features/attendance/summary";
import { formatDuration, workedMinutes } from "@/features/attendance/time";
import { SummaryTiles } from "@/features/attendance/components/SummaryTiles";
import { parseRange } from "@/features/dashboard/range";
import { bucketize } from "@/features/dashboard/trend";
import { EntryList } from "@/features/dashboard/components/EntryList";
import { RangeFilters } from "@/features/dashboard/components/RangeFilters";
import { listDebts } from "@/features/debts/service";
import { dueState, summarizeDebts } from "@/features/debts/summary";
import { DebtSummaryView } from "@/features/debts/components/DebtSummaryView";
import { balanceDue, listMeals } from "@/features/tiffin/service";
import { summarizeMeals } from "@/features/tiffin/summary";
import { TiffinSummaryView } from "@/features/tiffin/components/TiffinSummaryView";
import { listExpenses } from "@/features/expenses/service";
import { summarizeExpenses } from "@/features/expenses/summary";
import { ExpenseSummaryView } from "@/features/expenses/components/ExpenseSummaryView";
import { cn } from "@/lib/cn";
import { daysSoFar, formatDate, today } from "@/lib/date";
import { formatMoney } from "@/lib/money";

const GRAIN_LABEL = { day: "per day", week: "per week", month: "per month" };

function Section({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <SectionLabel>{title}</SectionLabel>
        <Link href={href} className="text-xs text-syn-blue hover:underline">
          open →
        </Link>
      </div>
      {children}
    </section>
  );
}

async function DashboardContent({ searchParams }: { searchParams: PageProps<"/dashboard">["searchParams"] }) {
  await requireAuth();
  const now = today();
  const range = parseRange(await searchParams);
  const [entries, expenses, debts, meals, tiffinDue] = await Promise.all([
    listDays(range.from, range.to),
    listExpenses(range.from, range.to),
    listDebts(),
    listMeals(range.from, range.to),
    balanceDue(),
  ]);

  const hours = bucketize(range, entries, (e) => e.date, (e) => workedMinutes(e.checkInAt, e.checkOutAt));
  const spend = bucketize(range, expenses, (e) => e.date, (e) => e.amount);
  const upcoming = debts
    .filter((d) => d.remaining > 0 && d.dueOn)
    .sort((a, b) => a.dueOn!.localeCompare(b.dueOn!))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <RangeFilters {...range} today={now} />

      <Section title="attendance" href="/calendar">
        <SummaryTiles summary={summarize(entries)} />
        <BarChart title={`hours ${GRAIN_LABEL[hours.grain]}`} bars={hours.buckets} format={formatDuration} barClass="bg-syn-blue" />
      </Section>

      <Section title="spending" href="/expenses">
        <ExpenseSummaryView summary={summarizeExpenses(expenses, daysSoFar(range.from, range.to, now))} />
        {expenses.length > 0 && (
          <BarChart title={`spent ${GRAIN_LABEL[spend.grain]}`} bars={spend.buckets} format={formatMoney} barClass="bg-syn-orange" />
        )}
      </Section>

      <Section title="tiffin" href="/tiffin">
        <TiffinSummaryView summary={summarizeMeals(meals)} due={tiffinDue} />
      </Section>

      <Section title="debts · as of today" href="/debts">
        {debts.length === 0 ? (
          <EmptyState>{"// no debts"}</EmptyState>
        ) : (
          <>
            <DebtSummaryView summary={summarizeDebts(debts, now)} />
            {upcoming.length > 0 && (
              <ul className="space-y-1">
                {upcoming.map((d) => {
                  const state = dueState(d, now);
                  return (
                    <ListCard key={d.id} className="py-2 text-sm">
                      <span className="min-w-0 flex-1 truncate text-syn-blue">{d.lender}</span>
                      <span className={cn("text-xs", state === "overdue" ? "text-syn-red" : state === "soon" ? "text-syn-amber" : "text-muted")}>
                        {state === "overdue" ? "overdue" : "due"} {formatDate(d.dueOn!, "short")}
                      </span>
                      <span className="tabular-nums">{formatMoney(d.remaining)}</span>
                    </ListCard>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </Section>

      <Collapsible label={`attendance_log (${entries.length})`}>
        {entries.length === 0 ? <EmptyState>{"// nothing logged in this range"}</EmptyState> : <EntryList entries={entries} />}
      </Collapsible>
    </div>
  );
}

export default function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}
