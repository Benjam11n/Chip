import { Dices, Plus, Users } from "lucide-react";

export const RANKS = [
    'A',
    'K',
    'Q',
    'J',
    'T',
    '9',
    '8',
    '7',
    '6',
    '5',
    '4',
    '3',
    '2',
];

export const SUITS = ['♠', '♥', '♦', '♣'];

export const SUIT_COLORS = {
  '♠': 'text-foreground',
  '♥': 'text-red-500',
  '♦': 'text-red-500',
  '♣': 'text-foreground',
};

export const HAND_STRENGTHS = {
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
  "TT": {
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
  "ATs": {
      "category": "Normal",
      "value": 2
  },
  "ATo": {
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
  "KTs": {
      "category": "Normal",
      "value": 2
  },
  "KTo": {
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
  "QTs": {
      "category": "Normal",
      "value": 2
  },
  "QTo": {
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
  "JTs": {
      "category": "Strong",
      "value": 3
  },
  "JTo": {
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
  "T9s": {
      "category": "Strong",
      "value": 3
  },
  "T9o": {
      "category": "Normal",
      "value": 2
  },
  "T8s": {
      "category": "Normal",
      "value": 2
  },
  "T8o": {
      "category": "Weak",
      "value": 1
  },
  "T7s": {
      "category": "Normal",
      "value": 2
  },
  "T7o": {
      "category": "Weak",
      "value": 1
  },
  "T6s": {
      "category": "Normal",
      "value": 2
  },
  "T6o": {
      "category": "Weak",
      "value": 1
  },
  "T5s": {
      "category": "Normal",
      "value": 2
  },
  "T5o": {
      "category": "Weak",
      "value": 1
  },
  "T4s": {
      "category": "Normal",
      "value": 2
  },
  "T4o": {
      "category": "Weak",
      "value": 1
  },
  "T3s": {
      "category": "Normal",
      "value": 2
  },
  "T3o": {
      "category": "Weak",
      "value": 1
  },
  "T2s": {
      "category": "Normal",
      "value": 2
  },
  "T2o": {
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

export const FEATURES = [
    {
      icon: Users,
      title: 'Automatic Bank',
      description:
        "Keep track of everyone's stack with automatic pot calculations and buy-in management.",
    },
    {
      icon: Dices,
      title: 'Hand Guide',
      description:
        'Quick reference for poker hand rankings and starting hand strengths.',
    },
    {
      icon: Plus,
      title: 'Quick Setup',
      description:
        'Start your game in seconds - just create a room and share the code.',
    },
  ];