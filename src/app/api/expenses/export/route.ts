import type { NextRequest } from "next/server";
import { csvResponse } from "@/lib/csv";
import { monthEnd, monthOf, today, validMonth } from "@/lib/date";
import { isLoggedIn } from "@/features/auth/session";
import { parseRange } from "@/features/dashboard/range";
import { listExpenses } from "@/features/expenses/service";
import { expensesToCsv } from "@/features/expenses/csv";

// ?month=YYYY-MM or ?from=&to=
export async function GET(request: NextRequest) {
  if (!(await isLoggedIn())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const params = request.nextUrl.searchParams;
  if (params.has("from") || params.has("to")) {
    const { from, to } = parseRange({ from: params.get("from"), to: params.get("to") });
    return csvResponse(expensesToCsv(await listExpenses(from, to)), `expenses_${from}_to_${to}.csv`);
  }
  const month = validMonth(params.get("month"), monthOf(today()));
  const csv = expensesToCsv(await listExpenses(`${month}-01`, monthEnd(month)));
  return csvResponse(csv, `expenses_${month}.csv`);
}
