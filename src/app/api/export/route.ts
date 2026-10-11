import type { NextRequest } from "next/server";
import { csvResponse } from "@/lib/csv";
import { isLoggedIn } from "@/features/auth/session";
import { listDays } from "@/features/attendance/service";
import { parseRange } from "@/features/reports/range";
import { entriesToCsv } from "@/features/reports/csv";

export async function GET(request: NextRequest) {
  if (!(await isLoggedIn())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const params = request.nextUrl.searchParams;
  const range = parseRange({ from: params.get("from"), to: params.get("to") });
  const csv = entriesToCsv(await listDays(range.from, range.to));
  return csvResponse(csv, `attendance_${range.from}_to_${range.to}.csv`);
}
