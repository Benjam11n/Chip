"use client";

import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { logger } from "@/lib/logger";
import { supabase } from "@/lib/supabase/client";
import type { Game } from "@/types";

type UseGameLoaderOptions = {
  code: string;
};

export function useGameLoader({ code }: UseGameLoaderOptions) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState("");

  // Memoize loadGame function to prevent unnecessary recreations
  const loadGame = useCallback(async () => {
    try {
      const { data: game, error: fetchError } = await supabase
        .from("games")
        .select("*, players(*)")
        .eq("code", code)
        .single();

      if (fetchError) {
        throw new Error("An error occurred when fetching the game");
      }

      if (!game) {
        throw new Error("Game not found");
      }

      setGame({
        ...game,
        players: game.players || [],
      });

      try {
        // Generate QR code in parallel
        const url = window.location.href;
        const qr = await QRCode.toDataURL(url, {
          errorCorrectionLevel: "M",
          margin: 2,
          width: 256,
        });
        setQrCode(qr);
      } catch (qrError) {
        logger.error(qrError, "Failed to generate QR code");
        // Don't throw - QR code is non-critical
      }
    } catch (error) {
      logger.error(error, "Failed to load game");
      toast.error("Error", {
        description: "Game not found or invalid code",
      });
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    loadGame();

    // Set up real-time subscription with error handling
    const subscription = supabase
      .channel("game_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "games",
          filter: `code=eq.${code}`,
        },
        (payload) => {
          try {
            setGame(payload.new as Game);
          } catch (error) {
            logger.error(error, "Error processing game update");
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [code, loadGame]);

  return {
    game,
    loading,
    qrCode,
    reloadGame: loadGame,
  };
}
