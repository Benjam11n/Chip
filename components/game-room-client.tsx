'use client';

import { Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
import { useGameStore } from '@/stores/useGameStore';

import { PlayerCard } from './player-card';
import { PokerHandsChart } from './poker-hands-chart';
import { GameRoomSkeleton, PlayerCardSkeleton } from './skeletons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface GameRoomClientProps {
  gameId: string;
}

export function GameRoomClient({ gameId }: GameRoomClientProps) {
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

  // Initialize game ID and fetch data
  useEffect(() => {
    setGameId(gameId);
    fetchGame().then((game) => {
      if (!game) router.push('/'); // Redirect if game not found
    });
    fetchPlayers();
    fetchMoves();
    const unsubscribe = subscribeToChanges();
    return unsubscribe;
  }, [
    fetchGame,
    fetchMoves,
    fetchPlayers,
    router,
    setGameId,
    subscribeToChanges,
    gameId,
  ]);

  // Load current user from localStorage
  useEffect(() => {
    const currentPlayer = localStorage.getItem('currentPlayer');
    if (currentPlayer) {
      setCurrentUsername(JSON.parse(currentPlayer).name);
    }
  }, [setCurrentUsername]);

  // Wrapper for pot actions with error handling
  const executePotAction = async (
    playerId: string,
    amount: number,
    action_type: 'add' | 'remove'
  ) => {
    try {
      await handlePotAction(playerId, amount, action_type);
    } catch {
      toast.error('Error handling pot action', {
        description: 'Changes have been reverted',
      });
    }
  };

  // Wrapper for kick player with error handling
  const executeKickPlayer = async (playerId: string) => {
    try {
      await handleKickPlayer(playerId);
      toast.success('Success', { description: 'Player removed from game' });
    } catch {
      toast.error('Error kicking player');
    }
  };

  if (loading.game) {
    return <GameRoomSkeleton />;
  }

  if (!game) {
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

  if (!loading.players) {
    if (!currentUsername) {
      router.push(`/join/${game.code}`);
      return null;
    }

    const inGame = players
      .map((player) => player.name)
      .includes(currentUsername);

    if (!inGame) {
      router.push(`/join/${game.code}`);
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div>
            <h1 className="mt-3 text-2xl font-bold text-foreground">
              {game.name}
            </h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="mt-1 font-medium text-primary">
                Game ID: {game.code}
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
                  gameId={game.id}
                  gameCode={game.code}
                  players={players}
                  currentUsername={currentUsername!}
                  onKickPlayer={executeKickPlayer}
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
            <TabsContent value="history" className="space-y-6">
              <MoveHistory
                players={players}
                totalPot={game.pot}
                moves={moves}
                isLoading={loading.moves}
              />
              <div className="space-y-3">
                {players
                  .filter((player) => player.name === currentUsername)
                  .map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      isCurrentUser={true}
                      onPotAction={executePotAction}
                      actionLoading={loading.moves}
                      pot={game.pot}
                    />
                  ))}
              </div>
              <Card className="hidden p-6 lg:block">
                <HandInput />
              </Card>
            </TabsContent>
            <TabsContent value="players">
              <div className="grid grid-cols-1 content-start gap-3">
                {loading.players
                  ? [...Array(3)].map((_, i) => <PlayerCardSkeleton key={i} />)
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
                          onPotAction={executePotAction}
                          pot={game?.pot}
                        />
                      ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden gap-6 lg:grid lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            <MoveHistory
              players={players}
              totalPot={game.pot}
              moves={moves}
              isLoading={loading.moves}
            />
            <Card className="p-6">
              <HandInput />
            </Card>
          </div>

          <div className="grid grid-cols-1 content-start gap-6">
            {loading.players
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <PlayerCard
                      key={i}
                      player={null}
                      isCurrentUser={false}
                      onPotAction={executePotAction}
                      pot={game?.pot}
                      isLoading={true}
                    />
                  ))
              : players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    isCurrentUser={player.name === currentUsername}
                    onPotAction={executePotAction}
                    pot={game?.pot}
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
