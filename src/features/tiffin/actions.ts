"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/features/auth/session";
import { createExpense } from "@/features/expenses/service";
import { isDateString, today } from "@/lib/date";
import { NOTE_MAX, type FormState } from "@/lib/form";
import { addPayment, deletePayment, getSettings, saveSettings, setMeal } from "./service";
import { isMeal, type Meal } from "./types";
import { parsePaymentForm, parseSettingsForm } from "./validation";

function refresh() {
  revalidatePath("/tiffin");
  revalidatePath("/dashboard");
}

export async function setMealAction(date: string, meal: Meal, on: boolean): Promise<{ error?: string }> {
  await requireAuth();
  if (!isDateString(date) || date > today() || !isMeal(meal)) return { error: "Invalid day" };
  const settings = await getSettings();
  const price = settings?.[meal === "lunch" ? "lunchPrice" : "dinnerPrice"];
  if (!price) return { error: `Set a ${meal} price first` };

  await setMeal(date, meal, Boolean(on), price);
  refresh();
  return {};
}

export async function saveSettingsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const parsed = parseSettingsForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  await saveSettings(parsed.data);
  refresh();
  return { doneAt: Date.now() };
}

export async function addPaymentAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const parsed = parsePaymentForm(formData, today());
  if (!parsed.ok) return { error: parsed.error };

  await addPayment(parsed.data);
  // Optional mirror into expenses so spending totals include tiffin
  if (formData.get("logExpense") === "on") {
    const vendor = (await getSettings())?.vendor;
    const note = ["tiffin", vendor, parsed.data.note].filter(Boolean).join(" · ").slice(0, NOTE_MAX);
    await createExpense({ date: parsed.data.date, amount: parsed.data.amount, category: "food", note });
    revalidatePath("/expenses");
  }
  refresh();
  return { doneAt: Date.now() };
}

export async function deletePaymentAction(id: string) {
  await requireAuth();
  await deletePayment(id);
  refresh();
}
