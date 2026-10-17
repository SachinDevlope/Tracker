import { Suspense } from "react";
import { EmptyState, ListCard, SectionLabel, Window } from "@/components/ui/Card";
import { Collapsible } from "@/components/ui/Collapsible";
import { MonthNavigator } from "@/components/ui/MonthNavigator";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { requireAuth } from "@/features/auth/session";
import { balanceDue, getSettings, listMeals, listPayments } from "@/features/tiffin/service";
import { mealsByDate, summarizeMeals } from "@/features/tiffin/summary";
import { MEALS, type TiffinSettings } from "@/features/tiffin/types";
import { MealToggle } from "@/features/tiffin/components/MealToggle";
import { PaymentForm } from "@/features/tiffin/components/PaymentForm";
import { PaymentList } from "@/features/tiffin/components/PaymentList";
import { SettingsForm } from "@/features/tiffin/components/SettingsForm";
import { TiffinSummaryView } from "@/features/tiffin/components/TiffinSummaryView";
import { cn } from "@/lib/cn";
import { datesBetween, formatDate, monthEnd, monthOf, today, validMonth, weekday } from "@/lib/date";
import { formatMoney } from "@/lib/money";

const priceOf = (s: TiffinSettings, meal: (typeof MEALS)[number]) => (meal === "lunch" ? s.lunchPrice : s.dinnerPrice);

async function TiffinContent({ searchParams }: { searchParams: PageProps<"/tiffin">["searchParams"] }) {
  await requireAuth();
  const now = today();
  const currentMonth = monthOf(now);
  const month = validMonth((await searchParams).month, currentMonth);
  const end = monthEnd(month);
  const settings = await getSettings();

  if (!settings) {
    return (
      <Window title="tiffin/config.ts">
        <p className="mb-3 text-sm text-muted">{"// set your tiffin prices to start tracking"}</p>
        <SettingsForm settings={null} />
      </Window>
    );
  }

  const [meals, payments, due] = await Promise.all([listMeals(`${month}-01`, end), listPayments(`${month}-01`, end), balanceDue()]);
  const todayMeals = month === currentMonth ? meals : await listMeals(now, now);
  const byDate = mealsByDate(meals);
  const todayTaken = mealsByDate(todayMeals)[now];
  const offered = MEALS.filter((m) => priceOf(settings, m) > 0);
  // Days up to today, newest first
  const days = month > currentMonth ? [] : datesBetween(`${month}-01`, end < now ? end : now).reverse();

  return (
    <div className="space-y-4">
      <Window title={settings.vendor ? `tiffin/${settings.vendor}` : "tiffin/today"}>
        <div className="mb-2 text-sm text-muted">{formatDate(now)}</div>
        <div className="flex gap-2">
          {offered.map((m) => (
            <MealToggle key={m} date={now} meal={m} on={Boolean(todayTaken?.[m])} size="lg" detail={formatMoney(priceOf(settings, m))} />
          ))}
        </div>
      </Window>

      <MonthNavigator basePath="/tiffin" month={month} currentMonth={currentMonth} />
      <TiffinSummaryView summary={summarizeMeals(meals)} paid={payments.reduce((n, p) => n + p.amount, 0)} due={due} />
      <p className="text-xs text-muted">{"// bill + paid are for this month · balance is all-time"}</p>

      <SectionLabel>days</SectionLabel>
      {days.length === 0 ? (
        <EmptyState>{"// nothing to mark yet"}</EmptyState>
      ) : (
        <ul className="space-y-1">
          {days.map((d) => (
            <ListCard key={d} className={cn("py-2", weekday(d) === 0 && "bg-background/60")}>
              <span className={cn("min-w-0 flex-1 text-sm", d === now && "text-syn-green")}>{formatDate(d, "short")}</span>
              {offered.map((m) => (
                <MealToggle key={m} date={d} meal={m} on={Boolean(byDate[d]?.[m])} />
              ))}
            </ListCard>
          ))}
        </ul>
      )}

      <Window title="tiffin/pay.ts">
        <PaymentForm today={now} due={due} />
      </Window>
      {payments.length > 0 && (
        <>
          <SectionLabel>{payments.length} payments this month</SectionLabel>
          <PaymentList payments={payments.map((p) => ({ ...p, label: formatDate(p.date, "short") }))} />
        </>
      )}

      <Collapsible label={`config: lunch ${formatMoney(settings.lunchPrice)} · dinner ${formatMoney(settings.dinnerPrice)}`}>
        <Window title="tiffin/config.ts">
          <SettingsForm settings={settings} />
        </Window>
      </Collapsible>
    </div>
  );
}

export default function TiffinPage({ searchParams }: PageProps<"/tiffin">) {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <TiffinContent searchParams={searchParams} />
    </Suspense>
  );
}
