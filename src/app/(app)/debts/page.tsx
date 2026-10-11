import { Suspense } from "react";
import { EmptyState, SectionLabel } from "@/components/ui/Card";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { requireAuth } from "@/features/auth/session";
import { listDebts } from "@/features/debts/service";
import { dueState, summarizeDebts } from "@/features/debts/summary";
import type { Debt } from "@/features/debts/types";
import { AddDebtForm } from "@/features/debts/components/AddDebtForm";
import { DebtCard, type DebtView } from "@/features/debts/components/DebtCard";
import { DebtSummaryView } from "@/features/debts/components/DebtSummaryView";
import { formatDate, today as getToday } from "@/lib/date";

const DUE_PREFIX = { overdue: "overdue since", soon: "due", ok: "due", none: "", settled: "" } as const;

function toView(debt: Debt, today: string): DebtView {
  const due = dueState(debt, today);
  return {
    ...debt,
    due,
    dueLabel: debt.dueOn && DUE_PREFIX[due] ? `${DUE_PREFIX[due]} ${formatDate(debt.dueOn, "short")}` : due === "settled" ? "✔ paid off" : "",
    borrowedLabel: `since ${formatDate(debt.borrowedOn, "short")}`,
    paymentLabels: Object.fromEntries(debt.payments.map((p) => [p.id, formatDate(p.date, "short")])),
  };
}

async function DebtsContent() {
  await requireAuth();
  const today = getToday();
  const debts = await listDebts();
  const views = debts.map((d) => toView(d, today));
  // Overdue first, then nearest due date
  const open = views
    .filter((d) => d.remaining > 0)
    .sort((a, b) => (a.dueOn ?? "9999").localeCompare(b.dueOn ?? "9999"));
  const settled = views.filter((d) => d.remaining === 0);

  return (
    <div className="space-y-4">
      <DebtSummaryView summary={summarizeDebts(debts, today)} />
      <AddDebtForm today={today} />

      <SectionLabel>{open.length} open</SectionLabel>
      {open.length === 0 ? (
        <EmptyState>{"// debt-free. nice."}</EmptyState>
      ) : (
        <div className="space-y-2">
          {open.map((d) => (
            <DebtCard key={d.id} debt={d} today={today} />
          ))}
        </div>
      )}

      {settled.length > 0 && (
        <details className="group space-y-2">
          <summary className="cursor-pointer list-none text-sm text-muted">
            <span className="inline-block transition-transform group-open:rotate-90">›</span> {settled.length} settled
          </summary>
          <div className="mt-2 space-y-2">
            {settled.map((d) => (
              <DebtCard key={d.id} debt={d} today={today} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

export default function DebtsPage() {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <DebtsContent />
    </Suspense>
  );
}
