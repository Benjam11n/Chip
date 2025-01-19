'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Dices } from 'lucide-react';
import { toast } from 'sonner';

// Type for the game data
interface GameData {
  name: string;
  maxPlayers: number;
  initialBuyIn: number;
}

export default function CreateGamePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [initialBuyIn, setInitialBuyIn] = useState(1000);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    const gameData: GameData = {
      name: name.trim(),
      maxPlayers,
      initialBuyIn,
    };

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create game');
      }

      const data = await response.json();

      toast.success('Success', {
        description: 'Game created successfully',
      });

      router.push(`/join/${data.code}`);
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Failed to create game',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    // Round to nearest $5 and ensure minimum of $100
    const roundedValue = Math.max(100, Math.round(value / 5) * 5);
    setInitialBuyIn(roundedValue);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center justify-center gap-2 mt-6">
          <Dices className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Create Game</h1>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Game Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter game name"
                disabled={loading}
              />
            </div>

            <div className="space-y-4">
              <Label>Maximum Players: {maxPlayers}</Label>
              <Slider
                value={[maxPlayers]}
                onValueChange={(value) => setMaxPlayers(value[0])}
                min={2}
                max={12}
                step={1}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Set the maximum number of players that can join your game.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyIn">Initial Buy-in Amount ($)</Label>
              <Input
                id="buyIn"
                type="number"
                min={100}
                max={100000000}
                step={5}
                value={initialBuyIn}
                onChange={handleBuyInChange}
                placeholder="Enter initial buy-in amount"
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Set the initial amount each player starts with. Minimum $100, in
                increments of $5.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!name.trim() || loading}
            >
              {loading ? 'Creating...' : 'Create Game'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
