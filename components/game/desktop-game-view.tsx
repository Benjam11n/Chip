
import { HandInput } from '@/components/hand-input/hand-input';
import { MoveHistory } from '@/components/move-history';
import { PlayerCard } from '@/components/player-card';
import { Card } from '@/components/ui/card';
import type { LoadingState } from '@/stores/useGameStore';
import type { GameView, MoveHistoryView, PlayerView } from '@/types';

interface DesktopGameViewProps {
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
}

export const DesktopGameView = ({
  players,
  currentUsername,
  game,
  moves,
  loading,
  executePotAction,
}: DesktopGameViewProps) => {
  return (
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
  );
}
