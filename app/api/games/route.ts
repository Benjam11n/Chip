import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const { name, maxPlayers = 10, initialBuyIn = 500 } = await request.json();

    // Generate a unique 6-character game code
    const code = nanoid(6);

    const { data: game, error } = await supabase
      .from("games")
      .insert({
        name,
        code,
        max_players: maxPlayers,
        initial_buy_in: initialBuyIn,
        is_locked: false,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Game creation error:", error);

    return NextResponse.json({ error: "Failed to create game" }, {
      status: 500,
    });
  }
}
