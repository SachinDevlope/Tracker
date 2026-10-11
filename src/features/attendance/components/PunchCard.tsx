import { Button } from "@/components/ui/Button";
import { Window } from "@/components/ui/Card";
import { formatClock } from "@/lib/date";
import { checkInAction, checkOutAction } from "../actions";
import { formatDuration, workedMinutes } from "../time";
import type { DayEntry } from "../types";

function Line({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className={accent ? "font-semibold tabular-nums text-syn-orange" : "font-semibold tabular-nums text-foreground"}>
        {value}
      </span>
    </div>
  );
}

// Check-in / check-out timestamps. Buttons only on today; past days are read-only.
export function PunchCard({ entry, isToday, now }: { entry: DayEntry | null; isToday: boolean; now: string }) {
  const checkInAt = entry?.checkInAt ?? null;
  const checkOutAt = entry?.checkOutAt ?? null;
  const running = isToday && checkInAt && !checkOutAt;
  const worked = workedMinutes(checkInAt, running ? now : checkOutAt);

  return (
    <Window title="~/work — zsh">
      <div className="space-y-3 text-sm">
        <p>
          <span className="text-syn-green">❯</span> <span className="text-syn-blue">punch</span> --log
        </p>
        <div className="space-y-1 border-l-2 border-border pl-3">
          <Line label="check_in" value={formatClock(checkInAt)} />
          <Line label="check_out" value={formatClock(checkOutAt)} />
          <Line label={running ? "worked (running)" : "worked"} value={formatDuration(worked)} accent />
        </div>
        {isToday &&
          (!checkInAt ? (
            <form action={checkInAction}>
              <Button className="w-full py-3">$ check_in</Button>
            </form>
          ) : !checkOutAt ? (
            <form action={checkOutAction}>
              <Button variant="danger" className="w-full py-3">
                $ check_out
              </Button>
            </form>
          ) : (
            <p className="text-syn-green">✔ shift logged. go touch grass.</p>
          ))}
      </div>
    </Window>
  );
}
