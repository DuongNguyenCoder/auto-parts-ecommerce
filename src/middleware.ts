import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getEdgeSession } from "@/lib/auth/edge-session";
import { isAdmin } from "@/lib/auth/permissions";

const adminPathPrefix = "/admin";
const loginPath = "/dang-nhap";

const createLoginRedirect = (request: NextRequest) => {
  const loginUrl = new URL(loginPath, request.url);

  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(loginUrl);
};

export const middleware = async (request: NextRequest) => {
  if (!request.nextUrl.pathname.startsWith(adminPathPrefix)) {
    return NextResponse.next();
  }

  const session = await getEdgeSession(request);

  if (!session) {
    return createLoginRedirect(request);
  }

  if (!isAdmin(session.user.role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/admin/:path*"],
};
