import "server-only";
import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { dateField, noteField } from "@/lib/schema";
import { STATUSES } from "./status";
import { DAY_NOTE_MAX } from "./types";

const DaySchema = new Schema(
  {
    date: { ...dateField, unique: true },
    status: { type: String, enum: STATUSES, required: true },
    checkInAt: { type: Date, default: null },
    checkOutAt: { type: Date, default: null },
    note: noteField(DAY_NOTE_MAX),
  },
  { timestamps: true },
);

export type DayDoc = InferSchemaType<typeof DaySchema>;

export const DayModel: Model<DayDoc> =
  (models.AttendanceDay as Model<DayDoc>) || model<DayDoc>("AttendanceDay", DaySchema, "attendance_days");
