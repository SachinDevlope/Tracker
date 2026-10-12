import { Suspense } from "react";
import { buttonStyles } from "@/components/ui/Button";
import { EmptyState, SectionLabel } from "@/components/ui/Card";
import { MonthNavigator } from "@/components/ui/MonthNavigator";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { requireAuth } from "@/features/auth/session";
import { listExpenses } from "@/features/expenses/service";
import { groupByDate, summarizeExpenses } from "@/features/expenses/summary";
import { AddExpenseForm } from "@/features/expenses/components/AddExpenseForm";
import { ExpenseList } from "@/features/expenses/components/ExpenseList";
import { ExpenseSummaryView } from "@/features/expenses/components/ExpenseSummaryView";
import { StatementImport } from "@/features/statements/components/StatementImport";
import { formatDate, monthEnd, monthOf, today, validMonth } from "@/lib/date";

async function ExpensesContent({ searchParams }: { searchParams: PageProps<"/expenses">["searchParams"] }) {
  await requireAuth();
  const now = today();
  const currentMonth = monthOf(now);
  const month = validMonth((await searchParams).month, currentMonth);
  const end = monthEnd(month);
  const expenses = await listExpenses(`${month}-01`, end);

  // Average over days so far for the current month
  const lastDay = month === currentMonth ? now : end;
  const daysElapsed = month > currentMonth ? 0 : Number(lastDay.slice(8));
  const groups = groupByDate(expenses).map((g) => ({ ...g, label: formatDate(g.date, "short") }));

  return (
    <div className="space-y-4">
      <AddExpenseForm today={now} />
      <StatementImport />
      <MonthNavigator basePath="/expenses" month={month} currentMonth={currentMonth} />
      <ExpenseSummaryView summary={summarizeExpenses(expenses, daysElapsed)} />
      <div className="flex items-center justify-between">
        <SectionLabel>{expenses.length} entries</SectionLabel>
        {expenses.length > 0 && (
          <a href={`/api/expenses/export?month=${month}`} className={buttonStyles({ variant: "secondary", size: "sm" })}>
            export csv
          </a>
        )}
      </div>
      {expenses.length === 0 ? <EmptyState>{"// no expenses this month"}</EmptyState> : <ExpenseList groups={groups} />}
    </div>
  );
}

export default function ExpensesPage({ searchParams }: PageProps<"/expenses">) {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <ExpensesContent searchParams={searchParams} />
    </Suspense>
  );
}
