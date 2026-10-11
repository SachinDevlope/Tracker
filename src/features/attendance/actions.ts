"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/features/auth/session";
import { isDateString, today } from "@/lib/date";
import { checkIn, checkOut, deleteDay, saveDay } from "./service";
import { parseDayForm } from "./validation";

export type SaveDayState = { error?: string; savedAt?: number } | undefined;

export async function saveDayAction(date: string, _prev: SaveDayState, formData: FormData): Promise<SaveDayState> {
  await requireAuth();
  if (!isDateString(date)) return { error: "Invalid date" };
  const parsed = parseDayForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  await saveDay(date, parsed.data);
  revalidatePath("/", "layout");
  return { savedAt: Date.now() };
}

export async function clearDayAction(date: string) {
  await requireAuth();
  if (!isDateString(date)) return;
  await deleteDay(date);
  revalidatePath("/", "layout");
}

// Server clock only
export async function checkInAction() {
  await requireAuth();
  await checkIn(today(), new Date());
  revalidatePath("/", "layout");
}

export async function checkOutAction() {
  await requireAuth();
  await checkOut(today(), new Date());
  revalidatePath("/", "layout");
}
