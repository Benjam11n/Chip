'use client';

import { PostgrestError } from '@supabase/supabase-js';
import { Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { RoomSettings } from '@/app/game/[id]/room-settings';
import { HandInput } from '@/components/hand-input/hand-input';
import { MoveHistory } from '@/components/move-history';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { supabase } from '@/lib/supabase/client';
import { GameState, GameView } from '@/types';

import { PlayerCard } from './player-card';
import { PokerHandsChart } from './poker-hands-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface GameRoomClientProps {
  gameId: string;
}

export function GameRoomClient({ gameId }: GameRoomClientProps) {
  const router = useRouter();
  const [gameData, setGameData] = useState<Omit<GameState, 'players'> | null>(
    null
  );
  const [players, setPlayers] = useState<GameState['players']>([]);
  const [gameLoading, setGameLoading] = useState(true);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showPokerHands, setShowPokerHands] = useState(false);

  const fetchPlayers = useCallback(async () => {
    try {
      setPlayersLoading(true);
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('*')
        .eq('game_id', gameId);

      if (playerError) throw playerError;

      setPlayers(
        playerData.map((player) => ({
          id: player.id,
          name: player.name,
          stack: player.stack,
          totalBuyIn: player.total_buy_in,
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error('Error fetching player data');
    } finally {
      setPlayersLoading(false);
    }
  }, [gameId]);

  const fetchGameData = useCallback(async () => {
    try {
      setGameLoading(true);

      const { data: game, error: gameError } = (await supabase
        .from('games')
        .select('id, name, pot, initial_buy_in, code')
        .eq('id', gameId)
        .single()) as { data: GameView | null; error: PostgrestError | null };

      // If game doesn't exist, redirect without showing error
      if (!game || (gameError && gameError.code === 'PGRST116')) {
        router.push('/');
        return;
      }

      // For other errors, throw
      if (gameError) throw gameError;

      setGameData({
        id: game.id,
        name: game.name,
        pot: game.pot,
        initialBuyIn: game.initial_buy_in,
        code: game.code,
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
      setGameLoading(false);
    }
  }, [gameId, router]);

  useEffect(() => {
    fetchGameData();
    fetchPlayers();

    const channel = supabase
      .channel(`room:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${gameId}`,
        },
        fetchPlayers
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${gameId}`,
        },
        fetchPlayers
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'players',
        },
        fetchPlayers
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          // Only update state without loading for pot changes
          if (payload.new && typeof payload.new.pot === 'number') {
            setGameData((prevState) =>
              prevState ? { ...prevState, pot: payload.new.pot } : null
            );
          } else {
            // For other game updates, fetch everything
            fetchGameData();
          }
        }
      );

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [fetchGameData, fetchPlayers, gameId]);

  const handlePotAction = async (
    playerId: string,
    amount: number,
    action_type: 'add' | 'remove'
  ) => {
    try {
      if (!gameData) return;
      setActionLoading(true);

      const player = players.find((p) => p.id === playerId);
      if (!player) return;

      // Make the API calls
      const { error } = await supabase.rpc('handle_pot_action', {
        p_player_id: playerId,
        p_game_id: gameData.id,
        p_amount: amount,
        p_action_type: action_type,
      });

      if (error) throw error;
    } catch (err) {
      console.error(err);
      toast.error('Error handling pot action');
    } finally {
      setActionLoading(false);
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

  if (gameLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mx-auto max-w-md px-8 text-center">
          <h1 className="mb-4 text-2xl font-bold">Game Not Found</h1>
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

  if (!playersLoading) {
    if (!currentUsername) {
      router.push(`/join/${gameData.code}`);
      return null;
    }

    const inGame = players
      .map((player) => player.name)
      .includes(currentUsername);

    if (!inGame) {
      router.push(`/join/${gameData.code}`);
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div>
            <h1 className="mt-3 text-2xl font-bold text-foreground">
              {gameData.name}
            </h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="mt-1 font-medium text-primary">
                Game ID: {gameData.code}
              </span>
            </div>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Settings2 className="size-4 lg:mr-2" />
                <div className="hidden lg:block">Room Settings</div>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Room Settings</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <RoomSettings
                  gameId={gameData.id}
                  gameCode={gameData.code}
                  players={players}
                  currentUsername={currentUsername!}
                  onKickPlayer={handleKickPlayer}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-3 p-4">
        <div className="block lg:hidden">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Game History</TabsTrigger>
              <TabsTrigger value="players">Players</TabsTrigger>
            </TabsList>
            <TabsContent
              value="history"
              className="space-y-6"
              key={gameData.pot}
            >
              <MoveHistory
                gameId={gameData.id}
                players={players}
                totalPot={gameData.pot}
              />
              <div className="space-y-3">
                {players
                  .filter((player) => player.name === currentUsername)
                  .map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      isCurrentUser={true}
                      onPotAction={handlePotAction}
                      actionLoading={actionLoading}
                      pot={gameData.pot}
                    />
                  ))}
              </div>
              <Card className="hidden p-6 lg:block">
                <HandInput />
              </Card>
            </TabsContent>
            <TabsContent value="players">
              <div className="grid grid-cols-1 content-start gap-3">
                {playersLoading
                  ? // Show loading skeleton cards
                    Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <PlayerCard
                          key={i}
                          player={null}
                          isCurrentUser={false}
                          onPotAction={handlePotAction}
                          pot={gameData?.pot}
                          isLoading={true}
                        />
                      ))
                  : players
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
                          pot={gameData?.pot || 0}
                        />
                      ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden gap-6 lg:grid lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            <MoveHistory
              key={gameData.pot}
              gameId={gameData.id}
              players={players}
              totalPot={gameData.pot}
            />
            <Card className="p-6">
              <HandInput />
            </Card>
          </div>

          <div className="grid grid-cols-1 content-start gap-6">
            {playersLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <PlayerCard
                      key={i}
                      player={null}
                      isCurrentUser={false}
                      onPotAction={handlePotAction}
                      pot={gameData?.pot || 0}
                      isLoading={true}
                    />
                  ))
              : players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    isCurrentUser={player.name === currentUsername}
                    onPotAction={handlePotAction}
                    pot={gameData?.pot || 0}
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
                  <ChevronUp className="mr-2 size-4" />
                ) : (
                  <ChevronDown className="mr-2 size-4" />
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
                  <ChevronUp className="mr-2 size-4" />
                ) : (
                  <ChevronDown className="mr-2 size-4" />
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
      </div>
    </div>
  );
}
