import "server-only";
import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { NAME_MAX } from "@/lib/form";
import { dateField, noteField, paiseField } from "@/lib/schema";
import { MEALS } from "./types";

const MealSchema = new Schema(
  {
    date: dateField,
    meal: { type: String, enum: MEALS, required: true },
    price: paiseField(0),
  },
  { timestamps: true },
);
MealSchema.index({ date: 1, meal: 1 }, { unique: true });

// Single document, key "default"
const SettingsSchema = new Schema({
  key: { type: String, required: true, unique: true },
  lunchPrice: paiseField(0),
  dinnerPrice: paiseField(0),
  vendor: { type: String, default: "", trim: true, maxlength: NAME_MAX },
});

const PaymentSchema = new Schema(
  {
    date: dateField,
    amount: paiseField(),
    note: noteField(),
  },
  { timestamps: true },
);
PaymentSchema.index({ date: -1 });

type MealDoc = InferSchemaType<typeof MealSchema>;
type SettingsDoc = InferSchemaType<typeof SettingsSchema>;
type PaymentDoc = InferSchemaType<typeof PaymentSchema>;

export const TiffinMealModel: Model<MealDoc> =
  (models.TiffinMeal as Model<MealDoc>) || model<MealDoc>("TiffinMeal", MealSchema, "tiffin_meals");
export const TiffinSettingsModel: Model<SettingsDoc> =
  (models.TiffinSettings as Model<SettingsDoc>) || model<SettingsDoc>("TiffinSettings", SettingsSchema, "tiffin_settings");
export const TiffinPaymentModel: Model<PaymentDoc> =
  (models.TiffinPayment as Model<PaymentDoc>) || model<PaymentDoc>("TiffinPayment", PaymentSchema, "tiffin_payments");
