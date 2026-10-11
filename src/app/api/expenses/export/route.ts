import type { NextRequest } from "next/server";
import { csvResponse } from "@/lib/csv";
import { monthEnd, monthOf, today, validMonth } from "@/lib/date";
import { isLoggedIn } from "@/features/auth/session";
import { listExpenses } from "@/features/expenses/service";
import { expensesToCsv } from "@/features/expenses/csv";

export async function GET(request: NextRequest) {
  if (!(await isLoggedIn())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const month = validMonth(request.nextUrl.searchParams.get("month"), monthOf(today()));
  const csv = expensesToCsv(await listExpenses(`${month}-01`, monthEnd(month)));
  return csvResponse(csv, `expenses_${month}.csv`);
}
