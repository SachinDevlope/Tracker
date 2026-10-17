import { StatTile } from "@/components/ui/Card";
import { formatMoney } from "@/lib/money";
import type { TiffinSummary } from "../summary";

export function TiffinSummaryView({ summary, paid, due }: { summary: TiffinSummary; paid?: number; due?: number }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <StatTile label="days_ordered" value={summary.daysOrdered} />
        <StatTile label="lunches" value={<span className="text-syn-amber">{summary.lunches}</span>} />
        <StatTile label="dinners" value={<span className="text-syn-purple">{summary.dinners}</span>} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatTile label="bill" value={formatMoney(summary.bill)} />
        {paid !== undefined && <StatTile label="paid" value={<span className="text-syn-green">{formatMoney(paid)}</span>} />}
        {due !== undefined && (
          <StatTile
            label={due < 0 ? "advance" : "balance_due"}
            value={<span className={due > 0 ? "text-syn-red" : "text-syn-green"}>{formatMoney(Math.abs(due))}</span>}
          />
        )}
      </div>
    </div>
  );
}
