import { Suspense } from "react";
import { EmptyState, ListCard, SectionLabel, Window } from "@/components/ui/Card";
import { Collapsible } from "@/components/ui/Collapsible";
import { MonthNavigator } from "@/components/ui/MonthNavigator";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { requireAuth } from "@/features/auth/session";
import { balanceDue, getSettings, listMeals, listPayments } from "@/features/tiffin/service";
import { mealsByDate, summarizeMeals } from "@/features/tiffin/summary";
import { MEALS, priceFor } from "@/features/tiffin/types";
import { MealToggle } from "@/features/tiffin/components/MealToggle";
import { PaymentForm } from "@/features/tiffin/components/PaymentForm";
import { PaymentList } from "@/features/tiffin/components/PaymentList";
import { SettingsForm } from "@/features/tiffin/components/SettingsForm";
import { TiffinSummaryView } from "@/features/tiffin/components/TiffinSummaryView";
import { cn } from "@/lib/cn";
import { datesBetween, formatDate, monthEnd, monthOf, today, validMonth, weekday } from "@/lib/date";
import { formatMoney } from "@/lib/money";

async function TiffinContent({ searchParams }: { searchParams: PageProps<"/tiffin">["searchParams"] }) {
  await requireAuth();
  const now = today();
  const currentMonth = monthOf(now);
  const month = validMonth((await searchParams).month, currentMonth);
  const end = monthEnd(month);
  const [settings, meals, payments, due] = await Promise.all([
    getSettings(),
    listMeals(`${month}-01`, end),
    listPayments(`${month}-01`, end),
    balanceDue(),
  ]);
  const todayMeals = month === currentMonth ? meals : await listMeals(now, now);
  const byDate = mealsByDate(meals);
  const todayTaken = mealsByDate(todayMeals)[now];
  // Days up to today, newest first
  const days = month > currentMonth ? [] : datesBetween(`${month}-01`, end < now ? end : now).reverse();
  // Prices are optional; billing UI shows once any price or payment exists
  const billing = MEALS.some((m) => priceFor(settings, m)) || payments.length > 0 || due !== 0;

  return (
    <div className="space-y-4">
      <Window title={settings?.vendor ? `tiffin/${settings.vendor}` : "tiffin/today"}>
        <div className="mb-2 text-sm text-muted">{formatDate(now)}</div>
        <div className="flex gap-2">
          {MEALS.map((m) => (
            <MealToggle key={m} date={now} meal={m} on={Boolean(todayTaken?.[m])} size="lg" detail={priceFor(settings, m) ? formatMoney(priceFor(settings, m)) : undefined} />
          ))}
        </div>
      </Window>

      <MonthNavigator basePath="/tiffin" month={month} currentMonth={currentMonth} />
      <TiffinSummaryView summary={summarizeMeals(meals)} paid={payments.reduce((n, p) => n + p.amount, 0)} due={due} />
      {billing && <p className="text-xs text-muted">{"// bill + paid are for this month · balance is all-time"}</p>}

      <SectionLabel>days</SectionLabel>
      {days.length === 0 ? (
        <EmptyState>{"// nothing to mark yet"}</EmptyState>
      ) : (
        <ul className="space-y-1">
          {days.map((d) => (
            <ListCard key={d} className={cn("py-2", weekday(d) === 0 && "bg-background/60")}>
              <span className={cn("min-w-0 flex-1 text-sm", d === now && "text-syn-green")}>{formatDate(d, "short")}</span>
              {MEALS.map((m) => (
                <MealToggle key={m} date={d} meal={m} on={Boolean(byDate[d]?.[m])} />
              ))}
            </ListCard>
          ))}
        </ul>
      )}

      {billing && (
        <Window title="tiffin/pay.ts">
          <PaymentForm today={now} due={due} />
        </Window>
      )}
      {payments.length > 0 && (
        <>
          <SectionLabel>{payments.length} payments this month</SectionLabel>
          <PaymentList payments={payments.map((p) => ({ ...p, label: formatDate(p.date, "short") }))} />
        </>
      )}

      <Collapsible label={billing ? "prices & vendor" : "add prices (optional)"}>
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
