"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SUITS, SUIT_COLORS } from "@/constants/poker/ranks-suits";

interface AnimatedPokerCardProps {
  suit?: typeof SUITS[number];
  rank?: string;
  isDecorative?: boolean;
  className?: string;
  floatDuration?: number;
  rotationSpeed?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const AnimatedPokerCard = ({
  suit = "♠",
  rank = "A",
  isDecorative = false,
  className,
  floatDuration = 3,
  rotationSpeed = 20,
  onMouseEnter,
  onMouseLeave,
}: AnimatedPokerCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current || !cardInnerRef.current) return;

    // Floating animation
    gsap.to(cardRef.current, {
      y: -10,
      duration: floatDuration,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Subtle rotation
    gsap.to(cardRef.current, {
      rotation: rotationSpeed,
      duration: floatDuration * 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Card flip on hover
    const handleMouseEnter = () => {
      gsap.to(cardInnerRef.current, {
        rotationY: 180,
        duration: 0.6,
        ease: "power2.inOut",
      });
      onMouseEnter?.();
    };

    const handleMouseLeave = () => {
      gsap.to(cardInnerRef.current, {
        rotationY: 0,
        duration: 0.6,
        ease: "power2.inOut",
      });
      onMouseLeave?.();
    };

    const card = cardRef.current;
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [floatDuration, rotationSpeed, onMouseEnter, onMouseLeave]);

  // 3D tilt effect based on mouse position
  useGSAP(() => {
    if (!cardRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cardRef.current, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
    };

    const card = cardRef.current;
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative preserve-3d",
        isDecorative && "opacity-10 dark:opacity-20",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <div
        ref={cardInnerRef}
        className="relative w-full h-full transition-transform duration-600"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Card Front */}
        <div
          ref={cardFrontRef}
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <Card
            className={cn(
              "flex h-full w-full items-center justify-center rounded-lg border-4 shadow-xl",
              isDecorative ? "border-muted-foreground bg-muted" : "border-primary bg-card"
            )}
          >
            <div className="text-center">
              <div className={cn("text-6xl font-bold", SUIT_COLORS[suit])}>
                {rank}
              </div>
              <div className={cn("text-4xl", SUIT_COLORS[suit])}>
                {suit}
              </div>
            </div>
          </Card>
        </div>

        {/* Card Back */}
        <div
          ref={cardBackRef}
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Card className="flex h-full w-full items-center justify-center rounded-lg border-4 border-primary bg-primary shadow-xl">
            <div className="text-center">
              <div className="grid grid-cols-2 gap-1">
                {SUITS.map((s) => (
                  <div
                    key={s}
                    className={cn("text-2xl font-bold", SUIT_COLORS[s])}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-primary-foreground text-sm font-semibold">
                Chip Poker
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};