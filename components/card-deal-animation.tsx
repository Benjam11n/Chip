"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { AnimatedPokerCard } from "./animated-poker-card";
import { SUITS, RANKS } from "@/constants/poker/ranks-suits";

export const CardDealAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Create a deck of cards to deal
    const deck = [];
    for (let i = 0; i < 5; i++) {
      deck.push({
        suit: SUITS[i % SUITS.length],
        rank: RANKS[i % RANKS.length],
      });
    }

    // Deal animation
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      // Initial position: stacked in center
      gsap.set(card, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 0.8,
        opacity: 0,
      });

      // Deal animation with stagger
      gsap.to(card, {
        x: (index - 2) * 60, // Spread cards horizontally
        y: -20,
        rotation: (index - 2) * 5,
        scale: 1,
        opacity: 1,
        duration: 0.5,
        delay: index * 0.1,
        ease: "power2.out",
      });

      // Hover effect for each card
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

      return () => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    });

    // Collect animation after delay
    const timer = setTimeout(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.to(card, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 0.8,
          opacity: 0,
          duration: 0.3,
          delay: index * 0.05,
          ease: "power2.in",
          onComplete: () => {
            // Restart the animation
            setTimeout(() => {
              if (card && containerRef.current) {
                gsap.to(card, {
                  x: (index - 2) * 60,
                  y: -20,
                  rotation: (index - 2) * 5,
                  scale: 1,
                  opacity: 1,
                  duration: 0.5,
                  ease: "power2.out",
                });
              }
            }, 1000);
          },
        });
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-20 left-4 flex items-center justify-center w-64 h-32 z-40"
      aria-hidden="true"
    >
      {SUITS.slice(0, 5).map((suit, index) => (
        <div
          key={index}
          ref={(el) => {
            cardsRef.current[index] = el;
          }}
          className="absolute"
        >
          <AnimatedPokerCard
            suit={suit}
            rank={RANKS[index]}
            floatDuration={2}
            rotationSpeed={0}
            className="h-20 w-16"
          />
        </div>
      ))}
    </div>
  );
};