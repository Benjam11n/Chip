'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { MoveHistory, Player } from '@/app/types';

interface MoveHistoryProps {
  moves: MoveHistory[];
  players: Player[];
  totalPot: number;
}

export function MoveHistory({ moves, players, totalPot }: MoveHistoryProps) {
  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || 'Unknown Player';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatMove = (move: MoveHistory) => {
    const playerName = getPlayerName(move.playerId);

    if (move.type === 'money') {
      const action = move.moneyAction === 'add' ? 'places' : 'takes';
      return `${playerName} ${action} ${formatAmount(move.amount || 0)} ${move.moneyAction === 'add' ? 'in the pot' : 'from the pot'}`;
    }

    return '';
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Move History</h2>
        <div className="text-sm">
          <span className="text-gray-400">Total Pot: </span>
          <span className="font-bold text-white">{formatAmount(totalPot)}</span>
        </div>
      </div>
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-2">
          {moves.map((move) => (
            <div
              key={move.id}
              className="flex items-center justify-between text-sm py-2 border-b border-zinc-800 last:border-0"
            >
              <span className="text-white">{formatMove(move)}</span>
              <span className="text-gray-400">
                {formatDistanceToNow(move.timestamp, { addSuffix: true })}
              </span>
            </div>
          ))}

          {moves.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No moves yet
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}