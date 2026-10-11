import { Card, StatTile } from "@/components/ui/Card";
import { formatMoney } from "@/lib/money";
import type { DebtSummary } from "../summary";

export function DebtSummaryView({ summary }: { summary: DebtSummary }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <StatTile label="you_owe" value={<span className="text-syn-red">{formatMoney(summary.outstanding)}</span>} />
        <StatTile label="repaid" value={<span className="text-syn-green">{formatMoney(summary.repaid)}</span>} />
        <StatTile
          label="overdue"
          value={<span className={summary.overdueCount ? "text-syn-red" : "text-muted"}>{summary.overdueCount}</span>}
        />
      </div>
      {summary.byLender.length > 1 && (
        <Card className="space-y-1 p-3 text-sm">
          {summary.byLender.map((l) => (
            <div key={l.lender} className="flex justify-between gap-3">
              <span className="truncate text-syn-blue">{l.lender}</span>
              <span className="tabular-nums">{formatMoney(l.amount)}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
