/**
 * Poker-related constants
 */

export { RANKS, SUIT_COLORS, SUITS } from "./ranks-suits";

// Generate the hand strengths once and export as a constant
import { generateHandStrengths } from "./hand-strengths";

export const HAND_STRENGTHS = generateHandStrengths();
