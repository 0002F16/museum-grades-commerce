import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge runtime: cheap cookie-presence checks only. Full verification happens
// server-side — the account page via auth.api.getSession, and the admin layout
// via verifyAdmin() (HMAC). Never trust these presence checks alone.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin gate ── (login page stays public so it can render)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const adminCookie = request.cookies.get("mg_admin");
    if (!adminCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // ── Account gate ──
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
