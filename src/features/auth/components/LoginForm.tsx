"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Window } from "@/components/ui/Card";
import { FormError } from "@/components/ui/Input";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <Window title="~ — login" className="w-full max-w-sm">
      <form action={action} className="space-y-4 text-sm">
        <div className="space-y-1">
          <p>
            <span className="text-syn-green">❯</span> <span className="text-syn-blue">ssh</span> me@attendance.log
          </p>
          <p className="text-muted">{"// personal attendance tracker"}</p>
        </div>
        <label className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 focus-within:border-syn-green/70">
          <span className="text-syn-purple">password:</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            className="min-w-0 flex-1 bg-transparent text-foreground caret-syn-green outline-none"
          />
        </label>
        <FormError message={state?.error} />
        <Button disabled={pending} className="w-full py-3">
          {pending ? "authenticating…" : "$ login"}
        </Button>
      </form>
    </Window>
  );
}
