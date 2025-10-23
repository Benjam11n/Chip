"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { RANKS, SUIT_COLORS, SUITS } from "@/constants";
import { cn } from "@/lib/utils";

type CardSelectorProps = {
  selectedCards: string[];
  onSelectCard: (card: string) => void;
};

export const CardSelector = ({
  selectedCards,
  onSelectCard,
}: Readonly<CardSelectorProps>) => {
  const [selectedRank, setSelectedRank] = useState<string | null>(null);
  const [selectedSuit, setSelectedSuit] = useState<string | null>(null);

  const handleCardClick = (rank: string, suit: string) => {
    const card = `${rank}${suit}`;
    if (selectedCards.includes(card)) {
      onSelectCard(card);
    } else if (selectedCards.length < 2) {
      onSelectCard(card);

      setSelectedRank(null);
      setSelectedSuit(null);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-4 gap-2">
        {SUITS.map((suit) => (
          <Button
            className={cn(
              "h-12 font-normal text-2xl",
              selectedSuit === suit
                ? `${SUIT_COLORS[suit as keyof typeof SUIT_COLORS]}/90`
                : SUIT_COLORS[suit as keyof typeof SUIT_COLORS]
            )}
            key={suit}
            onClick={() => setSelectedSuit(suit === selectedSuit ? null : suit)}
            variant={selectedSuit === suit ? "default" : "outline"}
          >
            {suit}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {RANKS.map((rank) => (
          <Button
            className="h-12"
            key={rank}
            onClick={() => setSelectedRank(rank === selectedRank ? null : rank)}
            variant={selectedRank === rank ? "default" : "outline"}
          >
            {rank}
          </Button>
        ))}
      </div>
      {selectedRank && selectedSuit ? (
        <Button
          className="w-full"
          onClick={() => handleCardClick(selectedRank, selectedSuit)}
        >
          Add {selectedRank}
          {selectedSuit}
        </Button>
      ) : null}
      <div className="flex justify-center gap-4">
        {selectedCards.map((card) => (
          <Button
            className={cn(
              "h-16 w-12 font-normal text-xl",
              SUIT_COLORS[card[1] as keyof typeof SUIT_COLORS]
            )}
            key={card}
            onClick={() => onSelectCard(card)}
            variant="outline"
          >
            {card[0]}
            {card[1]}
          </Button>
        ))}
      </div>
    </div>
  );
};
