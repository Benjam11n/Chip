import { Settings2 } from 'lucide-react';

import { RoomSettings } from '@/app/game/[id]/room-settings';
import { PlayerView } from '@/types';

import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';

interface GameHeaderProps {
  gameName: string;
  gameCode: string;
  gameId: string;
  players: PlayerView[];
  currentUsername: string;
  onKickPlayer: (playerId: string) => Promise<void>;
}

export default function GameHeader({
  gameName,
  gameCode,
  gameId,
  players,
  currentUsername,
  onKickPlayer,
}: GameHeaderProps) {
  return (
    <div className="border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <div>
          <h1 className="mt-3 text-2xl font-bold text-foreground">{gameName}</h1>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="mt-1 font-medium text-primary">Game ID: {gameCode}</span>
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
                gameId={gameId}
                gameCode={gameCode}
                players={players}
                currentUsername={currentUsername}
                onKickPlayer={onKickPlayer}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
