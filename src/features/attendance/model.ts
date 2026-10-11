import "server-only";
import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { DATE_RE } from "@/lib/date";
import { STATUSES } from "./status";
import { NOTE_MAX } from "./types";

const DaySchema = new Schema(
  {
    date: { type: String, required: true, unique: true, match: DATE_RE },
    status: { type: String, enum: STATUSES, required: true },
    checkInAt: { type: Date, default: null },
    checkOutAt: { type: Date, default: null },
    note: { type: String, default: "", trim: true, maxlength: NOTE_MAX },
  },
  { timestamps: true },
);

export type DayDoc = InferSchemaType<typeof DaySchema>;

export const DayModel: Model<DayDoc> =
  (models.AttendanceDay as Model<DayDoc>) || model<DayDoc>("AttendanceDay", DaySchema, "attendance_days");
