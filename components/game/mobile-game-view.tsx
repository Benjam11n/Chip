import { ChevronDown, ChevronUp } from 'lucide-react';

import { LoadingState } from '@/stores/useGameStore';
import { GameView, MoveHistoryView, PlayerView } from '@/types';

import { HandInput } from '../hand-input/hand-input';
import { MoveHistory } from '../move-history';
import { PlayerCard } from '../player-card';
import { PokerHandsChart } from '../poker-hands-chart';
import { PlayerCardSkeleton } from '../skeletons';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface MobileGameViewProps {
  players: PlayerView[];
  currentUsername: string;
  game: GameView;
  moves: MoveHistoryView[];
  loading: LoadingState;
  executePotAction: (
    playerId: string,
    amount: number,
    action_type: 'add' | 'remove',
  ) => Promise<void>;
  showAnalysis: boolean;
  setShowAnalysis: (show: boolean) => void;
  showPokerHands: boolean;
  setShowPokerHands: (show: boolean) => void;
}

export default function MobileGameView({
  players,
  currentUsername,
  game,
  moves,
  loading,
  executePotAction,
  showAnalysis,
  setShowAnalysis,
  showPokerHands,
  setShowPokerHands,
}: MobileGameViewProps) {
  const currentPlayer = players.find((player) => player.name === currentUsername);

  return (
    <>
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
            {currentPlayer && (
              <div className="space-y-3">
                <PlayerCard
                  key={currentPlayer.id}
                  player={currentPlayer}
                  isCurrentUser={true}
                  onPotAction={executePotAction}
                  actionLoading={loading.moves}
                  pot={game.pot}
                />
              </div>
            )}
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

      <div className="space-y-3">
        <Collapsible open={showAnalysis} onOpenChange={setShowAnalysis} className="lg:hidden">
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

        <Collapsible open={showPokerHands} onOpenChange={setShowPokerHands} className="lg:hidden">
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
    </>
  );
}
