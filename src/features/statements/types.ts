import type { Category } from "@/features/expenses/categories";

// One debit found in a statement, ready for review
export type Candidate = {
  date: string; // YYYY-MM-DD
  amount: number; // paise
  description: string;
  category: Category;
  duplicate: boolean; // matches an expense already saved
};

export type ExtractResult = { candidates: Candidate[]; credits: number; dropped: number };

export const MAX_PDF_BYTES = 4 * 1024 * 1024;
export const MAX_IMPORT_ROWS = 500;
