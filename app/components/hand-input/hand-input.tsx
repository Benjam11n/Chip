'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardSelector } from './card-selector';
import { PositionSelector } from './position-selector';
import { HandAnalyzer } from './hand-analyzer';
import { analyzeHand } from '@/lib/poker/analysis';

export function HandInput() {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [position, setPosition] = useState<string | null>(null);
  const [stackSize, setStackSize] = useState(100);

  const handleCardSelect = (card: string) => {
    setSelectedCards(prev => {
      if (prev.includes(card)) {
        return prev.filter(c => c !== card);
      }
      if (prev.length < 2) {
        return [...prev, card];
      }
      return prev;
    });
  };

  const analysis = selectedCards.length === 2 && position
    ? analyzeHand(selectedCards, position, stackSize)
    : null;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CardSelector
            selectedCards={selectedCards}
            onSelectCard={handleCardSelect}
          />
          
          <div className="space-y-4">
            <Label htmlFor="stackSize">Stack Size (BB)</Label>
            <Input
              id="stackSize"
              type="number"
              min={1}
              value={stackSize}
              onChange={(e) => setStackSize(Number(e.target.value))}
            />
          </div>

          <Card className="p-4">
            <Label className="mb-4 block">Position</Label>
            <PositionSelector
              selectedPosition={position}
              onSelectPosition={setPosition}
            />
          </Card>
        </div>

        <HandAnalyzer
          cards={selectedCards}
          position={position}
          stackSize={stackSize}
          analysis={analysis}
        />
      </div>
    </div>
  );
}