/* eslint-disable react-hooks/static-components */
"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Dices, Plus, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FEATURES } from "@/constants/ui";
import { ROUTES } from "@/lib/routes";

// todo: move to constants
const ROTATION_MS = 3000;

const Home = () => {
  const router = useRouter();
  const rotatingBgRef = useRef<HTMLDivElement>(null);
  const featuresTitleRef = useRef<HTMLHeadingElement>(null);
  const featuresGridRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Rotating gradient animation
  useGSAP(() => {
    if (!rotatingBgRef.current) {
      return;
    }

    const MS_PER_SECOND = 1000;

    gsap.to(rotatingBgRef.current, {
      rotation: 360,
      duration: ROTATION_MS / MS_PER_SECOND,
      repeat: -1,
      ease: "none",
      onUpdate() {
        const rotation = gsap.getProperty(rotatingBgRef.current, "rotation");
        if (rotatingBgRef.current) {
          rotatingBgRef.current.style.background = `conic-gradient(from ${rotation}deg, #8B0000, #FFD700, #2C3E50, #C41E3A, #8B0000)`;
        }
      },
    });
  }, []);

  // Features section entrance animations
  useGSAP(() => {
    // Title animation
    if (featuresTitleRef.current) {
      gsap.fromTo(
        featuresTitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }

    // Grid animation
    if (featuresGridRef.current) {
      gsap.fromTo(
        featuresGridRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power2.out" }
      );
    }

    // Staggered feature cards
    if (featureCardsRef.current.length > 0) {
      gsap.fromTo(
        featureCardsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.2,
          ease: "power2.out",
        }
      );
    }
  }, []);

  // Card hover effects
  useEffect(() => {
    const validCards = featureCardsRef.current.filter(Boolean);
    const validIcons = iconRefs.current.filter(Boolean);

    const handleCardMouseEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const index = featureCardsRef.current.indexOf(target as HTMLDivElement);
      const icon = validIcons[index];

      gsap.to(target, { y: -5, duration: 0.2, ease: "power2.out" });
      if (icon) {
        gsap.to(icon, {
          scale: 1.07,
          rotation: 360,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      }
    };

    const handleCardMouseLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const index = featureCardsRef.current.indexOf(target as HTMLDivElement);
      const icon = validIcons[index];

      gsap.to(target, { y: 0, duration: 0.2, ease: "power2.out" });
      if (icon) {
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    for (const card of validCards) {
      if (card) {
        card.addEventListener("mouseenter", handleCardMouseEnter);
        card.addEventListener("mouseleave", handleCardMouseLeave);
      }
    }

    return () => {
      for (const card of validCards) {
        if (card) {
          card.removeEventListener("mouseenter", handleCardMouseEnter);
          card.removeEventListener("mouseleave", handleCardMouseLeave);
        }
      }
    };
  }, []);

  // Button hover effects
  useEffect(() => {
    const buttonElements = buttonRefs.current.filter(Boolean);

    const handleMouseEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      gsap.to(target, { scale: 1.03, duration: 0.2, ease: "power2.out" });
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      gsap.to(target, { scale: 1, duration: 0.2, ease: "power2.out" });
    };

    const handleMouseDown = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      gsap.to(target, { scale: 0.97, duration: 0.1, ease: "power2.out" });
    };

    const handleMouseUp = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      gsap.to(target, { scale: 1.03, duration: 0.1, ease: "power2.out" });
    };

    for (const button of buttonElements) {
      button?.addEventListener("mouseenter", handleMouseEnter);
      button?.addEventListener("mouseleave", handleMouseLeave);
      button?.addEventListener("mousedown", handleMouseDown);
      button?.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      for (const button of buttonElements) {
        button?.removeEventListener("mouseenter", handleMouseEnter);
        button?.removeEventListener("mouseleave", handleMouseLeave);
        button?.removeEventListener("mousedown", handleMouseDown);
        button?.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, []);

  return (
    <div className="mt-20 flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="relative flex min-h-[400px] flex-1 items-center justify-center py-16">
        {/* Decorative cards */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="-rotate-12 absolute top-1/4 left-[10%]">
            <Card className="h-48 w-32 rounded-lg border-4 border-muted-foreground bg-muted shadow-xl lg:h-72 lg:w-48" />
          </div>
          <div className="absolute top-1/3 right-[15%] rotate-12">
            <Card className="h-48 w-32 rounded-lg border-4 border-muted-foreground bg-primary shadow-xl lg:h-72 lg:w-48" />
          </div>
        </div>

        {/* Main content */}
        <div className="relative flex flex-col items-center px-4 text-foreground">
          <div className="mb-8 flex items-center gap-4">
            <Dices className="size-16 text-primary" />
            <h1 className="font-bold text-5xl md:text-6xl">Chip</h1>
          </div>
          <p className="mb-12 max-w-2xl px-6 text-center text-muted-foreground text-xl md:text-2xl">
            Play poker anywhere - leave the chips at home
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1 sm:w-48">
              <Button
                className="relative w-full px-8"
                onClick={() => router.push(ROUTES.CREATE)}
                ref={(el) => {
                  buttonRefs.current[0] = el;
                }}
                size="lg"
              >
                <Plus className="mr-2 size-5" />
                Create Game
              </Button>
            </div>
            <div className="relative flex-1 sm:w-48">
              <Button
                className="relative z-10 w-full px-8"
                onClick={() => router.push(ROUTES.JOIN)}
                ref={(el) => {
                  buttonRefs.current[1] = el;
                }}
                size="lg"
                variant="outline"
              >
                <PlusCircle className="mr-2 size-5" />
                Join Game
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h2
          className="mb-12 text-center font-bold text-3xl text-foreground"
          ref={featuresTitleRef}
        >
          Features
        </h2>
        <div
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
          ref={featuresGridRef}
        >
          {FEATURES.map((feature, index) => (
            <div
              className="h-full"
              key={feature.title}
              ref={(el) => {
                featureCardsRef.current[index] = el;
              }}
            >
              <Card className="flex h-full flex-col p-6">
                <div
                  className="mb-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10"
                  ref={(el) => {
                    iconRefs.current[index] = el;
                  }}
                >
                  <feature.icon className="size-6 text-primary" />
                </div>
                <h3 className="mb-2 font-bold text-xl">{feature.title}</h3>
                <p className="grow text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
