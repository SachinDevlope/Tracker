// Shared form parsing + action state

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export type FormState = { error?: string; doneAt?: number } | undefined;

export const NOTE_MAX = 200;
export const NAME_MAX = 60;

export function field(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function noteError(note: string, max = NOTE_MAX) {
  return note.length > max ? `Note must be at most ${max} characters` : null;
}
