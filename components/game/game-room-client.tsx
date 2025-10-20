'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { useGameStore } from '@/stores/useGameStore';

import { GameRoomSkeleton } from '../skeletons';
import DesktopGameView from './desktop-game-view';
import GameHeader from './game-header';
import GameNotFound from './game-not-found';
import MobileGameView from './mobile-game-view';

interface GameRoomClientProps {
  gameId: string;
}

export function GameRoomClient({ gameId }: Readonly<GameRoomClientProps>) {
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
    async (playerId: string, amount: number, action_type: 'add' | 'remove') => {
      try {
        await handlePotAction(playerId, amount, action_type);
      } catch {
        toast.error('Error handling pot action', {
          description: 'Changes have been reverted',
        });
      }
    },
    [handlePotAction],
  );

  // Wrapper for kick player with error handling
  const executeKickPlayer = useCallback(
    async (playerId: string) => {
      try {
        await handleKickPlayer(playerId);
        toast.success('Success', { description: 'Player removed from game' });
      } catch {
        toast.error('Error kicking player');
      }
    },
    [handleKickPlayer],
  );

  // Initialize game ID and fetch data
  useEffect(() => {
    const initializeGame = async () => {
      setGameId(gameId);
      const gameData = await fetchGame();
      if (!gameData) router.push('/'); // Redirect if game not found

      fetchPlayers();
      fetchMoves();
    };

    initializeGame();

    const unsubscribe = subscribeToChanges();
    return unsubscribe;
  }, [gameId, setGameId, fetchGame, fetchPlayers, fetchMoves, subscribeToChanges, router]);

  // Load current user from localStorage
  useEffect(() => {
    const currentPlayer = localStorage.getItem('currentPlayer');
    if (currentPlayer) {
      setCurrentUsername(JSON.parse(currentPlayer).name);
    }
  }, [setCurrentUsername]);

  // Handle loading and not found states
  if (loading.game) {
    return <GameRoomSkeleton />;
  }

  if (!game) {
    return <GameNotFound onRetry={() => router.push('/')} />;
  }

  // Redirect if user is not in game or not authenticated
  if (!loading.players) {
    if (!currentUsername) {
      router.push(`/join/${game.code}`);
      return null;
    }

    const inGame = players.map((player) => player.name).includes(currentUsername);

    if (!inGame) {
      router.push(`/join/${game.code}`);
      return null;
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <GameHeader
        gameName={game.name}
        gameCode={game.code}
        gameId={game.id}
        players={players}
        currentUsername={currentUsername}
        onKickPlayer={executeKickPlayer}
      />

      <div className="mx-auto max-w-7xl space-y-3 p-4">
        {/* Mobile view */}
        <MobileGameView
          players={players}
          currentUsername={currentUsername}
          game={game}
          moves={moves}
          loading={loading}
          executePotAction={executePotAction}
          showAnalysis={showAnalysis}
          setShowAnalysis={setShowAnalysis}
          showPokerHands={showPokerHands}
          setShowPokerHands={setShowPokerHands}
        />

        {/* Desktop view */}
        <DesktopGameView
          players={players}
          currentUsername={currentUsername}
          game={game}
          moves={moves}
          loading={loading}
          executePotAction={executePotAction}
        />
      </div>
    </div>
  );
}
