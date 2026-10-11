import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { env } from "@/lib/env";
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, safeEqual, verifySessionToken } from "./token";

export function checkPassword(password: string) {
  return safeEqual(password, env.ADMIN_PASSWORD);
}

export async function isLoggedIn() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  // Clock read must run per request
  await connection();
  return verifySessionToken(token, env.AUTH_SECRET);
}

// Real auth check (proxy only redirects)
export async function requireAuth() {
  if (!(await isLoggedIn())) redirect("/login");
}

export async function startSession() {
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(env.AUTH_SECRET), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
