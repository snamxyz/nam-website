import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import type { AdminSession } from "@/lib/auth";

const sessionOptions = {
  password: process.env.SESSION_SECRET ?? "fallback-session-secret-min-32-chars",
  cookieName: "nam_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
  },
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const session = await getIronSession<AdminSession>(
    request,
    response,
    sessionOptions,
  );

  if (!session.isLoggedIn) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
