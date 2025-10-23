"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ROUTES } from "@/lib/routes";
import { useGameStore } from "@/stores/useGameStore";
import { GameRoomSkeleton } from "../skeletons";
import { DesktopGameView } from "./desktop-game-view";
import { GameHeader } from "./game-header";
import { GameNotFound } from "./game-not-found";
import { MobileGameView } from "./mobile-game-view";

type GameRoomClientProps = {
  gameId: string;
};

export const GameRoomClient = ({ gameId }: Readonly<GameRoomClientProps>) => {
  const router = useRouter();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showPokerHands, setShowPokerHands] = useState(false);

  const {
    game,
    players,
    moves,
    loading,
    currentUsername,
    setGameId,
    fetchPlayers,
    fetchGame,
    fetchMoves,
    subscribeToChanges,
    setCurrentUsername,
    handlePotAction,
    handleKickPlayer,
  } = useGameStore();

  // Wrapper for pot actions with error handling
  const executePotAction = useCallback(
    async (playerId: string, amount: number, action_type: "add" | "remove") => {
      try {
        await handlePotAction(playerId, amount, action_type);
      } catch {
        toast.error("Error handling pot action", {
          description: "Changes have been reverted",
        });
      }
    },
    [handlePotAction]
  );

  // Wrapper for kick player with error handling
  const executeKickPlayer = useCallback(
    async (playerId: string) => {
      try {
        await handleKickPlayer(playerId);
        toast.success("Success", { description: "Player removed from game" });
      } catch {
        toast.error("Error kicking player");
      }
    },
    [handleKickPlayer]
  );

  // Initialize game ID and fetch data
  useEffect(() => {
    const initializeGame = async () => {
      setGameId(gameId);
      const gameData = await fetchGame();
      if (!gameData) {
        router.push(ROUTES.HOME); // Redirect if game not found
      }

      fetchPlayers();
      fetchMoves();
    };

    initializeGame();

    const unsubscribe = subscribeToChanges();
    return unsubscribe;
  }, [
    gameId,
    setGameId,
    fetchGame,
    fetchPlayers,
    fetchMoves,
    subscribeToChanges,
    router,
  ]);

  // Load current user from localStorage
  useEffect(() => {
    const currentPlayer = localStorage.getItem("currentPlayer");
    if (currentPlayer) {
      setCurrentUsername(JSON.parse(currentPlayer).name);
    }
  }, [setCurrentUsername]);

  // Handle loading and not found states
  if (loading.game) {
    return <GameRoomSkeleton />;
  }

  if (!game) {
    return <GameNotFound onRetry={() => router.push(ROUTES.HOME)} />;
  }

  // Redirect if user is not in game or not authenticated
  if (!loading.players) {
    if (!currentUsername) {
      router.push(ROUTES.JOIN_WITH_CODE(game.code));
      return null;
    }

    const inGame = players
      .map((player) => player.name)
      .includes(currentUsername);

    if (!inGame) {
      router.push(ROUTES.JOIN_WITH_CODE(game.code));
      return null;
    }
  }

  return (
    <div className="min-h-screen">
      <GameHeader
        currentUsername={currentUsername}
        gameCode={game.code}
        gameId={game.id}
        gameName={game.name}
        onKickPlayer={executeKickPlayer}
        players={players}
      />

      <div className="mx-auto max-w-7xl space-y-3 p-4">
        {/* Mobile view */}
        <MobileGameView
          currentUsername={currentUsername}
          executePotAction={executePotAction}
          game={game}
          loading={loading}
          moves={moves}
          players={players}
          setShowAnalysis={setShowAnalysis}
          setShowPokerHands={setShowPokerHands}
          showAnalysis={showAnalysis}
          showPokerHands={showPokerHands}
        />

        {/* Desktop view */}
        <DesktopGameView
          currentUsername={currentUsername}
          executePotAction={executePotAction}
          game={game}
          loading={loading}
          moves={moves}
          players={players}
        />
      </div>
    </div>
  );
};
