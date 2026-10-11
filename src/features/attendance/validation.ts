import { isStatus } from "./status";
import { NOTE_MAX, type DayInput } from "./types";

type Result = { ok: true; data: DayInput } | { ok: false; error: string };

export function parseDayForm(formData: FormData): Result {
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!isStatus(status)) return { ok: false, error: "Pick a status" };
  if (note.length > NOTE_MAX) return { ok: false, error: `Note must be at most ${NOTE_MAX} characters` };

  return { ok: true, data: { status, note } };
}
