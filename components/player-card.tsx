'use client';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PlayerView } from '@/types';

import { PlayerCardSkeleton } from './skeletons';
import { Badge } from './ui/badge';

interface PlayerCardProps {
  player: PlayerView | null;
  isCurrentUser: boolean;
  onPotAction: (playerId: string, amount: number, action: 'add' | 'remove') => void;
  pot: number;
  isLoading?: boolean;
  actionLoading?: boolean;
}

export function PlayerCard({
  player,
  isCurrentUser,
  onPotAction,
  pot,
  isLoading = false,
  actionLoading = false,
}: Readonly<PlayerCardProps>) {
  const [amount, setAmount] = useState(5);

  const handleAmountChange = (newAmount: number) => {
    const roundedAmount = Math.max(5, Math.round(newAmount / 5) * 5);
    setAmount(roundedAmount);
  };

  if (isLoading) {
    return <PlayerCardSkeleton />;
  }

  if (!player) return null;

  return (
    <Card className={cn('h-fit', isCurrentUser && 'border-primary/20 bg-primary/5')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-foreground font-semibold">
            {player.name}
            {isCurrentUser && (
              <Badge className="bg-primary/20 text-primary ml-2 rounded-full px-2 text-xs">
                You
              </Badge>
            )}
          </h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-left">
          <span className="text-foreground text-lg font-bold">${player.stack}</span>
        </div>
        {isCurrentUser && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAmountChange(amount - 5)}
                disabled={amount <= 5 || actionLoading}
              >
                <Minus className="size-4" />
              </Button>
              <Input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="text-center"
                step={5}
                min={0}
                disabled={actionLoading}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAmountChange(amount + 5)}
                disabled={actionLoading}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => onPotAction(player.id, amount, 'add')}
                disabled={player.stack < amount || actionLoading}
              >
                Add to Pot
              </Button>
              <Button
                onClick={() => onPotAction(player.id, player.stack, 'add')}
                disabled={player.stack < amount || actionLoading}
              >
                All in
              </Button>
              <Button
                variant="outline"
                onClick={() => onPotAction(player.id, amount, 'remove')}
                disabled={pot < amount || actionLoading}
              >
                Take from Pot
              </Button>
              <Button
                variant="outline"
                onClick={() => onPotAction(player.id, pot, 'remove')}
                disabled={pot < amount || actionLoading}
              >
                Take all from Pot
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
