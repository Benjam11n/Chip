'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { MoveHistory } from '@/components/move-history';
import { HandInput } from '@/components/hand-input/hand-input';
import { GameState, GameView } from '@/app/types';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { RoomSettings } from '@/app/game/[id]/room-settings';
import { PlayerCard } from './player-card';
import { PokerHandsChart } from './poker-hands-chart';
import { useRouter } from 'next/navigation';

interface GameRoomClientProps {
  gameId: string;
}

export function GameRoomClient({ gameId }: GameRoomClientProps) {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showPokerHands, setShowPokerHands] = useState(false);

  const fetchGameData = useCallback(async () => {
    try {
      setLoading(true);

      const { data: game, error: gameError } = (await supabase
        .from('games')
        .select(
          `
          *,
          players (*),
          game_actions (*)
        `
        )
        .eq('id', gameId)
        .single()) as { data: GameView | null; error: any };

      // If game doesn't exist, redirect without showing error
      if (!game || (gameError && gameError.code === 'PGRST116')) {
        router.push('/');
        return;
      }

      // For other errors, throw
      if (gameError) throw gameError;

      const gameHistory = game.game_actions.sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      setGameState({
        id: game.id,
        name: game.name,
        pot: game.pot,
        initialBuyIn: game.initial_buy_in,
        code: game.code,
        players: game.players.map((player: any) => ({
          id: player.id,
          name: player.name,
          stack: player.stack,
          totalBuyIn: player.total_buy_in,
        })),
        moves: gameHistory.map((history) => ({
          ...history,
          id: history.id,
          playerId: history.player_id,
          createdAt: history.created_at,
          amount: history.amount,
        })),
      });

      const currentPlayerString = localStorage.getItem('currentPlayer');
      if (currentPlayerString) {
        const currentPlayer: { name: string; gameId: string } =
          JSON.parse(currentPlayerString);
        setCurrentUsername(currentPlayer.name);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching game data');
    } finally {
      setLoading(false);
    }
  }, [gameId, router]);

  useEffect(() => {
    fetchGameData();

    const channel = supabase
      .channel(`room:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
        },
        fetchGameData
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        fetchGameData
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_actions',
          filter: `game_id=eq.${gameId}`,
        },
        fetchGameData
      );

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [fetchGameData, gameId]);

  const handlePotAction = async (
    playerId: string,
    amount: number,
    action_type: 'add' | 'remove'
  ) => {
    try {
      if (!gameState) return;

      const player = gameState.players.find((p) => p.id === playerId);
      if (!player) return;

      const newStack =
        action_type === 'add' ? player.stack - amount : player.stack + amount;
      const newPot =
        action_type === 'add' ? gameState.pot + amount : gameState.pot - amount;

      const { error: playerError } = await supabase
        .from('players')
        .update({ stack: newStack })
        .eq('id', playerId);

      if (playerError) throw playerError;

      const { error: gameError } = await supabase
        .from('games')
        .update({
          pot: newPot,
        })
        .eq('id', gameState.id);

      if (gameError) throw gameError;

      const { error: actionError } = await supabase
        .from('game_actions')
        .insert({
          player_id: playerId,
          game_id: gameState.id,
          action_type: action_type,
          amount: amount,
        });

      if (actionError) throw actionError;

      setGameState((prevState) => {
        if (!prevState) return null;

        return {
          ...prevState,
          pot:
            action_type === 'add'
              ? prevState.pot + amount
              : prevState.pot - amount,
          players: prevState.players.map((p) =>
            p.id === playerId ? { ...p, stack: newStack } : p
          ),
        };
      });
    } catch (err) {
      console.error(err);
      toast.error('Error handling pot action');
    }
  };

  const handleKickPlayer = async (playerId: string) => {
    try {
      await supabase.rpc('set_config', {
        key: 'app.current_game_id',
        value: gameId,
      });

      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);

      if (error) throw error;
      toast.success('Success', { description: 'Player removed from game' });
    } catch (err) {
      console.error(err);
      toast.error('Error kicking player');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <p className="text-muted-foreground">
            The game url you entered is either incorrect or the game has
            expired. Games automatically expire after 24 hours of inactivity to
            keep things fresh.
          </p>
          <Button className="mt-6" onClick={() => router.push('/')}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!currentUsername) {
    router.push(`/join/${gameState.code}`);
  }

  const inGame = gameState.players
    .map((player) => player.name)
    .includes(currentUsername!);

  if (!inGame) {
    router.push(`/join/${gameState.code}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mt-3">
              {gameState.name}
            </h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="font-medium text-primary mt-1">
                Game ID: {gameState.code}
              </span>
            </div>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Settings2 className="h-4 w-4 lg:mr-2" />
                <div className="hidden lg:block">Room Settings</div>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Room Settings</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <RoomSettings
                  gameId={gameState.id}
                  gameCode={gameState.code}
                  players={gameState.players}
                  currentUsername={currentUsername!}
                  onKickPlayer={handleKickPlayer}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="lg:hidden">
              <MoveHistory
                moves={gameState.moves}
                players={gameState.players}
                totalPot={gameState.pot}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {gameState.players
                .sort((a, b) => {
                  if (a.name === currentUsername) return -1;
                  if (b.name === currentUsername) return 1;
                  return 0;
                })
                .map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    isCurrentUser={player.name === currentUsername}
                    onPotAction={handlePotAction}
                    pot={gameState.pot}
                  />
                ))}
            </div>
          </div>

          <div className="space-y-3">
            <Collapsible
              open={showAnalysis}
              onOpenChange={setShowAnalysis}
              className="lg:hidden"
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  {showAnalysis ? (
                    <ChevronUp className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  )}
                  Hand Analysis
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <Card className="p-6">
                  <HandInput />
                </Card>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={showPokerHands}
              onOpenChange={setShowPokerHands}
              className="lg:hidden"
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  {showPokerHands ? (
                    <ChevronUp className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  )}
                  Poker Hands
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <Card className="p-6">
                  <PokerHandsChart />
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="hidden lg:block">
              <MoveHistory
                moves={gameState.moves}
                players={gameState.players}
                totalPot={gameState.pot}
              />
            </div>

            <div className="hidden lg:block">
              <Card className="p-6">
                <HandInput />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
