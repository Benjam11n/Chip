"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef, useState } from "react";
import { Circle } from "lucide-react";

export const PokerChipCounter = () => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<SVGSVGElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!counterRef.current) return;

    // Animate chip icon
    if (chipRef.current) {
      gsap.to(chipRef.current, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: "none",
      });

      // Bounce effect
      gsap.to(chipRef.current, {
        y: -5,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Count up animation
    const targetCount = 10000;
    const duration = 2;
    const increment = targetCount / (duration * 60); // 60 fps

    let currentCount = 0;
    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= targetCount) {
        currentCount = targetCount;
        clearInterval(timer);
      }
      setCount(Math.floor(currentCount));
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, []);

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div
      ref={counterRef}
      className="fixed bottom-4 right-4 flex items-center gap-2 bg-card border rounded-full px-4 py-2 shadow-lg z-50"
    >
      <Circle
        ref={chipRef}
        className="size-6 text-primary fill-primary"
      />
      <span
        ref={numberRef}
        className="font-mono font-bold text-foreground"
      >
        ${formatNumber(count)}
      </span>
    </div>
  );
};