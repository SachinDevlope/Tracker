import "server-only";
import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { DATE_RE } from "@/lib/date";
import { MAX_PAISE } from "@/lib/money";
import { DEBT_NOTE_MAX, LENDER_MAX } from "./types";

const paise = { type: Number, required: true, min: 1, max: MAX_PAISE, validate: Number.isInteger };

const PaymentSchema = new Schema({
  date: { type: String, required: true, match: DATE_RE },
  amount: paise,
  note: { type: String, default: "", trim: true, maxlength: DEBT_NOTE_MAX },
});

const DebtSchema = new Schema(
  {
    lender: { type: String, required: true, trim: true, maxlength: LENDER_MAX },
    amount: paise,
    borrowedOn: { type: String, required: true, match: DATE_RE },
    dueOn: { type: String, default: null, match: DATE_RE },
    note: { type: String, default: "", trim: true, maxlength: DEBT_NOTE_MAX },
    payments: { type: [PaymentSchema], default: [] },
  },
  { timestamps: true },
);

export type DebtDoc = InferSchemaType<typeof DebtSchema>;

export const DebtModel: Model<DebtDoc> = (models.Debt as Model<DebtDoc>) || model<DebtDoc>("Debt", DebtSchema, "debts");
