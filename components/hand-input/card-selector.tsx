'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const RANKS = [
  'A',
  'K',
  'Q',
  'J',
  '10',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
];
const SUITS = ['♠', '♥', '♦', '♣'];
const SUIT_COLORS = {
  '♠': 'text-foreground',
  '♥': 'text-red-500',
  '♦': 'text-red-500',
  '♣': 'text-foreground',
};

interface CardSelectorProps {
  selectedCards: string[];
  onSelectCard: (card: string) => void;
}

export function CardSelector({
  selectedCards,
  onSelectCard,
}: CardSelectorProps) {
  const [selectedRank, setSelectedRank] = useState<string | null>(null);
  const [selectedSuit, setSelectedSuit] = useState<string | null>(null);

  const handleCardClick = (rank: string, suit: string) => {
    const card = `${rank}${suit}`;
    if (selectedCards.includes(card)) {
      onSelectCard(card); // Will remove the card
    } else if (selectedCards.length < 2) {
      onSelectCard(card); // Will add the card
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-4 gap-2">
        {SUITS.map((suit) => (
          <Button
            key={suit}
            variant={selectedSuit === suit ? 'default' : 'outline'}
            className={cn(
              'text-2xl font-normal h-12',
              selectedSuit === suit
                ? SUIT_COLORS[suit as keyof typeof SUIT_COLORS] + '/90'
                : SUIT_COLORS[suit as keyof typeof SUIT_COLORS]
            )}
            onClick={() => setSelectedSuit(suit === selectedSuit ? null : suit)}
          >
            {suit}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {RANKS.map((rank) => (
          <Button
            key={rank}
            variant={selectedRank === rank ? 'default' : 'outline'}
            className="h-12"
            onClick={() => setSelectedRank(rank === selectedRank ? null : rank)}
          >
            {rank}
          </Button>
        ))}
      </div>

      {selectedRank && selectedSuit && (
        <Button
          className="w-full"
          onClick={() => handleCardClick(selectedRank, selectedSuit)}
        >
          Add {selectedRank}
          {selectedSuit}
        </Button>
      )}

      <div className="flex justify-center gap-4">
        {selectedCards.map((card) => (
          <Button
            key={card}
            variant="outline"
            className={cn(
              'text-xl font-normal h-16 w-12',
              SUIT_COLORS[card[1] as keyof typeof SUIT_COLORS]
            )}
            onClick={() => onSelectCard(card)}
          >
            {card}
          </Button>
        ))}
      </div>
    </div>
  );
}
