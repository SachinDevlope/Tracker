import "server-only";
import { connectDB } from "@/lib/db";
import { DayModel, type DayDoc } from "./model";
import type { Status } from "./status";
import type { DayEntry, DayInput } from "./types";

// Data access only: no auth, no cache revalidation. Callers handle those.

function toEntry(doc: DayDoc): DayEntry {
  return {
    date: doc.date,
    status: doc.status as Status,
    checkInAt: doc.checkInAt ? doc.checkInAt.toISOString() : null,
    checkOutAt: doc.checkOutAt ? doc.checkOutAt.toISOString() : null,
    note: doc.note ?? "",
  };
}

export async function getDay(date: string): Promise<DayEntry | null> {
  await connectDB();
  const doc = await DayModel.findOne({ date }).lean();
  return doc ? toEntry(doc) : null;
}

export async function listDays(from: string, to: string): Promise<DayEntry[]> {
  await connectDB();
  const docs = await DayModel.find({ date: { $gte: from, $lte: to } })
    .sort({ date: 1 })
    .lean();
  return docs.map(toEntry);
}

// Updates status + note only; timestamps are never edited by hand
export async function saveDay(date: string, input: DayInput) {
  await connectDB();
  await DayModel.updateOne({ date }, { $set: input }, { upsert: true, runValidators: true });
}

export async function deleteDay(date: string) {
  await connectDB();
  await DayModel.deleteOne({ date });
}

// Check in once per day; marks the day "present" if nothing was set yet
export async function checkIn(date: string, at: Date) {
  await connectDB();
  try {
    await DayModel.updateOne(
      { date, checkInAt: null },
      { $set: { checkInAt: at }, $setOnInsert: { status: "present" } },
      { upsert: true },
    );
  } catch (err) {
    // Upsert hits the unique index when the day is already checked in: nothing to do
    if ((err as { code?: number }).code !== 11000) throw err;
  }
}

// Check out only after checking in, and only once
export async function checkOut(date: string, at: Date) {
  await connectDB();
  await DayModel.updateOne({ date, checkInAt: { $ne: null }, checkOutAt: null }, { $set: { checkOutAt: at } });
}
