import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { handleCronAuth } from "./lib/middleware/cron-auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathName = request.nextUrl.pathname;

  if (pathName.startsWith("/api/cron/") && request.method === "GET") {
    return handleCronAuth(request);
  }

  if (pathName.startsWith("/images/") || pathname.startsWith("/icons/")) {
    return NextResponse.next();
  }

  return request;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
};
