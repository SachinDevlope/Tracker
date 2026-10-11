"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/features/auth/session";
import { createExpense, deleteExpense } from "./service";
import { parseExpenseForm } from "./validation";

export type AddExpenseState = { error?: string; addedAt?: number } | undefined;

export async function addExpenseAction(_prev: AddExpenseState, formData: FormData): Promise<AddExpenseState> {
  await requireAuth();
  const parsed = parseExpenseForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  await createExpense(parsed.data);
  revalidatePath("/expenses");
  return { addedAt: Date.now() };
}

export async function deleteExpenseAction(id: string) {
  await requireAuth();
  await deleteExpense(id);
  revalidatePath("/expenses");
}
