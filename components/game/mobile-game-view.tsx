import { ChevronDown, ChevronUp } from "lucide-react";
import type { LoadingState } from "@/stores/useGameStore";
import type { GameView, MoveHistoryView, PlayerView } from "@/types";
import { HandInput } from "../hand-input/hand-input";
import { MoveHistory } from "../move-history";
import { PlayerCard } from "../player-card";
import { PokerHandsChart } from "../poker-hands-chart";
import { PlayerCardSkeleton } from "../skeletons";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type MobileGameViewProps = {
  players: PlayerView[];
  currentUsername: string;
  game: GameView;
  moves: MoveHistoryView[];
  loading: LoadingState;
  executePotAction: (
    playerId: string,
    amount: number,
    action_type: "add" | "remove"
  ) => Promise<void>;
  showAnalysis: boolean;
  setShowAnalysis: (show: boolean) => void;
  showPokerHands: boolean;
  setShowPokerHands: (show: boolean) => void;
};

export const MobileGameView = ({
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
}: MobileGameViewProps) => {
  const currentPlayer = players.find(
    (player) => player.name === currentUsername
  );

  return (
    <>
      <div className="block lg:hidden">
        <Tabs className="w-full" defaultValue="history">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Game History</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
          </TabsList>
          <TabsContent className="space-y-6" value="history">
            <MoveHistory
              isLoading={loading.moves}
              moves={moves}
              players={players}
              totalPot={game.pot}
            />
            {currentPlayer ? (
              <div className="space-y-3">
                <PlayerCard
                  actionLoading={loading.moves}
                  isCurrentUser={true}
                  key={currentPlayer.id}
                  onPotAction={executePotAction}
                  player={currentPlayer}
                  pot={game.pot}
                />
              </div>
            ) : null}
            <Card className="hidden p-6 lg:block">
              <HandInput />
            </Card>
          </TabsContent>
          <TabsContent value="players">
            <div className="grid grid-cols-1 content-start gap-3">
              {loading.players
                ? [...new Array(3)].map((_, i) => (
                    <PlayerCardSkeleton key={i} />
                  ))
                : players
                    .sort((a, b) => {
                      if (a.name === currentUsername) {
                        return -1;
                      }
                      if (b.name === currentUsername) {
                        return 1;
                      }
                      return 0;
                    })
                    .map((player) => (
                      <PlayerCard
                        isCurrentUser={player.name === currentUsername}
                        key={player.id}
                        onPotAction={executePotAction}
                        player={player}
                        pot={game?.pot}
                      />
                    ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-3">
        <Collapsible
          className="lg:hidden"
          onOpenChange={setShowAnalysis}
          open={showAnalysis}
        >
          <CollapsibleTrigger asChild>
            <Button className="w-full" variant="outline">
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
          className="lg:hidden"
          onOpenChange={setShowPokerHands}
          open={showPokerHands}
        >
          <CollapsibleTrigger asChild>
            <Button className="w-full" variant="outline">
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
};
