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
import { MoveHistory } from '@/components/move-history';
import { HandInput } from '@/components/hand-input/hand-input';
import { GameState } from '@/app/types';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { RoomSettings } from '@/app/game/[id]/room-settings';
import { PlayerCard } from './player-card';

interface GameRoomClientProps {
  gameId: string;
}

export function GameRoomClient({ gameId }: GameRoomClientProps) {
  // Move all your state and handlers here
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

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
          players (*),
          game_actions (*)
        `
          )
          .eq('id', gameId)
          .single();

        if (gameError) throw gameError;

        const gameHistory = game.game_actions.sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        // Transform the data into GameState format
        setGameState({
          id: game.id,
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
            id: history.id,
            playerId: history.player_id,
            createdAt: history.created_at,
            amount: history.amount,
          })),
        });

        // Set a temporary user ID if not authenticated
        const currentPlayerString = localStorage.getItem('currentPlayer');
        if (currentPlayerString) {
          const currentPlayer: { name: string; gameId: string } =
            JSON.parse(currentPlayerString);
          setCurrentUsername(currentPlayer.name);
        }
      } catch (err) {
        console.error('Error fetching game data:', err);
      } finally {
        setLoading(false);
      }
    };

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
    // Subscribe to the channel
    channel.subscribe();

    // Cleanup
    return () => {
      channel.unsubscribe();
    };
  }, [gameId]);

  // Your existing handlers
  const handlePotAction = async (
    playerId: string,
    amount: number,
    action: 'add' | 'remove'
  ) => {
    try {
      if (!gameState) return;

      const player = gameState.players.find((p) => p.id === playerId);
      if (!player) return;

      // Calculate new stack for player
      const newStack =
        action === 'add' ? player.stack - amount : player.stack + amount;
      const newPot =
        action === 'add' ? gameState.pot + amount : gameState.pot - amount;

      // Update player's stack
      const { error: playerError } = await supabase
        .from('players')
        .update({ stack: newStack })
        .eq('id', playerId);

      if (playerError) throw playerError;

      // Update game's pot
      const { error: gameError } = await supabase
        .from('games')
        .update({
          pot: newPot,
        })
        .eq('id', gameState.id);

      if (gameError) throw gameError;

      // Record the action
      const { error: actionError } = await supabase
        .from('game_actions')
        .insert({
          player_id: playerId,
          game_id: gameState.id,
          action_type: action,
          amount: amount,
        });

      if (actionError) throw actionError;

      // Update local state immediately for better UX
      setGameState((prevState) => {
        if (!prevState) return null;

        return {
          ...prevState,
          pot:
            action === 'add' ? prevState.pot + amount : prevState.pot - amount,
          players: prevState.players.map((p) =>
            p.id === playerId ? { ...p, stack: newStack } : p
          ),
        };
      });
    } catch (err) {
      toast.error('Error handling pot action');
    }
  };

  const handleKickPlayer = async (playerId: string) => {
    try {
      // Before running the delete operation, set the current_game_id in
      // the database session. This ensures that only players from the
      // specified game can be deleted.
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

  if (!gameState || !currentUsername) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Game not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-gradient-to-br from-primary/10 to-background">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Game Room</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="font-medium text-primary">
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
                  players={gameState.players}
                  currentUserId={currentUsername}
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
            <div className="lg:hidden">
              <MoveHistory
                moves={gameState.moves}
                players={gameState.players}
                totalPot={gameState.pot}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {gameState.players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isCurrentUser={player.name === currentUsername}
                  onPotAction={handlePotAction}
                  pot={gameState.pot}
                />
              ))}
            </div>

            {/* Collapsible Analysis Section */}
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
