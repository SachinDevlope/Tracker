import "server-only";
import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { NAME_MAX } from "@/lib/form";
import { dateField, noteField, paiseField } from "@/lib/schema";

const PaymentSchema = new Schema({
  date: dateField,
  amount: paiseField(),
  note: noteField(),
});

const DebtSchema = new Schema(
  {
    lender: { type: String, required: true, trim: true, maxlength: NAME_MAX },
    amount: paiseField(),
    borrowedOn: dateField,
    dueOn: { ...dateField, required: false, default: null },
    note: noteField(),
    payments: { type: [PaymentSchema], default: [] },
  },
  { timestamps: true },
);

type DebtDoc = InferSchemaType<typeof DebtSchema>;

export const DebtModel: Model<DebtDoc> = (models.Debt as Model<DebtDoc>) || model<DebtDoc>("Debt", DebtSchema, "debts");
