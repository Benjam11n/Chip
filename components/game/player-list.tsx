"use client";

import { Card } from "@/components/ui/card";
import type { Game } from "@/types";

type PlayerListProps = {
  game: Game;
};

export function PlayerList({ game }: PlayerListProps) {
  if (!game?.players?.length) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="mb-4 font-semibold">Current Players</h2>
      <div className="space-y-2">
        {game?.players?.map((player) => (
          <div
            className="flex items-center justify-between border-b py-2 last:border-0"
            key={player.id}
          >
            <span>{player.name}</span>
            {player.id === game.createdBy && (
              <span className="rounded-full bg-primary/10 px-2 py-1 text-primary text-xs">
                Host
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
