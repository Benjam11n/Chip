import { HAND_STRENGTHS, RANKS } from "@/constants";

interface HandStrength {
  value: number;
  label: string;
}

interface PossibleHand {
  name: string;
  description: string;
  requiredCards: string[];
  completed: boolean;
}

export interface HandAnalysis {
  strength: HandStrength;
  possibleHands: PossibleHand[];
}

export function analyzeHand(cards: string[]): HandAnalysis {
  const [card1, card2] = cards;
  const [rank1] = card1 ?? "";
  const [rank2] = card2 ?? "";
  const [, suit1] = card1 ?? "";
  const [, suit2] = card2 ?? "";
  const isSuited = suit1 === suit2;
  const isPair = rank1 === rank2;
  // Normalize the order of ranks (higher rank first)
  const [highRank, lowRank] = [rank1, rank2].sort((a, b) => {
    const rankOrder = "AKQJT98765432";
    return rankOrder.indexOf(a as string) - rankOrder.indexOf(b as string);
  });

  // Construct the hand key
  const handKey = isPair
    ? `${highRank}${highRank}`
    : `${highRank}${lowRank}${isSuited ? "s" : "o"}`;

  // Lookup the hand information
  const handInfo = HAND_STRENGTHS[handKey as keyof typeof HAND_STRENGTHS] ?? {
    category: "Weak",
    value: 1,
  };

  const getStrengthLabel = (category: string, value: number): HandStrength => {
    return {
      label: category,
      value: value,
    };
  };

  const strengthAssessment = getStrengthLabel(
    handInfo.category,
    handInfo.value,
  );
  const possibleHands = calculatePossibleHands(cards);

  return {
    strength: strengthAssessment,
    possibleHands,
  };
}

function calculatePossibleHands(cards: string[]): PossibleHand[] {
  const [card1, card2] = cards;

  // Get initial values
  const [rank1] = card1 ?? "";
  const [rank2] = card2 ?? "";
  const [, suit1] = card1 ?? "";
  const [, suit2] = card2 ?? "";

  // Normalize the order of ranks (higher rank first)
  const [highRank, lowRank] = [rank1, rank2].sort((a, b) => {
    const rankOrder = "AKQJT98765432";
    return rankOrder.indexOf(a as string) - rankOrder.indexOf(b as string);
  });

  // Get high and low suits corresponding to high and low ranks
  const highSuit = rank1 === highRank ? suit1 : suit2;
  const lowSuit = rank1 === highRank ? suit2 : suit1;

  const isSuited = highSuit === lowSuit;
  const isPair = highRank === lowRank;
  const possibleHands: PossibleHand[] = [];

  // 1. Royal Flush
  // If we have any high card (A, K, Q, J, T)
  const royalCards = ["A", "K", "Q", "J", "T"];
  // First, check if we have any royal cards
  if (
    royalCards.includes(rank1 as string) || royalCards.includes(rank2 as string)
  ) {
    // Get unique suits that have royal cards
    const suitMap = new Set<string>();
    if (royalCards.includes(rank1 as string)) suitMap.add(suit1 as string);
    if (royalCards.includes(rank2 as string)) suitMap.add(suit2 as string);

    // For each suit that has a royal card
    suitMap.forEach((suit) => {
      // Get the ranks we have in this suit
      const existingRanks: string[] = [];
      if (suit1 === suit) existingRanks.push(rank1 as string);
      if (suit2 === suit) existingRanks.push(rank2 as string);

      const neededCards = royalCards
        .filter((rank) => !existingRanks.includes(rank))
        .map((rank) => `${rank}${suit}`);

      possibleHands.push({
        name: "Royal Flush",
        description: `Need ${neededCards.join(", ")} of ${suit}`,
        requiredCards: neededCards,
        completed: false,
      });
    });
  }

  // 2. Straight Flush
  if (isSuited) {
    const highRankIndex = RANKS.indexOf(highRank as typeof RANKS[number]);
    const lowRankIndex = RANKS.indexOf(lowRank as typeof RANKS[number]);
    const distance = Math.abs(highRankIndex - lowRankIndex);

    if (distance <= 4) {
      const lowIndex = Math.max(0, Math.min(highRankIndex, lowRankIndex) - 4);
      const highIndex = Math.min(
        RANKS.length - 1,
        Math.max(highRankIndex, lowRankIndex) + 4,
      );
      const possibleCards = RANKS.slice(lowIndex, highIndex + 1)
        .filter((rank) => rank !== highRank && rank !== lowRank)
        .map((rank) => `${rank}${highSuit}`);

      possibleHands.push({
        name: "Straight Flush",
        description: `Need three consecutive cards of ${highSuit}`,
        requiredCards: possibleCards,
        completed: false,
      });
    }
  }

  // 3. Four of a Kind
  if (isPair) {
    const neededCards = [
      `${highRank}♠`,
      `${highRank}♥`,
      `${highRank}♦`,
      `${highRank}♣`,
    ].filter(
      (c) => !cards.includes(c),
    );

    possibleHands.push({
      name: "Four of a Kind",
      description: `Need ${neededCards.length} more ${highRank}'s`,
      requiredCards: neededCards,
      completed: false,
    });
  }

  // 4. Full House
  if (isPair) {
    possibleHands.push({
      name: "Full House",
      description: "Need three of any other rank",
      requiredCards: [],
      completed: false,
    });
  }

  // 5. Flush
  if (isSuited) {
    const suitSymbols = {
      "♠": "spades",
      "♥": "hearts",
      "♦": "diamonds",
      "♣": "clubs",
    };
    possibleHands.push({
      name: "Flush",
      description: `Need three more ${
        suitSymbols[highSuit as keyof typeof suitSymbols]
      }`,
      requiredCards: [],
      completed: false,
    });
  }

  // 6. Straight
  const highRankIndex = RANKS.indexOf(highRank as typeof RANKS[number]);
  const lowRankIndex = RANKS.indexOf(lowRank as typeof RANKS[number]);
  const distance = Math.abs(highRankIndex - lowRankIndex);

  if (distance <= 4) {
    const lowIndex = Math.max(0, Math.min(highRankIndex, lowRankIndex) - 4);
    const highIndex = Math.min(
      RANKS.length - 1,
      Math.max(highRankIndex, lowRankIndex) + 4,
    );
    const possibleCards = RANKS.slice(lowIndex, highIndex + 1).filter(
      (rank) => rank !== highRank && rank !== lowRank,
    );

    possibleHands.push({
      name: "Straight",
      description: `Possible with ${possibleCards.join(", ")}`,
      requiredCards: possibleCards,
      completed: false,
    });
  }

  // 7. Three of a Kind
  possibleHands.push({
    name: "Three of a Kind",
    description: isPair
      ? `Need one more ${highRank}`
      : "Need two matching cards",
    requiredCards: isPair
      ? [`${highRank}♠`, `${highRank}♥`, `${highRank}♦`, `${highRank}♣`]
        .filter((c) => !cards.includes(c))
        .slice(0, 1)
      : [],
    completed: false,
  });

  // 8. Two Pair
  possibleHands.push({
    name: "Two Pair",
    description: isPair ? "Need another pair" : "Need matching cards for both",
    requiredCards: [],
    completed: false,
  });

  // 9. One Pair
  possibleHands.push({
    name: "One Pair",
    description: isPair ? "Already have a pair" : "Need one matching card",
    requiredCards: [],
    completed: isPair,
  });

  // 10. High Card
  possibleHands.push({
    name: "High Card",
    description: `${highRank} high`,
    requiredCards: [],
    completed: true,
  });

  return possibleHands;
}
