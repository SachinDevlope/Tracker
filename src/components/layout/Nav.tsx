"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", label: "today", file: "today.tsx", icon: "M12 8v4l3 2M12 3a9 9 0 100 18 9 9 0 000-18z" },
  { href: "/calendar", label: "calendar", file: "calendar.tsx", icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  { href: "/expenses", label: "expenses", file: "expenses.ts", icon: "M6 3h12M6 8h12M14 21L6 13h3a5 5 0 000-10" },
  { href: "/debts", label: "debts", file: "debts.ts", icon: "M3 7h18v12H3zM3 11h18M7 15h4M16 3l-4 4-4-4" },
  { href: "/reports", label: "reports", file: "reports.csv", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

export function DesktopNav() {
  const isActive = useIsActive();
  return (
    <nav className="hidden self-end lg:flex">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            "-mb-px border-x border-t px-3 py-2 text-sm",
            isActive(l.href)
              ? "rounded-t-md border-border border-t-syn-green bg-background text-foreground"
              : "border-transparent text-muted hover:text-foreground",
          )}
        >
          {l.file}
        </Link>
      ))}
    </nav>
  );
}

export function MobileTabBar() {
  const isActive = useIsActive();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 text-xs",
              isActive(l.href) ? "text-syn-green" : "text-muted",
            )}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d={l.icon} />
            </svg>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
