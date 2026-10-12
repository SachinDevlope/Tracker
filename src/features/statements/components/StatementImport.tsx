"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Window } from "@/components/ui/Card";
import { Field, FormError, Input, fieldStyles } from "@/components/ui/Input";
import { CATEGORIES, CATEGORY_META, type Category } from "@/features/expenses/categories";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/money";
import { importExpensesAction } from "../actions";
import { MAX_PDF_BYTES, type Candidate, type ExtractResult } from "../types";

type Row = Candidate & { selected: boolean };

const shortDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export function StatementImport() {
  const [open, setOpen] = useState(false);
  const [reading, setReading] = useState(false);
  const [needPassword, setNeedPassword] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Omit<ExtractResult, "candidates"> | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [done, setDone] = useState<number | null>(null);
  const [importing, startImport] = useTransition();

  const selected = rows.filter((r) => r.selected);
  const update = (i: number, patch: Partial<Row>) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  async function upload(formData: FormData) {
    const file = formData.get("file");
    if (file instanceof File && file.size > MAX_PDF_BYTES) return setError("PDF must be under 4 MB");
    setError("");
    setDone(null);
    setReading(true);
    try {
      const res = await fetch("/api/expenses/statement", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({ error: "Server error — try again" }));
      if (!res.ok) {
        setNeedPassword(Boolean(data.needPassword) || needPassword);
        return setError(data.error ?? "Couldn't read the statement");
      }
      const { candidates, ...rest } = data as ExtractResult;
      setResult(rest);
      setRows(candidates.map((c) => ({ ...c, selected: !c.duplicate })));
    } catch {
      setError("Upload failed — check your connection");
    } finally {
      setReading(false);
    }
  }

  function importSelected() {
    startImport(async () => {
      const res = await importExpensesAction(
        selected.map((r) => ({ date: r.date, amount: r.amount, category: r.category, note: r.description })),
      );
      if (res.error) return setError(res.error);
      setDone(res.imported ?? 0);
      setRows([]);
      setResult(null);
    });
  }

  function reset() {
    setRows([]);
    setResult(null);
    setError("");
    setDone(null);
  }

  if (!open) {
    return (
      <Button variant="secondary" className="w-full py-3" onClick={() => setOpen(true)}>
        + import_statement()
      </Button>
    );
  }

  return (
    <Window title="statements/import.pdf">
      {!result ? (
        <form action={upload} className="space-y-4">
          <Field label="statement_pdf">
            <input
              type="file"
              name="file"
              accept="application/pdf,.pdf"
              required
              className={cn(fieldStyles, "file:mr-3 file:rounded file:border-0 file:bg-syn-green/15 file:px-3 file:py-1 file:text-syn-green")}
            />
          </Field>
          <Field label={needPassword ? "pdf_password (required)" : "pdf_password"}>
            <Input type="password" name="password" autoComplete="off" placeholder="// only if the PDF is locked" />
          </Field>
          <p className="text-xs text-muted">
            {"// read in memory, never stored · text goes to Groq AI · debits only, you review before saving"}
          </p>
          <FormError message={error} />
          {done !== null && <p className="text-sm text-syn-green">✔ imported {done} expenses</p>}
          <div className="flex gap-2">
            <Button disabled={reading} className="flex-1 py-3">
              {reading ? "reading statement… (up to a minute)" : "$ extract"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              close
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <p className="text-sm">
            <span className="text-syn-orange">{rows.length}</span> debits found
            <span className="text-muted">
              {" "}· {result.credits} credits skipped
              {rows.some((r) => r.duplicate) && ` · ${rows.filter((r) => r.duplicate).length} already saved (unticked)`}
              {result.dropped > 0 && ` · ${result.dropped} unreadable`}
            </span>
          </p>

          {rows.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.length === rows.length}
                  onChange={(e) => setRows((rs) => rs.map((r) => ({ ...r, selected: e.target.checked })))}
                  className="h-4 w-4 accent-[var(--syn-green)]"
                />
                select all
              </label>
              <span className="tabular-nums text-syn-orange">{formatMoney(selected.reduce((n, r) => n + r.amount, 0))}</span>
            </div>
          )}

          <ul className="max-h-[60vh] space-y-1 overflow-y-auto">
            {rows.map((r, i) => (
              <li key={i} className={cn("flex items-center gap-2 rounded-md border border-border p-2", !r.selected && "opacity-50")}>
                <input
                  type="checkbox"
                  checked={r.selected}
                  onChange={(e) => update(i, { selected: e.target.checked })}
                  className="h-4 w-4 shrink-0 accent-[var(--syn-green)]"
                  aria-label="Include"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{r.description || "—"}</div>
                  <div className="text-xs text-muted">
                    {shortDate(r.date)}
                    {r.duplicate && <span className="text-syn-amber"> · already saved?</span>}
                  </div>
                </div>
                <select
                  value={r.category}
                  onChange={(e) => update(i, { category: e.target.value as Category })}
                  className={cn("rounded border border-border bg-background px-1 py-1 text-xs", CATEGORY_META[r.category].textClass)}
                  aria-label="Category"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <span className="w-20 shrink-0 text-right text-sm font-semibold tabular-nums">{formatMoney(r.amount)}</span>
              </li>
            ))}
          </ul>

          <FormError message={error} />
          <div className="flex gap-2">
            <Button disabled={importing || !selected.length} className="flex-1 py-3" onClick={importSelected}>
              {importing ? "importing…" : `$ import ${selected.length}`}
            </Button>
            <Button variant="ghost" onClick={reset}>
              back
            </Button>
          </div>
        </div>
      )}
    </Window>
  );
}
