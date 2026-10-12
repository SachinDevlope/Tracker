import { StatTile } from "@/components/ui/Card";
import { STATUSES, STATUS_META } from "../status";
import { RATE_GOOD, type Summary } from "../summary";
import { formatDuration } from "../time";

export function SummaryTiles({ summary }: { summary: Summary }) {
  const rateClass = !summary.workingDays ? "text-muted" : summary.rate >= RATE_GOOD ? "text-syn-green" : "text-syn-amber";

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <StatTile
          label="attendance"
          value={<span className={rateClass}>{summary.workingDays ? `${summary.rate}%` : "—"}</span>}
        />
        <StatTile label="total_hrs" value={formatDuration(summary.totalMinutes)} />
        <StatTile label="avg/day" value={formatDuration(summary.avgMinutes)} />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {STATUSES.map((s) => (
          <StatTile
            key={s}
            label={STATUS_META[s].label}
            value={<span className={STATUS_META[s].textClass}>{summary.counts[s]}</span>}
          />
        ))}
        <StatTile label="late" value={<span className={summary.late ? "text-syn-red" : "text-muted"}>{summary.late}</span>} />
      </div>
    </div>
  );
}
