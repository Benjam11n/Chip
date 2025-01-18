'use client';

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Player, ChipCount, CHIP_COLORS, DEFAULT_DENOMINATIONS } from '../types';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: Player;
  isActive?: boolean;
  isDealer?: boolean;
  onUpdate: (id: string, chipCounts: ChipCount) => void;
  onRemove: (id: string) => void;
}

export function PlayerCard({ player, isActive, isDealer, onUpdate, onRemove }: PlayerCardProps) {
  const calculateTotal = () => {
    return Object.entries(player.chipCounts).reduce((total, [denom, count]) => {
      return total + (Number(denom) * count);
    }, 0);
  };

  const updateChipCount = (denomination: number, increment: boolean) => {
    const newCount = (player.chipCounts[denomination] || 0) + (increment ? 1 : -1);
    const newCounts = {
      ...player.chipCounts,
      [denomination]: Math.max(0, newCount)
    };
    onUpdate(player.id, newCounts);
  };

  return (
    <Card className={cn(
      "h-full transition-colors",
      isActive && "ring-2 ring-primary",
      player.hasActed && "opacity-75"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">{player.name}</h3>
          {isDealer && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              Dealer
            </span>
          )}
          {player.isAllIn && (
            <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
              All-In
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={() => onRemove(player.id)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {DEFAULT_DENOMINATIONS.map(denom => (
            <div
              key={denom}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm',
                CHIP_COLORS[denom as keyof typeof CHIP_COLORS],
                denom === 1 ? 'text-black' : 'text-white'
              )}
            >
              {player.chipCounts[denom] || 0}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {DEFAULT_DENOMINATIONS.map(denomination => (
            <div key={denomination} className="flex items-center justify-between gap-2">
              <span className="font-medium min-w-[60px]">${denomination}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateChipCount(denomination, false)}
                  disabled={!player.chipCounts[denomination]}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  className="w-16 text-center h-8"
                  value={player.chipCounts[denomination] || 0}
                  readOnly
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateChipCount(denomination, true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="w-full flex justify-between items-center">
          <span className="text-sm font-medium">Stack:</span>
          <span className="text-xl font-bold">${player.stack}</span>
        </div>
      </CardFooter>
    </Card>
  );
}