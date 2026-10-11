export type CsvColumn<T> = [title: string, get: (row: T) => string | number];

function cell(value: string | number) {
  const s = String(value);
  // Block spreadsheet formulas
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]) {
  const header = columns.map(([title]) => cell(title)).join(",");
  const lines = rows.map((r) => columns.map(([, get]) => cell(get(r))).join(","));
  // BOM for Excel
  return "﻿" + [header, ...lines].join("\r\n");
}

export function csvResponse(csv: string, filename: string) {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
