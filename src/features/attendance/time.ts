export function workedMinutes(checkInAt: string | null, checkOutAt: string | null) {
  if (!checkInAt || !checkOutAt) return 0;
  const diff = Date.parse(checkOutAt) - Date.parse(checkInAt);
  return diff > 0 ? Math.round(diff / 60000) : 0;
}

export function formatDuration(minutes: number) {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}
