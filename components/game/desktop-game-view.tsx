import { HandInput } from "@/components/hand-input/hand-input";
import { MoveHistory } from "@/components/move-history";
import { PlayerCard } from "@/components/player-card";
import { Card } from "@/components/ui/card";
import type { LoadingState } from "@/stores/use-game-store";
import type { GameView, MoveHistoryView, PlayerView } from "@/types";

const PLAYER_SKELETON_KEYS = ["p1", "p2", "p3"] as const;

type DesktopGameViewProps = {
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
};

export const DesktopGameView = ({
  players,
  currentUsername,
  game,
  moves,
  loading,
  executePotAction,
}: DesktopGameViewProps) => (
  <div className="hidden gap-6 lg:grid lg:grid-cols-3">
    <div className="space-y-3 lg:col-span-2">
      <MoveHistory
        isLoading={loading.moves}
        moves={moves}
        players={players}
        totalPot={game.pot}
      />
      <Card className="p-6">
        <HandInput />
      </Card>
    </div>

    <div className="grid grid-cols-1 content-start gap-6">
      {loading.players
        ? PLAYER_SKELETON_KEYS.map((k) => (
            <PlayerCard
              isCurrentUser={false}
              isLoading={true}
              key={k}
              onPotAction={executePotAction}
              player={null}
              pot={game?.pot}
            />
          ))
        : players.map((player) => (
            <PlayerCard
              isCurrentUser={player.name === currentUsername}
              key={player.id}
              onPotAction={executePotAction}
              player={player}
              pot={game?.pot}
            />
          ))}
    </div>
  </div>
);
