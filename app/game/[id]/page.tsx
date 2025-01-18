'use client';

import { useState, useEffect } from 'react';
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
import { PlayerCard } from '@/components/player-card';
import { MoveHistory } from '@/components/move-history';
import { HandInput } from '@/components/hand-input/hand-input';
import { RoomSettings } from './room-settings';
import { GameState } from '@/app/types';
import { supabase } from '@/lib/supabase/client';

export default function GameRoom({ params }: { params: { id: string } }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize game state and fetch data
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);

        // Fetch game data
        const { data: game, error: gameError } = await supabase
          .from('games')
          .select(
            `
            *,
            players (*)
          `
          )
          .eq('id', params.id)
          .single();

        if (gameError) throw gameError;

        // Transform the data into GameState format
        const gameState: GameState = {
          id: game.id,
          pot: 0, // Initialize pot
          initialBuyIn: game.initial_buy_in,
          players: game.players.map((player: any) => ({
            id: player.id,
            name: player.name,
            stack: player.stack,
            totalBuyIn: player.total_buy_in,
            position: player.position,
          })),
          moves: [], // Initialize moves
        };

        setGameState(gameState);

        // Set a temporary user ID if not authenticated
        const tempUserId =
          localStorage.getItem('tempUserId') ||
          'temp_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('tempUserId', tempUserId);
        setCurrentUserId(tempUserId);
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load game');
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();

    // Set up real-time subscription
    const gameSubscription = supabase
      .channel(`game:${params.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${params.id}`,
        },
        (payload) => {
          // Update game state based on changes
          setGameState((current) =>
            current
              ? {
                  ...current,
                  ...payload.new,
                }
              : null
          );
        }
      )
      .subscribe();

    return () => {
      gameSubscription.unsubscribe();
    };
  }, [params.id]);

  const handlePotAction = async (
    playerId: string,
    action: 'bet' | 'fold',
    amount?: number
  ) => {
    try {
      if (!gameState) return;

      // Update player's chips and pot
      const player = gameState.players.find((p) => p.id === playerId);
      if (!player) return;

      const { error } = await supabase
        .from('players')
        .update({
          chips_count:
            action === 'bet' ? player.stack - (amount || 0) : player.stack,
        })
        .eq('id', playerId);

      if (error) throw error;

      // Record the move
      await supabase.from('game_actions').insert({
        player_id: playerId,
        action_type: action,
        amount: amount || 0,
      });
    } catch (err) {
      console.error('Error handling pot action:', err);
      // Handle error (show toast, etc.)
    }
  };

  const handleKickPlayer = async (playerId: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);

      if (error) throw error;
    } catch (err) {
      console.error('Error kicking player:', err);
      // Handle error (show toast, etc.)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!gameState || !currentUserId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Game not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-red-900 to-black p-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Game Room</h1>
            <div className="flex gap-4 text-sm text-gray-300">
              <span>Game ID: {gameState.id}</span>
              <span className="font-medium text-red-400">
                Total Pot: ${gameState.pot}
              </span>
            </div>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-950"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Room Settings
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-zinc-900 border-zinc-800">
              <SheetHeader>
                <SheetTitle className="text-white">Room Settings</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <RoomSettings
                  gameId={gameState.id}
                  players={gameState.players}
                  currentUserId={currentUserId}
                  onKickPlayer={handleKickPlayer}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Cards and Move History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gameState.players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isCurrentUser={player.id === currentUserId}
                  onPotAction={handlePotAction}
                  pot={gameState.pot}
                />
              ))}
            </div>

            <div className="lg:hidden">
              <MoveHistory
                moves={gameState.moves}
                players={gameState.players}
                totalPot={gameState.pot}
              />
            </div>

            {/* Collapsible Analysis Section */}
            <Collapsible
              open={showAnalysis}
              onOpenChange={setShowAnalysis}
              className="lg:hidden"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-950"
                >
                  {showAnalysis ? (
                    <ChevronUp className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  )}
                  Hand Analysis
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <Card className="bg-zinc-900 border-zinc-800 p-6">
                  <HandInput />
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Move History (Desktop) */}
            <div className="hidden lg:block">
              <MoveHistory
                moves={gameState.moves}
                players={gameState.players}
                totalPot={gameState.pot}
              />
            </div>

            {/* Analysis Section (Desktop) */}
            <div className="hidden lg:block">
              <Card className="bg-zinc-900 border-zinc-800 p-6">
                <HandInput />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
