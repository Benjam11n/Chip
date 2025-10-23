import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  try {
    // Perform a lightweight weekly fetch: get total games count
    const { count, error } = await supabase
      .from("games")
      .select("*", { count: "exact", head: true });

    if (error) {
      logger.error({ error }, "Weekly Supabase fetch error");
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    logger.info({ count }, "Weekly Supabase fetch succeeded");
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ err }, "Weekly Supabase fetch failed");
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
