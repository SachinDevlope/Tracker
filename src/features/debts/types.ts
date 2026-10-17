export type Payment = {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number; // paise
  note: string;
};

export type Debt = {
  id: string;
  lender: string;
  amount: number; // paise
  borrowedOn: string;
  dueOn: string | null;
  note: string;
  payments: Payment[];
  paid: number;
  remaining: number;
};

export type DebtInput = Pick<Debt, "lender" | "amount" | "borrowedOn" | "dueOn" | "note">;
export type PaymentInput = Omit<Payment, "id">;
