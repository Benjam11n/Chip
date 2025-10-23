"use client";

import { Card } from "@/components/ui/card";

const SUIT_COLORS = {
  "♠": "text-foreground",
  "♥": "text-red-500",
  "♦": "text-red-500",
  "♣": "text-foreground",
};

const POKER_HANDS = [
  {
    name: "Royal Flush",
    description: "A, K, Q, J, 10 of the same suit",
    example: "A♠ K♠ Q♠ J♠ 10♠",
    strength: "Best possible hand",
  },
  {
    name: "Straight Flush",
    description: "Five consecutive cards of the same suit",
    example: "9♥ 8♥ 7♥ 6♥ 5♥",
    strength: "Extremely rare",
  },
  {
    name: "Four of a Kind",
    description: "Four cards of the same rank",
    example: "Q♠ Q♣ Q♥ Q♦ 2♣",
    strength: "Very strong",
  },
  {
    name: "Full House",
    description: "Three of a kind plus a pair",
    example: "J♠ J♥ J♦ 8♣ 8♠",
    strength: "Strong",
  },
  {
    name: "Flush",
    description: "Any five cards of the same suit",
    example: "A♣ J♣ 8♣ 6♣ 2♣",
    strength: "Strong",
  },
  {
    name: "Straight",
    description: "Five consecutive cards of any suit",
    example: "8♠ 7♥ 6♦ 5♣ 4♠",
    strength: "Good",
  },
  {
    name: "Three of a Kind",
    description: "Three cards of the same rank",
    example: "7♠ 7♥ 7♦ K♣ 2♠",
    strength: "Above average",
  },
  {
    name: "Two Pair",
    description: "Two different pairs",
    example: "K♠ K♥ 9♦ 9♣ A♠",
    strength: "Average",
  },
  {
    name: "One Pair",
    description: "Two cards of the same rank",
    example: "10♠ 10♥ A♦ 7♣ 2♠",
    strength: "Common",
  },
  {
    name: "High Card",
    description: "Highest card plays",
    example: "A♠ K♥ J♦ 8♣ 4♠",
    strength: "Weakest hand",
  },
];

function formatCardExample(example: string) {
  return example.split(" ").map((card) => {
    const suit = card.slice(-1); // Last character is the suit
    const rank = card.slice(0, -1); // The rest is the rank
    return (
      <span key={card}>
        <span className={SUIT_COLORS[suit as keyof typeof SUIT_COLORS]}>
          {suit}
        </span>{" "}
        {rank}{" "}
      </span>
    );
  });
}

export const PokerHandsChart = () => (
  <div className="py-3">
    <h2 className="mb-6 font-bold text-2xl">Poker Hand Rankings</h2>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {POKER_HANDS.map((hand) => (
        <Card className="space-y-2 p-4" key={hand.name}>
          <h3 className="font-bold text-lg">{hand.name}</h3>
          <p className="text-muted-foreground text-sm">{hand.description}</p>
          <div className="font-mono text-lg">
            {formatCardExample(hand.example)}
          </div>
          <p className="font-medium text-muted-foreground text-sm">
            {hand.strength}
          </p>
        </Card>
      ))}
    </div>
  </div>
);
