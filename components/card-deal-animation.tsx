/** biome-ignore-all lint/style/noMagicNumbers: <explanation> */
"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { RANKS, SUITS } from "@/constants/poker/ranks-suits";
import { AnimatedPokerCard } from "./animated-poker-card";

export const CardDealAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) {
      return;
    }

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

    // Set initial stacked state
    gsap.set(cards, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 0.8,
      opacity: 0,
    });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Deal animation with stagger
    for (let index = 0; index < cards.length; index++) {
      const card = cards[index];
      if (!card) {
        continue;
      }
      tl.to(
        card,
        {
          x: (index - 2) * 60,
          y: -20,
          rotation: (index - 2) * 5,
          scale: 1,
          opacity: 1,
          duration: 0.5,
        },
        index * 0.1
      );
    }

    // Hold cards visible for a moment
    tl.to({}, { duration: 3 });

    // Collect animation (return to stack)
    tl.to(cards, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.in",
    });

    // Brief pause before repeating
    tl.to({}, { duration: 1 });

    // Deal again
    for (let index = 0; index < cards.length; index++) {
      const card = cards[index];
      if (!card) {
        continue;
      }
      tl.to(
        card,
        {
          x: (index - 2) * 60,
          y: -20,
          rotation: (index - 2) * 5,
          scale: 1,
          opacity: 1,
          duration: 0.5,
        },
        index * 0.1
      );
    }

    tl.repeat(-1).repeatDelay(0.5);

    // Hover interaction
    const cleanups: Array<() => void> = [];
    for (const card of cards) {
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -40,
          scale: 1.1,
          duration: 0.2,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          y: -20,
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      };

      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);

      cleanups.push(() => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    }

    return () => {
      tl.kill();
      for (const fn of cleanups) {
        fn();
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-20 left-4 z-40 flex h-32 w-64 items-center justify-center"
      ref={containerRef}
    >
      {SUITS.slice(0, 5).map((suit, index) => (
        <div
          className="absolute"
          key={`${suit}-${RANKS[index]}`}
          ref={(el) => {
            cardsRef.current[index] = el;
          }}
        >
          <AnimatedPokerCard
            className="h-20 w-16"
            floatDuration={2}
            rank={RANKS[index]}
            rotationSpeed={0}
            suit={suit}
          />
        </div>
      ))}
    </div>
  );
};
