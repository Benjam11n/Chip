'use client';

import { formatDistanceToNow } from 'date-fns';
import { useCallback, useEffect, useRef } from 'react';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MoveHistoryView, PlayerView } from '@/types';

import { MoveHistorySkeleton } from './skeletons';

interface MoveHistoryProps {
  players: PlayerView[];
  totalPot: number;
  moves: MoveHistoryView[];
  isLoading: boolean;
}

export function MoveHistory({
  players,
  totalPot,
  moves,
  isLoading,
}: MoveHistoryProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when moves update
  const scrollToBottom = useCallback(() => {
    // Find the viewport element within ScrollArea
    const viewport = document.querySelector(
      '[data-radix-scroll-area-viewport]'
    );
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [moves, scrollToBottom]);

  if (isLoading) {
    return <MoveHistorySkeleton />;
  }

  const getPlayerName = (playerId: string) => {
    return players.find((p) => p.id === playerId)?.name || 'Unknown Player';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatMove = (move: MoveHistoryView) => {
    const playerName = getPlayerName(move.playerId);
    const action = move.action_type === 'add' ? 'places' : 'takes';
    return `${playerName} ${action} ${formatAmount(move.amount || 0)} ${
      move.action_type === 'add' ? 'in the pot' : 'from the pot'
    }`;
  };

  return (
    <Card className="p-4">
      <div className="mx-2 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Move History</h2>
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
              key={move.id}
              className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0"
            >
              <span className="text-foreground">{formatMove(move)}</span>
              <span className="text-muted-foreground">
                {formatDistanceToNow(move.createdAt, { addSuffix: true })}
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
}
