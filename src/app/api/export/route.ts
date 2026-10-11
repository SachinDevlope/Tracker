import type { NextRequest } from "next/server";
import { isLoggedIn } from "@/features/auth/session";
import { listDays } from "@/features/attendance/service";
import { parseRange } from "@/features/reports/range";
import { entriesToCsv } from "@/features/reports/csv";

export async function GET(request: NextRequest) {
  if (!(await isLoggedIn())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const params = request.nextUrl.searchParams;
  const range = parseRange({ from: params.get("from"), to: params.get("to") });
  const csv = entriesToCsv(await listDays(range.from, range.to));

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="attendance_${range.from}_to_${range.to}.csv"`,
    },
  });
}
