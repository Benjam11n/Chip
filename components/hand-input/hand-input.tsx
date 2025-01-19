'use client';

import { useState } from 'react';
import { CardSelector } from './card-selector';
import { HandAnalyzer } from './hand-analyzer';
import { analyzeHand } from '@/lib/poker/analysis';

export function HandInput() {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const handleCardSelect = (card: string) => {
    setSelectedCards((prev) => {
      if (prev.includes(card)) {
        return prev.filter((c) => c !== card);
      }
      if (prev.length < 2) {
        return [...prev, card];
      }
      return prev;
    });
  };

  const analysis =
    selectedCards.length === 2 ? analyzeHand(selectedCards) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CardSelector
            selectedCards={selectedCards}
            onSelectCard={handleCardSelect}
          />
        </div>

        <HandAnalyzer analysis={analysis} />
      </div>
    </div>
  );
}
