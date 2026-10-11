import "server-only";
import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { DATE_RE } from "@/lib/date";
import { CATEGORIES } from "./categories";
import { MAX_PAISE } from "@/lib/money";
import { EXPENSE_NOTE_MAX } from "./types";

const ExpenseSchema = new Schema(
  {
    date: { type: String, required: true, match: DATE_RE },
    amount: { type: Number, required: true, min: 1, max: MAX_PAISE, validate: Number.isInteger },
    category: { type: String, enum: CATEGORIES, required: true },
    note: { type: String, default: "", trim: true, maxlength: EXPENSE_NOTE_MAX },
  },
  { timestamps: true },
);

ExpenseSchema.index({ date: -1, createdAt: -1 });

export type ExpenseDoc = InferSchemaType<typeof ExpenseSchema>;

export const ExpenseModel: Model<ExpenseDoc> =
  (models.Expense as Model<ExpenseDoc>) || model<ExpenseDoc>("Expense", ExpenseSchema, "expenses");
