"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/features/auth/session";
import type { FormState } from "@/lib/form";
import { createExpense, deleteExpense } from "./service";
import { parseExpenseForm } from "./validation";

export async function addExpenseAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const parsed = parseExpenseForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  await createExpense(parsed.data);
  revalidatePath("/expenses");
  return { doneAt: Date.now() };
}

export async function deleteExpenseAction(id: string) {
  await requireAuth();
  await deleteExpense(id);
  revalidatePath("/expenses");
}
