"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/features/auth/session";
import { isDateString, today } from "@/lib/date";
import { backfillDays, checkIn, checkOut, deleteDay, saveDay } from "./service";
import { parseBackfillForm, parseDayForm } from "./validation";

export type SaveDayState = { error?: string; savedAt?: number } | undefined;
export type BackfillState = { error?: string; added?: number; skipped?: number } | undefined;

export async function saveDayAction(date: string, _prev: SaveDayState, formData: FormData): Promise<SaveDayState> {
  await requireAuth();
  if (!isDateString(date)) return { error: "Invalid date" };
  // Today uses punch buttons; past days take typed times
  const parsed = parseDayForm(formData, date < today() ? date : undefined);
  if (!parsed.ok) return { error: parsed.error };

  await saveDay(date, parsed.data);
  revalidatePath("/", "layout");
  return { savedAt: Date.now() };
}

export async function backfillAction(_prev: BackfillState, formData: FormData): Promise<BackfillState> {
  await requireAuth();
  const parsed = parseBackfillForm(formData, today());
  if (!parsed.ok) return { error: parsed.error };

  const added = await backfillDays(parsed.data);
  revalidatePath("/", "layout");
  return { added, skipped: parsed.data.length - added };
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
