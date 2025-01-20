export interface HandStrength {
  value: number;
  label: string;
}

export interface PossibleHand {
  name: string;
  description: string;
  requiredCards: string[];
  completed: boolean;
}

export interface HandAnalysis {
  strength: HandStrength;
  possibleHands: PossibleHand[];
}

const HAND_STRENGTHS = {
  "22": {
      "category": "Fold",
      "value": 0
  },
  "33": {
      "category": "Fold",
      "value": 0
  },
  "44": {
      "category": "Weak",
      "value": 1
  },
  "55": {
      "category": "Weak",
      "value": 1
  },
  "66": {
      "category": "Weak",
      "value": 1
  },
  "77": {
      "category": "Normal",
      "value": 2
  },
  "88": {
      "category": "Normal",
      "value": 2
  },
  "99": {
      "category": "Normal",
      "value": 2
  },
  "1010": {
      "category": "Strong",
      "value": 3
  },
  "AA": {
      "category": "Extremely Strong",
      "value": 4
  },
  "AKs": {
      "category": "Extremely Strong",
      "value": 4
  },
  "AKo": {
      "category": "Strong",
      "value": 3
  },
  "AQs": {
      "category": "Extremely Strong",
      "value": 4
  },
  "AQo": {
      "category": "Strong",
      "value": 3
  },
  "AJs": {
      "category": "Extremely Strong",
      "value": 4
  },
  "AJo": {
      "category": "Normal",
      "value": 2
  },
  "A10s": {
      "category": "Normal",
      "value": 2
  },
  "A10o": {
      "category": "Normal",
      "value": 2
  },
  "A9s": {
      "category": "Normal",
      "value": 2
  },
  "A9o": {
      "category": "Normal",
      "value": 2
  },
  "A8s": {
      "category": "Normal",
      "value": 2
  },
  "A8o": {
      "category": "Normal",
      "value": 2
  },
  "A7s": {
      "category": "Normal",
      "value": 2
  },
  "A7o": {
      "category": "Normal",
      "value": 2
  },
  "A6s": {
      "category": "Normal",
      "value": 2
  },
  "A6o": {
      "category": "Normal",
      "value": 2
  },
  "A5s": {
      "category": "Normal",
      "value": 2
  },
  "A5o": {
      "category": "Normal",
      "value": 2
  },
  "A4s": {
      "category": "Normal",
      "value": 2
  },
  "A4o": {
      "category": "Weak",
      "value": 1
  },
  "A3s": {
      "category": "Normal",
      "value": 2
  },
  "A3o": {
      "category": "Weak",
      "value": 1
  },
  "A2s": {
      "category": "Normal",
      "value": 2
  },
  "A2o": {
      "category": "Weak",
      "value": 1
  },
  "KK": {
      "category": "Extremely Strong",
      "value": 4
  },
  "KQs": {
      "category": "Strong",
      "value": 3
  },
  "KQo": {
      "category": "Strong",
      "value": 3
  },
  "KJs": {
      "category": "Strong",
      "value": 3
  },
  "KJo": {
      "category": "Normal",
      "value": 2
  },
  "K10s": {
      "category": "Normal",
      "value": 2
  },
  "K10o": {
      "category": "Normal",
      "value": 2
  },
  "K9s": {
      "category": "Normal",
      "value": 2
  },
  "K9o": {
      "category": "Weak",
      "value": 1
  },
  "K8s": {
      "category": "Normal",
      "value": 2
  },
  "K8o": {
      "category": "Weak",
      "value": 1
  },
  "K7s": {
      "category": "Normal",
      "value": 2
  },
  "K7o": {
      "category": "Weak",
      "value": 1
  },
  "K6s": {
      "category": "Normal",
      "value": 2
  },
  "K6o": {
      "category": "Weak",
      "value": 1
  },
  "K5s": {
      "category": "Normal",
      "value": 2
  },
  "K5o": {
      "category": "Weak",
      "value": 1
  },
  "K4s": {
      "category": "Normal",
      "value": 2
  },
  "K4o": {
      "category": "Weak",
      "value": 1
  },
  "K3s": {
      "category": "Normal",
      "value": 2
  },
  "K3o": {
      "category": "Weak",
      "value": 1
  },
  "K2s": {
      "category": "Normal",
      "value": 2
  },
  "K2o": {
      "category": "Weak",
      "value": 1
  },
  "QQ": {
      "category": "Extremely Strong",
      "value": 4
  },
  "QJs": {
      "category": "Strong",
      "value": 3
  },
  "QJo": {
      "category": "Normal",
      "value": 2
  },
  "Q10s": {
      "category": "Normal",
      "value": 2
  },
  "Q10o": {
      "category": "Normal",
      "value": 2
  },
  "Q9s": {
      "category": "Normal",
      "value": 2
  },
  "Q9o": {
      "category": "Weak",
      "value": 1
  },
  "Q8s": {
      "category": "Normal",
      "value": 2
  },
  "Q8o": {
      "category": "Weak",
      "value": 1
  },
  "Q7s": {
      "category": "Normal",
      "value": 2
  },
  "Q7o": {
      "category": "Weak",
      "value": 1
  },
  "Q6s": {
      "category": "Normal",
      "value": 2
  },
  "Q6o": {
      "category": "Weak",
      "value": 1
  },
  "Q5s": {
      "category": "Normal",
      "value": 2
  },
  "Q5o": {
      "category": "Weak",
      "value": 1
  },
  "Q4s": {
      "category": "Normal",
      "value": 2
  },
  "Q4o": {
      "category": "Weak",
      "value": 1
  },
  "Q3s": {
      "category": "Normal",
      "value": 2
  },
  "Q3o": {
      "category": "Weak",
      "value": 1
  },
  "Q2s": {
      "category": "Normal",
      "value": 2
  },
  "Q2o": {
      "category": "Weak",
      "value": 1
  },
  "JJ": {
      "category": "Strong",
      "value": 3
  },
  "J10s": {
      "category": "Strong",
      "value": 3
  },
  "J10o": {
      "category": "Normal",
      "value": 2
  },
  "J9s": {
      "category": "Normal",
      "value": 2
  },
  "J9o": {
      "category": "Weak",
      "value": 1
  },
  "J8s": {
      "category": "Normal",
      "value": 2
  },
  "J8o": {
      "category": "Weak",
      "value": 1
  },
  "J7s": {
      "category": "Normal",
      "value": 2
  },
  "J7o": {
      "category": "Weak",
      "value": 1
  },
  "J6s": {
      "category": "Normal",
      "value": 2
  },
  "J6o": {
      "category": "Weak",
      "value": 1
  },
  "J5s": {
      "category": "Normal",
      "value": 2
  },
  "J5o": {
      "category": "Weak",
      "value": 1
  },
  "J4s": {
      "category": "Normal",
      "value": 2
  },
  "J4o": {
      "category": "Weak",
      "value": 1
  },
  "J3s": {
      "category": "Normal",
      "value": 2
  },
  "J3o": {
      "category": "Weak",
      "value": 1
  },
  "J2s": {
      "category": "Normal",
      "value": 2
  },
  "J2o": {
      "category": "Weak",
      "value": 1
  },
  "109s": {
      "category": "Strong",
      "value": 3
  },
  "109o": {
      "category": "Normal",
      "value": 2
  },
  "108s": {
      "category": "Normal",
      "value": 2
  },
  "108o": {
      "category": "Weak",
      "value": 1
  },
  "107s": {
      "category": "Normal",
      "value": 2
  },
  "107o": {
      "category": "Weak",
      "value": 1
  },
  "106s": {
      "category": "Normal",
      "value": 2
  },
  "106o": {
      "category": "Weak",
      "value": 1
  },
  "105s": {
      "category": "Normal",
      "value": 2
  },
  "105o": {
      "category": "Weak",
      "value": 1
  },
  "104s": {
      "category": "Normal",
      "value": 2
  },
  "104o": {
      "category": "Weak",
      "value": 1
  },
  "103s": {
      "category": "Normal",
      "value": 2
  },
  "103o": {
      "category": "Weak",
      "value": 1
  },
  "102s": {
      "category": "Normal",
      "value": 2
  },
  "102o": {
      "category": "Weak",
      "value": 1
  },
  "98s": {
      "category": "Normal",
      "value": 2
  },
  "98o": {
      "category": "Normal",
      "value": 2
  },
  "97s": {
      "category": "Weak",
      "value": 1
  },
  "97o": {
      "category": "Weak",
      "value": 1
  },
  "96s": {
      "category": "Weak",
      "value": 1
  },
  "96o": {
      "category": "Fold",
      "value": 0
  },
  "95s": {
      "category": "Weak",
      "value": 1
  },
  "95o": {
      "category": "Fold",
      "value": 0
  },
  "94s": {
      "category": "Weak",
      "value": 1
  },
  "94o": {
      "category": "Fold",
      "value": 0
  },
  "93s": {
      "category": "Weak",
      "value": 1
  },
  "93o": {
      "category": "Fold",
      "value": 0
  },
  "92s": {
      "category": "Weak",
      "value": 1
  },
  "92o": {
      "category": "Fold",
      "value": 0
  },
  "87s": {
      "category": "Normal",
      "value": 2
  },
  "87o": {
      "category": "Normal",
      "value": 2
  },
  "86s": {
      "category": "Weak",
      "value": 1
  },
  "86o": {
      "category": "Weak",
      "value": 1
  },
  "85s": {
      "category": "Weak",
      "value": 1
  },
  "85o": {
      "category": "Fold",
      "value": 0
  },
  "84s": {
      "category": "Weak",
      "value": 1
  },
  "84o": {
      "category": "Fold",
      "value": 0
  },
  "83s": {
      "category": "Weak",
      "value": 1
  },
  "83o": {
      "category": "Fold",
      "value": 0
  },
  "82s": {
      "category": "Weak",
      "value": 1
  },
  "82o": {
      "category": "Fold",
      "value": 0
  },
  "76s": {
      "category": "Normal",
      "value": 2
  },
  "76o": {
      "category": "Weak",
      "value": 1
  },
  "75s": {
      "category": "Weak",
      "value": 1
  },
  "75o": {
      "category": "Weak",
      "value": 1
  },
  "74s": {
      "category": "Weak",
      "value": 1
  },
  "74o": {
      "category": "Fold",
      "value": 0
  },
  "73s": {
      "category": "Weak",
      "value": 1
  },
  "73o": {
      "category": "Fold",
      "value": 0
  },
  "72s": {
      "category": "Weak",
      "value": 1
  },
  "72o": {
      "category": "Fold",
      "value": 0
  },
  "65s": {
      "category": "Normal",
      "value": 2
  },
  "65o": {
      "category": "Weak",
      "value": 1
  },
  "64s": {
      "category": "Weak",
      "value": 1
  },
  "64o": {
      "category": "Weak",
      "value": 1
  },
  "63s": {
      "category": "Weak",
      "value": 1
  },
  "63o": {
      "category": "Fold",
      "value": 0
  },
  "62s": {
      "category": "Weak",
      "value": 1
  },
  "62o": {
      "category": "Fold",
      "value": 0
  },
  "54s": {
      "category": "Weak",
      "value": 1
  },
  "54o": {
      "category": "Fold",
      "value": 0
  },
  "53s": {
      "category": "Weak",
      "value": 1
  },
  "53o": {
      "category": "Fold",
      "value": 0
  },
  "52s": {
      "category": "Weak",
      "value": 1
  },
  "52o": {
      "category": "Fold",
      "value": 0
  },
  "43s": {
      "category": "Weak",
      "value": 1
  },
  "43o": {
      "category": "Fold",
      "value": 0
  },
  "42s": {
      "category": "Weak",
      "value": 1
  },
  "42o": {
      "category": "Fold",
      "value": 0
  },
  "32s": {
      "category": "Weak",
      "value": 1
  },
  "32o": {
      "category": "Fold",
      "value": 0
  }
}

