import { Settings2 } from "lucide-react";
import { RoomSettings } from "@/app/game/[id]/room-settings";
import type { PlayerView } from "@/types";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

type GameHeaderProps = {
  gameName: string;
  gameCode: string;
  gameId: string;
  players: PlayerView[];
  currentUsername: string;
  onKickPlayer: (playerId: string) => Promise<void>;
};

export const GameHeader = ({
  gameName,
  gameCode,
  gameId,
  players,
  currentUsername,
  onKickPlayer,
}: GameHeaderProps) => (
  <div className="border-border border-b">
    <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
      <div>
        <h1 className="mt-3 font-bold text-2xl text-foreground">{gameName}</h1>
        <div className="flex gap-4 text-muted-foreground text-sm">
          <span className="mt-1 font-medium text-primary">
            Game ID: {gameCode}
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
              currentUsername={currentUsername}
              gameCode={gameCode}
              gameId={gameId}
              onKickPlayer={onKickPlayer}
              players={players}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </div>
);
