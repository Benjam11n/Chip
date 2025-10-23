/**
 * Programmatically generates poker hand strength data
 * This replaces the massive hardcoded HAND_STRENGTHS object
 */

type HandStrengthData = {
  category: string;
  value: number;
};

const HAND_CATEGORIES = {
  FOLD: { category: "Fold", value: 0 },
  WEAK: { category: "Weak", value: 1 },
  NORMAL: { category: "Normal", value: 2 },
  STRONG: { category: "Strong", value: 3 },
  EXTREMELY_STRONG: { category: "Extremely Strong", value: 4 },
} as const;

const NUMBER_OF_RANKS = 13;
/**
 * Generate hand strengths for all possible starting hands
 */
export function generateHandStrengths(): Record<string, HandStrengthData> {
  const strengths: Record<string, HandStrengthData> = {};

  // Pocket pairs
  for (let i = 0; i < NUMBER_OF_RANKS; i++) {
    const rank = RANKS[i];
    const hand = `${rank}${rank}`;

    if (["AA", "KK", "QQ"].includes(hand)) {
      strengths[hand] = HAND_CATEGORIES.EXTREMELY_STRONG;
    } else if (hand === "JJ") {
      strengths[hand] = HAND_CATEGORIES.STRONG;
    } else if (["77", "88", "99"].includes(hand)) {
      strengths[hand] = HAND_CATEGORIES.NORMAL;
    } else if (["44", "55", "66"].includes(hand)) {
      strengths[hand] = HAND_CATEGORIES.WEAK;
    } else {
      strengths[hand] = HAND_CATEGORIES.FOLD;
    }
  }

  // Suited cards (AKs, AQs, etc.)
  const premiumSuited = ["AK", "AQ", "AJ", "KQ"];
  const strongSuited = ["KJ", "KT", "QJ", "QT", "JT"];
  const normalSuited = [
    "AT",
    "A9",
    "A8",
    "A7",
    "A6",
    "A5",
    "A3",
    "A2",
    "K9",
    "K8",
    "K7",
    "K6",
    "K5",
    "K4",
    "K3",
    "K2",
    "Q9",
    "Q8",
    "Q7",
    "Q6",
    "Q5",
    "Q4",
    "Q3",
    "Q2",
    "J9",
    "J8",
    "J7",
    "J6",
    "J5",
    "J4",
    "J3",
    "J2",
    "T9",
    "T8",
    "T7",
    "T6",
    "T5",
    "T4",
    "T3",
    "T2",
    "98",
    "87",
    "76",
    "65",
  ];
  const weakSuited = ["A4", "97", "86", "75", "64", "54", "43", "32"];
  const foldSuited = ["96", "85", "74", "63", "52", "42"];

  // Offsuit cards (AKo, AQo, etc.)
  const premiumOffsuit = ["AK"];
  const strongOffsuit = ["AQ", "KQ", "KJ"];
  const normalOffsuit = [
    "AJ",
    "AT",
    "A9",
    "A8",
    "A7",
    "A6",
    "A5",
    "KT",
    "KTo",
    "QT",
    "QTo",
    "JT",
    "JTo",
    "T9",
    "T8",
    "T7",
    "T6",
    "T5",
    "T4",
    "T3",
    "T2",
    "98",
    "87",
  ];
  const weakOffsuit = [
    "A4",
    "A3",
    "A2",
    "K9",
    "K8",
    "K7",
    "K6",
    "K5",
    "K4",
    "K3",
    "K2",
    "Q9",
    "Q8",
    "Q7",
    "Q6",
    "Q5",
    "Q4",
    "Q3",
    "Q2",
    "J9",
    "J8",
    "J7",
    "J6",
    "J5",
    "J4",
    "J3",
    "J2",
    "97",
    "86",
    "76",
    "65",
    "54",
    "43",
    "32",
  ];
  const foldOffsuit = ["96", "85", "74", "63", "52", "42"];

  // Generate suited combinations
  for (const hand of premiumSuited) {
    strengths[`${hand}s`] = HAND_CATEGORIES.EXTREMELY_STRONG;
  }

  for (const hand of strongSuited) {
    strengths[`${hand}s`] = HAND_CATEGORIES.STRONG;
  }

  for (const hand of normalSuited) {
    strengths[`${hand}s`] = HAND_CATEGORIES.NORMAL;
  }

  for (const hand of weakSuited) {
    strengths[`${hand}s`] = HAND_CATEGORIES.WEAK;
  }

  for (const hand of foldSuited) {
    strengths[`${hand}s`] = HAND_CATEGORIES.FOLD;
  }

  // Generate offsuit combinations
  for (const hand of premiumOffsuit) {
    strengths[`${hand}o`] = HAND_CATEGORIES.STRONG;
  }

  for (const hand of strongOffsuit) {
    strengths[`${hand}o`] = HAND_CATEGORIES.STRONG;
  }

  for (const hand of normalOffsuit) {
    strengths[`${hand}o`] = HAND_CATEGORIES.NORMAL;
  }

  for (const hand of weakOffsuit) {
    strengths[`${hand}o`] = HAND_CATEGORIES.WEAK;
  }

  for (const hand of foldOffsuit) {
    strengths[`${hand}o`] = HAND_CATEGORIES.FOLD;
  }

  return strengths;
}

// Import ranks from the ranks file
import { RANKS } from "./ranks-suits";
