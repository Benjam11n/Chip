import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { serverEnv } from "@/env";

export function handleCronAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${serverEnv.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.next();
}
