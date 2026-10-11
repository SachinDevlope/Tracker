"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/features/auth/session";
import { addPayment, createDebt, deleteDebt, deletePayment } from "./service";
import { parseDebtForm, parsePaymentForm } from "./validation";

export type FormState = { error?: string; doneAt?: number } | undefined;

export async function addDebtAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const parsed = parseDebtForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  await createDebt(parsed.data);
  revalidatePath("/debts");
  return { doneAt: Date.now() };
}

export async function addPaymentAction(debtId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const parsed = parsePaymentForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const error = await addPayment(debtId, parsed.data);
  if (error) return { error };
  revalidatePath("/debts");
  return { doneAt: Date.now() };
}

export async function deletePaymentAction(debtId: string, paymentId: string) {
  await requireAuth();
  await deletePayment(debtId, paymentId);
  revalidatePath("/debts");
}

export async function deleteDebtAction(id: string) {
  await requireAuth();
  await deleteDebt(id);
  revalidatePath("/debts");
}