export function analyzeHand(cards: string[]): HandAnalysis {
  const [card1, card2] = cards;
  const rank1 = card1[0];
  const rank2 = card2[0];
  const suit1 = card1[1];
  const suit2 = card2[1];
  const isSuited = suit1 === suit2;
  const isPair = rank1 === rank2;
  // Normalize the order of ranks (higher rank first)
  const [highRank, lowRank] = [rank1, rank2].sort((a, b) => {
    const rankOrder = 'AKQJ1098765432';
    return rankOrder.indexOf(a) - rankOrder.indexOf(b);
  });
  
  // Construct the hand key
  const handKey = isPair
    ? `${highRank}${highRank}`
    : `${highRank}${lowRank}${isSuited ? 's' : 'o'}`;

  // Lookup the hand information
  const handInfo = HAND_STRENGTHS[handKey as keyof typeof HAND_STRENGTHS] || {
    category: 'Weak',
    value: 1,
  };

  const getStrengthLabel = (category: string, value: number): HandStrength => {
    return {
      label: category,
      value: value,
    };
  };

  const strengthAssessment = getStrengthLabel(handInfo.category, handInfo.value);
  const possibleHands = calculatePossibleHands(cards);

  return {
    strength: strengthAssessment,
    possibleHands,
  };
}

