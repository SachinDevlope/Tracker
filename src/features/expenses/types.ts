import type { Category } from "./categories";

export type Expense = {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number; // paise
  category: Category;
  note: string;
};

export type ExpenseInput = Omit<Expense, "id">;

export const EXPENSE_NOTE_MAX = 200;
