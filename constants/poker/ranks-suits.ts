/**
 * Basic poker card constants
 */

export const RANKS = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
] as const;

export const SUITS = ["♠", "♥", "♦", "♣"] as const;

export const SUIT_COLORS = {
  "♠": "text-foreground",
  "♥": "text-red-500",
  "♦": "text-red-500",
  "♣": "text-foreground",
} as const;
