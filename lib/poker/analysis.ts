'use client';

interface HandStrength {
  value: number;
  label: string;
  color: string;
}

interface PossibleHand {
  name: string;
  probability: number;
  description: string;
  requiredCards: string[];
}

interface HandAnalysis {
  strength: HandStrength;
  possibleHands: PossibleHand[];
}

const HAND_RANKINGS = {
  'AA': 100,
  'KK': 95,
  'QQ': 90,
  'AKs': 85,
  'JJ': 80,
  'AQs': 75,
  'KQs': 70,
  'AJs': 65,
  'KJs': 60,
  'QJs': 55,
  // Add more rankings as needed
};

export function analyzeHand(cards: string[]): HandAnalysis {
  const [card1, card2] = cards;
  const rank1 = card1[0];
  const rank2 = card2[0];
  const suit1 = card1[1];
  const suit2 = card2[1];
  const isSuited = suit1 === suit2;
  const isPair = rank1 === rank2;

  const handKey = isPair ? `${rank1}${rank1}` : `${rank1}${rank2}${isSuited ? 's' : 'o'}`;
  const baseStrength = HAND_RANKINGS[handKey as keyof typeof HAND_RANKINGS] || 30;

  const getStrengthLabel = (value: number): HandStrength => {
    if (value >= 90) return { value, label: 'Premium', color: 'bg-green-500' };
    if (value >= 75) return { value, label: 'Strong', color: 'bg-emerald-500' };
    if (value >= 60) return { value, label: 'Playable', color: 'bg-yellow-500' };
    if (value >= 45) return { value, label: 'Marginal', color: 'bg-orange-500' };
    return { value, label: 'Weak', color: 'bg-red-500' };
  };

  const possibleHands = calculatePossibleHands(cards);
  const strengthAssessment = getStrengthLabel(baseStrength);

  return {
    strength: strengthAssessment,
    possibleHands
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

  if (isPair) {
    possibleHands.push({
      name: 'Four of a Kind',
      probability: 0.2,
      description: `Need two more ${rank1}'s`,
      requiredCards: [`${rank1}♠`, `${rank1}♥`, `${rank1}♦`, `${rank1}♣`].filter(c => !cards.includes(c))
    });

    possibleHands.push({
      name: 'Full House',
      probability: 2.5,
      description: 'Need three of any other rank',
      requiredCards: []
    });
  }

  if (isSuited) {
    possibleHands.push({
      name: 'Flush',
      probability: 6.5,
      description: `Need three more ${suit1} cards`,
      requiredCards: []
    });

    const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    const rank1Index = ranks.indexOf(rank1);
    const rank2Index = ranks.indexOf(rank2);
    const distance = Math.abs(rank1Index - rank2Index);
    
    if (distance <= 4) {
      possibleHands.push({
        name: 'Straight Flush',
        probability: 0.3,
        description: 'Need three consecutive suited cards',
        requiredCards: []
      });
    }
  }

  // Check for straight potential
  const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
  const rank1Index = ranks.indexOf(rank1);
  const rank2Index = ranks.indexOf(rank2);
  const distance = Math.abs(rank1Index - rank2Index);
  
  if (distance <= 4) {
    possibleHands.push({
      name: 'Straight',
      probability: 5.0,
      description: 'Need three connecting cards',
      requiredCards: []
    });
  }

  // Always possible hands
  possibleHands.push({
    name: 'Three of a Kind',
    probability: isPair ? 12.0 : 2.0,
    description: isPair ? 'Need one more matching card' : 'Need two matching cards',
    requiredCards: []
  });

  possibleHands.push({
    name: 'Two Pair',
    probability: isPair ? 4.0 : 3.5,
    description: isPair ? 'Need another pair' : 'Need matching cards for both',
    requiredCards: []
  });

  possibleHands.push({
    name: 'One Pair',
    probability: isPair ? 100 : 25.0,
    description: isPair ? 'Already have a pair' : 'Need one matching card',
    requiredCards: []
  });

  // Sort by probability
  return possibleHands.sort((a, b) => b.probability - a.probability);
}