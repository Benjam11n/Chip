'use client';

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';
import { Player } from '@/app/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PlayerCardProps {
  player: Player;
  isCurrentUser: boolean;
  onPotAction: (playerId: string, amount: number, action: 'add' | 'remove') => void;
  pot: number;
}

export function PlayerCard({ player, isCurrentUser, onPotAction, pot }: PlayerCardProps) {
  const [amount, setAmount] = useState(5);

  const handleAmountChange = (newAmount: number) => {
    const roundedAmount = Math.max(5, Math.round(newAmount / 5) * 5);
    setAmount(roundedAmount);
  };

  return (
    <Card className={cn(
      "bg-zinc-900 border-zinc-800",
      isCurrentUser && "bg-red-950/20 border-red-900/50"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg text-white">
            {player.name}
            {isCurrentUser && (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full ml-2">
                You
              </span>
            )}
          </h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-2xl font-bold text-white">${player.stack}</span>
        </div>

        {isCurrentUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAmountChange(amount - 5)}
                disabled={amount <= 5}
                className="border-zinc-700 text-white hover:bg-zinc-800"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="text-center bg-zinc-800 border-zinc-700 text-white"
                step={5}
                min={5}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAmountChange(amount + 5)}
                className="border-zinc-700 text-white hover:bg-zinc-800"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="default"
                onClick={() => onPotAction(player.id, amount, 'add')}
                disabled={player.stack < amount}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Add to Pot
              </Button>
              <Button
                variant="outline"
                onClick={() => onPotAction(player.id, amount, 'remove')}
                disabled={pot < amount}
                className="w-full border-red-500 text-red-500 hover:bg-red-950"
              >
                Take from Pot
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-zinc-800 pt-4">
        <div className="w-full flex justify-between items-center text-white">
          <span className="text-sm font-medium">Stack:</span>
          <span className="text-xl font-bold">${player.stack}</span>
        </div>
      </CardFooter>
    </Card>
  );
}