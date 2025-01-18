'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HandHistory, Player } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface HandHistoryProps {
  history: HandHistory[];
  players: Player[];
}

export function HandHistory({ history, players }: HandHistoryProps) {
  const [expandedHands, setExpandedHands] = useState<Set<string>>(new Set());

  const toggleHand = (handId: string) => {
    const newExpanded = new Set(expandedHands);
    if (newExpanded.has(handId)) {
      newExpanded.delete(handId);
    } else {
      newExpanded.add(handId);
    }
    setExpandedHands(newExpanded);
  };

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

  const formatAction = (action: string, amount?: number) => {
    switch (action) {
      case 'fold':
        return 'folds';
      case 'check':
        return 'checks';
      case 'call':
        return `calls ${amount ? formatAmount(amount) : ''}`;
      case 'bet':
        return `bets ${amount ? formatAmount(amount) : ''}`;
      case 'raise':
        return `raises to ${amount ? formatAmount(amount) : ''}`;
      case 'all-in':
        return `goes all-in ${amount ? `for ${formatAmount(amount)}` : ''}`;
      default:
        return action;
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Hand History</h2>
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {history.map((hand) => (
            <Card key={hand.id} className="p-4">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => toggleHand(hand.id)}
              >
                {expandedHands.has(hand.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <div className="flex-1">
                  <span className="font-medium">Hand #{hand.handNumber}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {formatDistanceToNow(hand.startTime, { addSuffix: true })}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Blinds: {formatAmount(hand.smallBlind)}/{formatAmount(hand.bigBlind)}
                </div>
              </div>

              {expandedHands.has(hand.id) && (
                <div className="mt-4 space-y-2 pl-6">
                  <div className="text-sm text-muted-foreground">
                    Dealer: {getPlayerName(hand.dealer)}
                  </div>

                  {hand.actions.map((action, index) => (
                    <div key={action.id} className="text-sm">
                      <span className="font-medium">{getPlayerName(action.playerId)}</span>
                      {' '}
                      {formatAction(action.action, action.amount)}
                    </div>
                  ))}

                  {hand.winners.length > 0 && (
                    <div className="mt-4 pt-2 border-t">
                      {hand.winners.map((winner, index) => (
                        <div key={index} className="text-sm text-success">
                          {getPlayerName(winner.playerId)} wins {formatAmount(winner.amount)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}