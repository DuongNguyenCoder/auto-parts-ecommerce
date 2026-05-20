import { NextResponse } from "next/server";

export const middleware = () => NextResponse.next();

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
