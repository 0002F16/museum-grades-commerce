import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// Standalone admin gate — intentionally separate from the customer-facing
// Better Auth accounts. A single HMAC-signed cookie proves admin access.
// Runs in the Node runtime (server actions / server components), NOT Edge.

const COOKIE = "mg_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret(): string {
  return process.env.ADMIN_SECRET ?? process.env.BETTER_AUTH_SECRET ?? "";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Validate the submitted username + password against the env credentials. */
export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  if (!u || !p) return false;
  // Compare both before returning to avoid leaking which field was wrong.
  const okUser = safeEqual(username, u);
  const okPass = safeEqual(password, p);
  return okUser && okPass;
}

/** Issue the signed admin cookie after a successful login. */
export async function setAdminCookie(): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = Buffer.from(JSON.stringify({ u: "admin", exp })).toString(
    "base64url"
  );
  const value = `${payload}.${sign(payload)}`;
  const store = await cookies();
  store.set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Remove the admin cookie (logout). */
export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/**
 * Full verification: recompute the HMAC, constant-time compare, and check the
 * expiry. Used by the admin layout and every write action — never trust the
 * middleware presence check alone.
 */
export async function verifyAdmin(): Promise<boolean> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return false;

  const dot = raw.lastIndexOf(".");
  if (dot < 0) return false;

  const payload = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (!safeEqual(sig, sign(payload))) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString());
    return (
      typeof parsed.exp === "number" &&
      parsed.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}
