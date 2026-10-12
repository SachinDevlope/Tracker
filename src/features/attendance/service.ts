import "server-only";
import { connectDB } from "@/lib/db";
import { formatClock } from "@/lib/date";
import { DayModel, type DayDoc } from "./model";
import { LATE_AFTER, type Status } from "./status";
import type { BackfillDay, DayEntry, DayInput } from "./types";

// DB access only; callers handle auth

function toEntry(doc: DayDoc): DayEntry {
  const checkInAt = doc.checkInAt ? doc.checkInAt.toISOString() : null;
  return {
    date: doc.date,
    status: doc.status as Status,
    checkInAt,
    checkOutAt: doc.checkOutAt ? doc.checkOutAt.toISOString() : null,
    note: doc.note ?? "",
    late: !!checkInAt && formatClock(checkInAt) > LATE_AFTER,
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

export async function saveDay(date: string, input: DayInput) {
  await connectDB();
  await DayModel.updateOne({ date }, { $set: input }, { upsert: true, runValidators: true });
}

// Adds only days with no entry yet; returns how many were added
export async function backfillDays(days: BackfillDay[]) {
  await connectDB();
  const result = await DayModel.bulkWrite(
    days.map(({ date, ...fields }) => ({
      updateOne: { filter: { date }, update: { $setOnInsert: fields }, upsert: true },
    })),
  );
  return result.upsertedCount;
}

export async function deleteDay(date: string) {
  await connectDB();
  await DayModel.deleteOne({ date });
}

// Once per day; new day defaults to present
export async function checkIn(date: string, at: Date) {
  await connectDB();
  try {
    await DayModel.updateOne(
      { date, checkInAt: null },
      { $set: { checkInAt: at }, $setOnInsert: { status: "present" } },
      { upsert: true },
    );
  } catch (err) {
    // Already checked in
    if ((err as { code?: number }).code !== 11000) throw err;
  }
}

export async function checkOut(date: string, at: Date) {
  await connectDB();
  await DayModel.updateOne({ date, checkInAt: { $ne: null }, checkOutAt: null }, { $set: { checkOutAt: at } });
}
