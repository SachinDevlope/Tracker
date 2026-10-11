import Link from "next/link";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { DesktopNav, MobileTabBar } from "./Nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-4">
          <Link href="/" className="text-sm font-semibold">
            <span className="text-syn-green">❯</span> attendance<span className="text-muted">.log</span>
            <span className="cursor-blink text-syn-green">_</span>
          </Link>
          <DesktopNav />
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 pt-4 pb-28 sm:pb-10">{children}</main>
      <MobileTabBar />
    </>
  );
}
