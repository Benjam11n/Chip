import { create } from "zustand";

import { logger } from "@/lib/logger";
import { supabase } from "@/lib/supabase/client";
import type { GameView, MoveHistoryView, PlayerView } from "@/types";

export type LoadingState = {
  game: boolean;
  players: boolean;
  moves: boolean;
};

type GameStore = {
  gameId: string | null;
  players: PlayerView[];
  game: GameView | null;
  moves: MoveHistoryView[];
  loading: LoadingState;
  currentUsername: string;
  actionLoading: boolean;
  setGameId: (id: string) => void;
  fetchPlayers: () => Promise<void>;
  fetchGame: () => Promise<GameView | undefined>;
  fetchMoves: () => Promise<void>;
  subscribeToChanges: () => () => void; // Returns unsubscribe function
  setCurrentUsername: (name: string) => void;
  handlePotAction: (
    playerId: string,
    amount: number,
    action_type: "add" | "remove"
  ) => Promise<void>;
  handleKickPlayer: (playerId: string) => Promise<void>;
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameId: null,
  players: [],
  game: null,
  moves: [],
  loading: { game: false, players: false, moves: false },
  currentUsername: "",
  actionLoading: false,

  setGameId: (id) => set({ gameId: id }),

  fetchPlayers: async () => {
    const { gameId } = get();
    if (!gameId) {
      return;
    }

    set({ loading: { ...get().loading, players: true } });
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("game_id", gameId);

      if (error) {
        throw error;
      }
      set({ players: data.map((p) => ({ ...p, totalBuyIn: p.total_buy_in })) });
    } catch (err) {
      logger.error(err, "Failed to fetch players");
    } finally {
      set({ loading: { ...get().loading, players: false } });
    }
  },

  fetchGame: async () => {
    const { gameId } = get();
    if (!gameId) {
      return;
    }

    set({ loading: { ...get().loading, game: true } });
    try {
      const { data: game, error } = await supabase
        .from("games")
        .select("id, name, pot, initial_buy_in, max_players, code")
        .eq("id", gameId)
        .single();

      if (error?.code === "PGRST116") {
        // Game not found
        // Handle redirect (e.g., via router in component)
        return;
      }
      if (error) {
        throw error;
      }

      set({ game });
      return game;
    } catch (err) {
      logger.error(err, "Failed to fetch game");
      return;
    } finally {
      set({ loading: { ...get().loading, game: false } });
    }
  },

  fetchMoves: async () => {
    const { gameId } = get();
    if (!gameId) {
      return;
    }

    set({ loading: { ...get().loading, moves: true } });
    try {
      const { data, error } = await supabase
        .from("game_actions")
        .select("*")
        .eq("game_id", gameId)
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }
      set({ moves: data.map((m) => ({ ...m, created_at: m.created_at })) });
    } catch (err) {
      logger.error(err, "Failed to fetch moves");
    } finally {
      set({ loading: { ...get().loading, moves: false } });
    }
  },

  subscribeToChanges: () => {
    const { gameId, fetchPlayers, fetchGame, fetchMoves } = get();
    if (!gameId) {
      return () => undefined;
    }

    const channel = supabase
      .channel(`room:${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `game_id=eq.${gameId}`,
        },
        fetchPlayers
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          const current = get().game;
          if (payload.new?.pot !== undefined) {
            if (current) {
              set({ game: { ...current, pot: payload.new.pot } });
            } else {
              fetchGame();
            }
          } else {
            fetchGame();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_actions",
          filter: `game_id=eq.${gameId}`,
        },
        fetchMoves
      );

    channel.subscribe();
    return () => channel.unsubscribe();
  },

  setCurrentUsername: (name) => set({ currentUsername: name }),

  handlePotAction: async (playerId, amount, action_type) => {
    const { game, players } = get();
    if (!game) {
      return;
    }

    try {
      set({ actionLoading: true });

      // Optimistic update
      const originalPlayers = [...players];
      const originalPot = game.pot;

      const updatedPlayers = players.map((player) =>
        player.id === playerId
          ? {
              ...player,
              stack:
                action_type === "add"
                  ? player.stack - amount
                  : player.stack + amount,
            }
          : player
      );

      const updatedPot =
        action_type === "add" ? game.pot + amount : game.pot - amount;

      set({
        players: updatedPlayers,
        game: { ...game, pot: updatedPot },
      });

      // Database update
      const { error } = await supabase.rpc("handle_pot_action", {
        p_player_id: playerId,
        p_game_id: game.id,
        p_amount: amount,
        p_action_type: action_type,
      });

      if (error) {
        // Rollback on error
        set({
          players: originalPlayers,
          game: { ...game, pot: originalPot },
        });
        throw error;
      }
    } catch (err) {
      logger.error(err, "Failed to handle pot action");
      throw err; // Throw to handle in component
    } finally {
      set({ actionLoading: false });
    }
  },

  handleKickPlayer: async (playerId) => {
    try {
      const { gameId } = get();
      if (!gameId) {
        return;
      }

      await supabase.rpc("set_config", {
        key: "app.current_game_id",
        value: gameId,
      });

      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", playerId);

      if (error) {
        throw error;
      }

      // Refresh players list
      await get().fetchPlayers();
    } catch (err) {
      logger.error(err, "Failed to kick player");
      throw err;
    }
  },
}));
