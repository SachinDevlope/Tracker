// Amounts are stored as integer paise
export const MAX_PAISE = 100_000_000_00; // ₹10 crore

const AMOUNT_RE = /^\d+(\.\d{1,2})?$/;

export function parseAmount(input: string): number | null {
  const s = input.replace(/[,\s₹]/g, "");
  if (!AMOUNT_RE.test(s)) return null;
  const [whole, frac = ""] = s.split(".");
  const paise = Number(whole) * 100 + Number(frac.padEnd(2, "0"));
  return paise > 0 && paise <= MAX_PAISE ? paise : null;
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

export function formatMoney(paise: number) {
  return inr.format(paise / 100);
}
