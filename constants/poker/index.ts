/**
 * Poker-related constants
 */

// Generate the hand strengths once and export as a constant
import { generateHandStrengths } from "./hand-strengths";

export const HAND_STRENGTHS = generateHandStrengths();
