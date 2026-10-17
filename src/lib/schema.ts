import "server-only";
import { DATE_RE } from "./date";
import { NOTE_MAX } from "./form";
import { MAX_PAISE } from "./money";

// Reusable Mongoose field definitions
export const dateField = { type: String, required: true, match: DATE_RE };

export const paiseField = (min = 1) => ({ type: Number, required: true, min, max: MAX_PAISE, validate: Number.isInteger });

export const noteField = (max = NOTE_MAX) => ({ type: String, default: "", trim: true, maxlength: max });
