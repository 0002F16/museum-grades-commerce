import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Quick cookie check — the account page also does a full server-side session
// verify via auth.api.getSession before rendering any data.
export function middleware(request: NextRequest) {
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
  matcher: ["/account/:path*"],
};
