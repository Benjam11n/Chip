/** biome-ignore-all lint/style/noMagicNumbers: <explanation> */
"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { SUITS } from "@/constants/poker/ranks-suits";

export const FloatingParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) {
      return;
    }

    // Create particles if they don't exist
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 16; i++) {
         const particle = document.createElement("div");
         particle.className = "particle";

         // Random suit and position
         const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
         const x = Math.random() * 100;
         const delay = Math.random() * 10;
         const duration = 10 + Math.random() * 5;

         particle.style.left = `${x}%`;
         particle.style.animationDelay = `${delay}s`;
         particle.style.animationDuration = `${duration}s`;
         particle.style.fontSize = `${Math.random() * 20 + 15}px`;

         // Set suit symbol with color
         const isRed = suit === "♥" || suit === "♦";
         particle.style.color = isRed ? "#ef4444" : "#000000";
         particle.style.opacity = "0.1";
         particle.innerText = suit ?? "♥";

         containerRef.current.appendChild(particle);
         particlesRef.current.push(particle);
       }
    }

    // Animate particles
    particlesRef.current.forEach((particle, index) => {
      if (!particle) {
        return;
      }

      // Subtle floating animation
      gsap.to(particle, {
        y: -20,
        duration: 3 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.2,
      });

      // Slight horizontal drift
      gsap.to(particle, {
        x: index % 2 === 0 ? 10 : -10,
        duration: 4 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.3,
      });

      // Gentle rotation
      gsap.to(particle, {
        rotation: index % 2 === 0 ? 360 : -360,
        duration: 20 + index * 2,
        repeat: -1,
        ease: "none",
      });
    });

    // Breathing effect for container
    gsap.to(containerRef.current, {
      opacity: 0.3,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      ref={containerRef}
    />
  );
};