function calculatePossibleHands(cards: string[]): PossibleHand[] {
  const [card1, card2] = cards;
  const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  // Get initial values
  const rank1 = card1[0];
  const rank2 = card2[0];
  const suit1 = card1[1];
  const suit2 = card2[1];
  
  // Normalize the order of ranks (higher rank first)
  const [highRank, lowRank] = [rank1, rank2].sort((a, b) => {
    const rankOrder = 'AKQJ1098765432';
    return rankOrder.indexOf(a) - rankOrder.indexOf(b);
  });
  
  // Get high and low suits corresponding to high and low ranks
  const highSuit = rank1 === highRank ? suit1 : suit2;
  const lowSuit = rank1 === highRank ? suit2 : suit1;
  
  const isSuited = highSuit === lowSuit;
  const isPair = highRank === lowRank;
  const possibleHands: PossibleHand[] = [];

  // 1. Royal Flush
  if (isSuited && ['A', 'K', 'Q', 'J', '10'].includes(highRank) && ['A', 'K', 'Q', 'J', '10'].includes(lowRank)) {
    const royalCards = ['A', 'K', 'Q', 'J', '10'];
    const neededCards = royalCards
      .filter(rank => rank !== highRank && rank !== lowRank)
      .map(rank => `${rank}${highSuit}`);

    possibleHands.push({
      name: 'Royal Flush',
      description: `Need ${neededCards.join(', ')} of ${highSuit}`,
      requiredCards: neededCards,
      completed: false
    });
  }

  // 2. Straight Flush
  if (isSuited) {
    const highRankIndex = ranks.indexOf(highRank);
    const lowRankIndex = ranks.indexOf(lowRank);
    const distance = Math.abs(highRankIndex - lowRankIndex);
    
    if (distance <= 4) {
      const lowIndex = Math.max(0, Math.min(highRankIndex, lowRankIndex) - 4);
      const highIndex = Math.min(ranks.length - 1, Math.max(highRankIndex, lowRankIndex) + 4);
      const possibleCards = ranks.slice(lowIndex, highIndex + 1)
        .filter(rank => rank !== highRank && rank !== lowRank)
        .map(rank => `${rank}${highSuit}`);

      possibleHands.push({
        name: 'Straight Flush',
        description: `Need three consecutive cards of ${highSuit}`,
        requiredCards: possibleCards,
        completed: false
      });
    }
  }

  // 3. Four of a Kind
  if (isPair) {
    const neededCards = [`${highRank}♠`, `${highRank}♥`, `${highRank}♦`, `${highRank}♣`]
      .filter(c => !cards.includes(c));

    possibleHands.push({
      name: 'Four of a Kind',
      description: `Need ${neededCards.length} more ${highRank}'s`,
      requiredCards: neededCards,
      completed: false
    });
  }

  // 4. Full House
  if (isPair) {
    possibleHands.push({
      name: 'Full House',
      description: 'Need three of any other rank',
      requiredCards: [],
      completed: false
    });
  }

  // 5. Flush
  if (isSuited) {
    const suitSymbols = { '♠': 'spades', '♥': 'hearts', '♦': 'diamonds', '♣': 'clubs' };
    possibleHands.push({
      name: 'Flush',
      description: `Need three more ${suitSymbols[highSuit as keyof typeof suitSymbols]}`,
      requiredCards: [],
      completed: false
    });
  }

  // 6. Straight
  const highRankIndex = ranks.indexOf(highRank);
  const lowRankIndex = ranks.indexOf(lowRank);
  const distance = Math.abs(highRankIndex - lowRankIndex);
  
  if (distance <= 4) {
    const lowIndex = Math.max(0, Math.min(highRankIndex, lowRankIndex) - 4);
    const highIndex = Math.min(ranks.length - 1, Math.max(highRankIndex, lowRankIndex) + 4);
    const possibleCards = ranks.slice(lowIndex, highIndex + 1)
      .filter(rank => rank !== highRank && rank !== lowRank);

    possibleHands.push({
      name: 'Straight',
      description: `Possible with ${possibleCards.join(', ')}`,
      requiredCards: possibleCards,
      completed: false
    });
  }

  // 7. Three of a Kind
  possibleHands.push({
    name: 'Three of a Kind',
    description: isPair ? `Need one more ${highRank}` : 'Need two matching cards',
    requiredCards: isPair ? [`${highRank}♠`, `${highRank}♥`, `${highRank}♦`, `${highRank}♣`]
      .filter(c => !cards.includes(c))
      .slice(0, 1) : [],
    completed: false
  });

  // 8. Two Pair
  possibleHands.push({
    name: 'Two Pair',
    description: isPair ? 'Need another pair' : 'Need matching cards for both',
    requiredCards: [],
    completed: false
  });

  // 9. One Pair
  possibleHands.push({
    name: 'One Pair',
    description: isPair ? 'Already have a pair' : 'Need one matching card',
    requiredCards: [],
    completed: isPair
  });

  // 10. High Card
  possibleHands.push({
    name: 'High Card',
    description: `${highRank} high`,
    requiredCards: [],
    completed: true
  });

  return possibleHands;
}