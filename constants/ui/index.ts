/**
 * UI-related constants
 */

import { Dices, Plus, Users } from "lucide-react";

export const HAND_STRENGTH_PROGRESS_MULTIPLIER = 25;

export const FEATURES = [
  {
    icon: Users,
    title: "Automatic Bank",
    description:
      "Keep track of everyone's stack with automatic pot calculations and buy-in management.",
  },
  {
    icon: Dices,
    title: "Hand Guide",
    description:
      "Quick reference for poker hand rankings and starting hand strengths.",
  },
  {
    icon: Plus,
    title: "Quick Setup",
    description:
      "Start your game in seconds - just create a room and share the code.",
  },
] as const;
