"use client";

import { ChipPicker } from "@/components/ui/ChipPicker";
import { STATUSES, STATUS_META, type Status } from "../status";

const OPTIONS = STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label, activeClass: STATUS_META[s].activeClass }));

export function StatusPicker({ value, onChange }: { value?: Status; onChange: (status: Status) => void }) {
  return <ChipPicker name="status" label="Status" options={OPTIONS} value={value} onChange={onChange} />;
}
