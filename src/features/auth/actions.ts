"use server";

import { redirect } from "next/navigation";
import { checkPassword, endSession, startSession } from "./session";

export type LoginState = { error?: string } | undefined;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { error: "permission denied" };
  await startSession();
  redirect("/");
}

export async function logout() {
  await endSession();
  redirect("/login");
}
