import { cn } from "@/lib/cn";
import { Card } from "./Card";

type Bar = { key: string; label: string; value: number };

// CSS bar chart; thins x labels so they never crowd
export function BarChart({
  title,
  bars,
  format,
  barClass = "bg-syn-green",
}: {
  title: string;
  bars: Bar[];
  format: (value: number) => string;
  barClass?: string;
}) {
  const max = Math.max(...bars.map((b) => b.value), 0);
  const every = Math.ceil(bars.length / 10);

  return (
    <Card className="p-3">
      <div className="mb-2 flex justify-between text-xs text-muted">
        <span>{title}</span>
        <span className="tabular-nums">max {max ? format(max) : "—"}</span>
      </div>
      <div className="flex h-28 items-end gap-px">
        {bars.map((b) => (
          <div key={b.key} className="flex h-full flex-1 items-end" title={`${b.label}: ${format(b.value)}`}>
            <div
              className={cn("w-full rounded-t-sm", b.value ? barClass : "bg-border/50")}
              style={{ height: b.value && max ? `${Math.max((b.value / max) * 100, 3)}%` : "2px" }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-px text-[10px] text-muted">
        {bars.map((b, i) => (
          <span key={b.key} className="flex-1 overflow-visible whitespace-nowrap text-center">
            {i % every === 0 ? b.label : ""}
          </span>
        ))}
      </div>
    </Card>
  );
}
