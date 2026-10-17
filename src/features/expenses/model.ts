import "server-only";
import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { dateField, noteField, paiseField } from "@/lib/schema";
import { CATEGORIES } from "./categories";

const ExpenseSchema = new Schema(
  {
    date: dateField,
    amount: paiseField(),
    category: { type: String, enum: CATEGORIES, required: true },
    note: noteField(),
  },
  { timestamps: true },
);

ExpenseSchema.index({ date: -1, createdAt: -1 });

export type ExpenseDoc = InferSchemaType<typeof ExpenseSchema>;

export const ExpenseModel: Model<ExpenseDoc> =
  (models.Expense as Model<ExpenseDoc>) || model<ExpenseDoc>("Expense", ExpenseSchema, "expenses");
