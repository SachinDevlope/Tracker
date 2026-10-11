"use client";

import { useRouter } from "next/navigation";
import { buttonStyles } from "@/components/ui/Button";

// Calendar icon button that opens the native date picker and navigates to ?date=
export function DatePicker({ value }: { value: string }) {
  const router = useRouter();
  return (
    <label className={buttonStyles({ variant: "secondary", size: "icon", className: "relative cursor-pointer" })} aria-label="Pick a date">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      <input
        type="date"
        value={value}
        onChange={(e) => e.target.value && router.push(`/?date=${e.target.value}`)}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </label>
  );
}
