"use client";

import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MoveHistoryView, PlayerView } from "@/types";
import { MoveHistorySkeleton } from "./skeletons";

type MoveHistoryProps = {
  players: PlayerView[];
  totalPot: number;
  moves: MoveHistoryView[];
  isLoading: boolean;
};

export const MoveHistory = ({
  players,
  totalPot,
  moves,
  isLoading,
}: Readonly<MoveHistoryProps>) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when moves update
  const scrollToBottom = useCallback(() => {
    // Find the viewport element within ScrollArea
    const viewport = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  if (isLoading) {
    return <MoveHistorySkeleton />;
  }

  const getPlayerName = (playerId: string) =>
    players.find((p) => p.id === playerId)?.name ?? "Unknown Player";

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatMove = (move: MoveHistoryView) => {
    const playerName = getPlayerName(move.player_id);
    const action = move.action_type === "add" ? "places" : "takes";
    return `${playerName} ${action} ${formatAmount(move.amount ?? 0)} ${
      move.action_type === "add" ? "in the pot" : "from the pot"
    }`;
  };

  return (
    <Card className="p-4">
      <div className="mx-2 mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-foreground text-lg">Move History</h2>
        <div className="text-sm">
          <span className="text-muted-foreground">Total Pot: </span>
          <span className="font-bold text-foreground">
            {formatAmount(totalPot)}
          </span>
        </div>
      </div>
      <ScrollArea className="h-[380px] pr-4" ref={scrollAreaRef}>
        <div className="space-y-2">
          {moves.map((move) => (
            <div
              className="flex items-center justify-between border-border border-b py-2 text-sm last:border-0"
              key={move.id}
            >
              <span className="text-foreground">{formatMove(move)}</span>
              <span className="text-muted-foreground">
                {move.created_at
                  ? formatDistanceToNow(new Date(move.created_at), {
                      addSuffix: true,
                    })
                  : "N/A"}
              </span>
            </div>
          ))}
          {moves.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No moves yet
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
