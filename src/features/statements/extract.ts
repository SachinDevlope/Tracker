import "server-only";
import { CATEGORIES, isCategory } from "@/features/expenses/categories";
import { listExpenses } from "@/features/expenses/service";
import { isDateString } from "@/lib/date";
import { MAX_PAISE } from "@/lib/money";
import { groqJson } from "./groq";
import type { Candidate, ExtractResult } from "./types";

// ~3-4k tokens per request keeps under Groq free-tier per-minute limits
const CHUNK_CHARS = 12000;

const SYSTEM = `You extract transactions from Indian bank account statement text.
Return JSON: {"transactions":[{"date":"YYYY-MM-DD","amount":123.45,"type":"debit"|"credit","description":"...","category":"..."}]}
Rules:
- Include every transaction row in the text, nothing else. Skip opening/closing balance, totals, headers, page footers.
- amount: positive number in rupees, no commas or currency symbols. Never use the running balance column.
- type: "debit" = money out (withdrawal, Dr, paid). "credit" = money in (deposit, Cr, salary, refund).
  Columns are aligned by position under the header row (e.g. Withdrawal vs Deposit). If unclear, a falling running balance means debit.
- date: convert DD/MM/YYYY, DD-MM-YY, DD MMM YYYY etc. to YYYY-MM-DD. Day comes before month.
- description: short payee/merchant, e.g. "UPI/DR/4123/SWIGGY LTD/YESB/..." -> "Swiggy". Max 60 chars.
- category: for debits pick one of ${CATEGORIES.join(", ")}; use "other" if unsure.
- A transaction may span several lines; merge them into one.
Output only the JSON object.`;

function chunk(lines: string[]) {
  const chunks: string[] = [];
  let cur = "";
  for (const line of lines) {
    if (cur && cur.length + line.length > CHUNK_CHARS) {
      chunks.push(cur);
      cur = "";
    }
    cur += line + "\n";
  }
  if (cur.trim()) chunks.push(cur);
  return chunks;
}

type Raw = { date?: unknown; amount?: unknown; type?: unknown; description?: unknown; category?: unknown };

function toCandidate(t: Raw, today: string): Candidate | null {
  const amount = typeof t.amount === "number" ? t.amount : Number(String(t.amount ?? "").replace(/[,₹\s]/g, ""));
  const paise = Math.round(amount * 100);
  if (!isDateString(t.date) || t.date > today || t.date < "2000-01-01") return null;
  if (!Number.isFinite(paise) || paise <= 0 || paise > MAX_PAISE) return null;
  return {
    date: t.date,
    amount: paise,
    description: String(t.description ?? "").trim().slice(0, 120),
    category: isCategory(t.category) ? t.category : "other",
    duplicate: false,
  };
}

// Marks rows matching saved expenses (same date + amount), one match each
async function markDuplicates(candidates: Candidate[]) {
  if (!candidates.length) return;
  const dates = candidates.map((c) => c.date).sort();
  const existing = await listExpenses(dates[0], dates[dates.length - 1]);
  const pool = new Map<string, number>();
  for (const e of existing) pool.set(`${e.date}|${e.amount}`, (pool.get(`${e.date}|${e.amount}`) ?? 0) + 1);
  for (const c of candidates) {
    const key = `${c.date}|${c.amount}`;
    const left = pool.get(key) ?? 0;
    if (left > 0) {
      c.duplicate = true;
      pool.set(key, left - 1);
    }
  }
}

export async function extractDebits(lines: string[], today: string): Promise<ExtractResult> {
  const parts = chunk(lines);
  if (!parts.length) throw new Error("No text found — is this a scanned image PDF?");

  const candidates: Candidate[] = [];
  let credits = 0;
  let dropped = 0;
  for (const [i, part] of parts.entries()) {
    const out = (await groqJson(SYSTEM, `Statement text (part ${i + 1} of ${parts.length}):\n${part}`)) as { transactions?: Raw[] };
    for (const t of Array.isArray(out?.transactions) ? out.transactions : []) {
      if (t.type === "credit") {
        credits++;
        continue;
      }
      const c = toCandidate(t, today);
      if (c) candidates.push(c);
      else dropped++;
    }
  }

  candidates.sort((a, b) => b.date.localeCompare(a.date));
  await markDuplicates(candidates);
  return { candidates, credits, dropped };
}
