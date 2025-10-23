import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type GameInsert = Database["public"]["Tables"]["games"]["Insert"];

// todo: move to a constants file
const DEFAULT_MAX_PLAYERS = 10;
const DEFAULT_INITIAL_BUY_IN = 500;
const GAME_CODE_LENGTH = 6;

export async function POST(request: Request) {
  try {
    const {
      name,
      maxPlayers = DEFAULT_MAX_PLAYERS,
      initialBuyIn = DEFAULT_INITIAL_BUY_IN,
    } = await request.json();

    // Generate a unique 6-character game code
    const code = nanoid(GAME_CODE_LENGTH);

    // 2. Define the insert object explicitly using the generated type
    const insertData: GameInsert = {
      name,
      code,
      max_players: maxPlayers,
      initial_buy_in: initialBuyIn,
      is_locked: false,
    };

    // 3. The .insert() call now correctly matches an expected overload
    const { data: game, error } = await supabase
      .from("games")
      .insert(insertData) // <--- ERROR IS FIXED HERE
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(game);
  } catch (error) {
    logger.error(error, "Game creation error");

    return NextResponse.json(
      { error: "Failed to create game" },
      {
        status: 500,
      }
    );
  }
}
