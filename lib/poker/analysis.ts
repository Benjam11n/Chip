export interface HandStrength {
  value: number;
  label: string;
}

export interface PossibleHand {
  name: string;
  description: string;
  requiredCards: string[];
}

export interface HandAnalysis {
  strength: HandStrength;
  possibleHands: PossibleHand[];
}

const HAND_STRENGTHS = {
  'AA': { category: 'Extremely Strong', value: 4 },
  'KK': { category: 'Extremely Strong', value: 4 },
  'QQ': { category: 'Extremely Strong', value: 4 },
  'AKs': { category: 'Extremely Strong', value: 4 },
  'JJ': { category: 'Strong', value: 3 },
  'AQs': { category: 'Strong', value: 3 },
  'KQs': { category: 'Strong', value: 3 },
  'AJs': { category: 'Strong', value: 3 },
  'KJs': { category: 'Strong', value: 3 },
  'QJs': { category: 'Strong', value: 3 },
  'ATs': { category: 'Normal', value: 2 },
  'KTs': { category: 'Normal', value: 2 },
  'QTs': { category: 'Normal', value: 2 },
  'JTs': { category: 'Normal', value: 2 },
  '109s': { category: 'Normal', value: 2 },
  '98s': { category: 'Normal', value: 2 },
  '87s': { category: 'Normal', value: 2 },
  '76s': { category: 'Normal', value: 2 },
  '65s': { category: 'Normal', value: 2 },
  '54s': { category: 'Normal', value: 2 },
  '43s': { category: 'Normal', value: 2 },
  '32s': { category: 'Weak', value: 1 },
  'AKo': { category: 'Strong', value: 3 },
  'KQo': { category: 'Strong', value: 3 },
  'AQo': { category: 'Strong', value: 3 },
  'KJo': { category: 'Normal', value: 2 },
  'QJo': { category: 'Normal', value: 2 },
  'J10o': { category: 'Normal', value: 2 },
  'T8o': { category: 'Weak', value: 1 },
  '97o': { category: 'Weak', value: 1 },
  '86o': { category: 'Weak', value: 1 },
  '75o': { category: 'Weak', value: 1 },
  '64o': { category: 'Weak', value: 1 },
  '53o': { category: 'Weak', value: 1 },
  '42o': { category: 'Weak', value: 1 },
  '32o': { category: 'Fold', value: 0 },
  '33': { category: 'Fold', value: 0 },
  '22': { category: 'Fold', value: 0 },
};

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
    const rankOrder = 'AKQJT98765432';
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
  const rank1 = card1[0];
  const rank2 = card2[0];
  const suit1 = card1[1];
  const suit2 = card2[1];
  const isSuited = suit1 === suit2;
  const isPair = rank1 === rank2;

  const possibleHands: PossibleHand[] = [];

  // Helper function to get ranks in order
  const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  // Check for Four of a Kind
  if (isPair) {
    possibleHands.push({
      name: 'Four of a Kind',
      description: `Need two more ${rank1}'s`,
      requiredCards: [`${rank1}♠`, `${rank1}♥`, `${rank1}♦`, `${rank1}♣`].filter(c => !cards.includes(c))
    });

    possibleHands.push({
      name: 'Full House',
      description: 'Need three of any other rank',
      requiredCards: []
    });
  }

  // Check for Flush (same suit)
  if (isSuited) {
    possibleHands.push({
      name: 'Flush',
      description: `Need three more ${suit1} cards`,
      requiredCards: []
    });
    
    // Check for Straight Flush
    const rank1Index = ranks.indexOf(rank1);
    const rank2Index = ranks.indexOf(rank2);
    const distance = Math.abs(rank1Index - rank2Index);
    
    if (distance <= 4) {
      possibleHands.push({
        name: 'Straight Flush',
        description: 'Need three consecutive suited cards',
        requiredCards: []
      });
    }

    // Check for Royal Flush
    if (rank1 === 'A' && rank2 === 'K') {
      possibleHands.push({
        name: 'Royal Flush',
        description: 'Need 10, J, Q of the same suit',
        requiredCards: [`10${suit1}`, `J${suit1}`, `Q${suit1}`].filter(c => !cards.includes(c))
      });
    }
  }

  // Check for Straight
  if (ranks.indexOf(rank1) - ranks.indexOf(rank2) <= 4) {
    possibleHands.push({
      name: 'Straight',
      description: 'Need three connecting cards',
      requiredCards: []
    });
  }

  // Always possible hands
  possibleHands.push({
    name: 'Three of a Kind',
    description: isPair ? 'Need one more matching card' : 'Need two matching cards',
    requiredCards: []
  });

  possibleHands.push({
    name: 'Two Pair',
    description: isPair ? 'Need another pair' : 'Need matching cards for both',
    requiredCards: []
  });

  possibleHands.push({
    name: 'One Pair',
    description: isPair ? 'Already have a pair' : 'Need one matching card',
    requiredCards: []
  });

  // High Card (if no other hands are possible)
  possibleHands.push({
    name: 'High Card',
    description: 'No other hand, high card is the best',
    requiredCards: []
  });

  return possibleHands;
}
