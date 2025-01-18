'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';
import { Player } from '@/app/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Badge } from './ui/badge';

interface PlayerCardProps {
  player: Player;
  isCurrentUser: boolean;
  onPotAction: (
    playerId: string,
    amount: number,
    action: 'add' | 'remove'
  ) => void;
  pot: number;
}

export function PlayerCard({
  player,
  isCurrentUser,
  onPotAction,
  pot,
}: PlayerCardProps) {
  const [amount, setAmount] = useState(5);

  const handleAmountChange = (newAmount: number) => {
    const roundedAmount = Math.max(5, Math.round(newAmount / 5) * 5);
    setAmount(roundedAmount);
  };

  return (
    <Card className={cn('', isCurrentUser && 'bg-primary/5 border-primary/20')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg text-foreground">
            {player.name}
            {isCurrentUser && (
              <Badge className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full ml-2">
                You
              </Badge>
            )}
          </h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-left">
          <span className="text-2xl font-bold text-foreground">
            ${player.stack}
          </span>
        </div>
        {isCurrentUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAmountChange(amount - 5)}
                disabled={amount <= 5}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="text-center"
                step={5}
                min={0}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAmountChange(amount + 5)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => onPotAction(player.id, amount, 'add')}
                disabled={player.stack < amount}
              >
                Add to Pot
              </Button>
              <Button
                onClick={() => onPotAction(player.id, player.stack, 'add')}
                disabled={player.stack < amount}
              >
                All in
              </Button>
              <Button
                variant="outline"
                onClick={() => onPotAction(player.id, amount, 'remove')}
                disabled={pot < amount}
              >
                Take from Pot
              </Button>
              <Button
                variant="outline"
                onClick={() => onPotAction(player.id, pot, 'remove')}
                disabled={pot < amount}
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
