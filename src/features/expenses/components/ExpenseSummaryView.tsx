import { Card, StatTile } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { CATEGORY_META } from "../categories";
import { formatMoney } from "@/lib/money";
import type { ExpenseSummary } from "../summary";

export function ExpenseSummaryView({ summary }: { summary: ExpenseSummary }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <StatTile label="total" value={formatMoney(summary.total)} />
        <StatTile label="avg/day" value={formatMoney(summary.dailyAvg)} />
        <StatTile label="entries" value={summary.count} />
      </div>

      {summary.categories.length > 0 && (
        <Card className="space-y-2 p-3">
          {summary.categories.map((c) => (
            <div key={c.category} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className={CATEGORY_META[c.category].textClass}>{c.category}</span>
                <span className="tabular-nums">
                  {formatMoney(c.amount)} <span className="text-muted">{Math.round(c.share * 100)}%</span>
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-background">
                <div className={cn("h-full rounded-full", CATEGORY_META[c.category].barClass)} style={{ width: `${Math.max(c.share * 100, 2)}%` }} />
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
