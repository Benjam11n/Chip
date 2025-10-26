/* eslint-disable react-hooks/static-components */
"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { AnimatedPokerCard } from "@/components/animated-poker-card";
import { CardDealAnimation } from "@/components/card-deal-animation";
import { FloatingParticles } from "@/components/floating-particles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FEATURES } from "@/constants/ui";
import { ROUTES } from "@/lib/routes";
import "@/styles/animations.css";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// todo: move to constants
const ROTATION_MS = 3000;

const Home = () => {
  const router = useRouter();
  const rotatingBgRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);
  // removed unused refs: dicesIconRef, iconRefs, buttonRefs
  const featuresTitleRef = useRef<HTMLHeadingElement>(null);
  const featuresGridRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const decorativeCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  // Animation constants
  const DEFAULT_EASE = "power2.out";
  const TITLE_DURATION = 0.6;
  const SUBTITLE_DURATION = 0.6;
  const BUTTONS_DURATION = 0.5;
  const BUTTONS_STAGGER = 0.2;
  const DECORATIVE_FINAL_OPACITY = 0.4;
  const DECORATIVE_START_ROTATION = -180;
  const DECORATIVE_ROT_LEFT = -12;
  const DECORATIVE_ROT_RIGHT = 12;
  const DECORATIVE_DURATION = 1;
  const DECORATIVE_STAGGER = 0.3;
  const PARALLAX_BASE = -50;
  const BUTTON_PRIMARY_CLASSES =
    "group relative w-full overflow-hidden px-8 transition-transform duration-200 hover:scale-105 active:scale-95";
  const BUTTON_OUTLINE_CLASSES =
    "group relative z-10 w-full overflow-hidden px-8 transition-transform duration-200 hover:scale-105 active:scale-95";
  const FEATURE_CARD_CLASSES =
    "flex h-full flex-col p-6 transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg";

  // Hero section entrance animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: DEFAULT_EASE } });

    if (heroTitleRef.current) {
      tl.from(heroTitleRef.current, { opacity: 0, y: 20, duration: TITLE_DURATION });
    }

    if (heroSubtitleRef.current) {
      tl.from(heroSubtitleRef.current, { opacity: 0, y: 20, duration: SUBTITLE_DURATION });
    }

    if (heroButtonsRef.current) {
      tl.from(heroButtonsRef.current.children, {
        opacity: 0,
        y: 30,
        duration: BUTTONS_DURATION,
        stagger: BUTTONS_STAGGER,
      });
    }

    // Decorative cards entrance
    if (decorativeCardsRef.current.length > 0) {
      tl.fromTo(
        decorativeCardsRef.current,
        { opacity: 0, scale: 0, rotation: DECORATIVE_START_ROTATION },
        {
          opacity: DECORATIVE_FINAL_OPACITY,
          scale: 1,
          rotation: (index: number) => (index === 0 ? DECORATIVE_ROT_LEFT : DECORATIVE_ROT_RIGHT),
          duration: DECORATIVE_DURATION,
          stagger: DECORATIVE_STAGGER,
        }
      );
    }

    // Parallax effect for decorative cards on scroll, scoped to hero section
    decorativeCardsRef.current.forEach((card, index) => {
      if (card && heroSectionRef.current) {
        gsap.to(card, {
          yPercent: PARALLAX_BASE * (index + 1),
          ease: "none",
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: "top center",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    });
  }, []);

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

  // Features section scroll-triggered animations
  useGSAP(() => {
    // Title animation with ScrollTrigger
    if (featuresTitleRef.current) {
      gsap.fromTo(
        featuresTitleRef.current,
        { opacity: 0, y: 50, rotationX: -15 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresTitleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Grid animation with ScrollTrigger
    if (featuresGridRef.current) {
      gsap.fromTo(
        featuresGridRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresGridRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Staggered feature cards with rotation
    if (featureCardsRef.current.length > 0) {
      gsap.fromTo(
        featureCardsRef.current,
        {
          opacity: 0,
          y: 60,
          rotationY: -15,
          transformPerspective: 1000,
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: featuresGridRef.current,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  // Enhanced card hover effects with 3D transforms
  // Using CSS transitions for hover interactions on cards; GSAP hover removed

  // Enhanced button hover effects with ripple
  // Using CSS transitions for hover interactions on buttons; ripple removed

  return (
    <div className="gpu-accelerated relative mt-20 flex min-h-screen flex-col">
      {/* Floating particles background */}
      <FloatingParticles />

      {/* Card deal animation */}
      <CardDealAnimation />

      {/* Hero Section */}
      <div className="relative flex min-h-[400px] flex-1 items-center justify-center overflow-hidden py-16" ref={heroSectionRef}>
        {/* Decorative animated cards */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-[10%] lg:top-1/4 lg:left-[15%]"
            ref={(el) => {
              decorativeCardsRef.current[0] = el;
            }}
          >
            <AnimatedPokerCard
              className="h-32 w-24 lg:h-72 lg:w-48"
              floatDuration={4}
              isDecorative={true}
              rank="K"
              rotationSpeed={-15}
              suit="♠"
            />
          </div>
          <div
            className="absolute top-1/3 right-[10%] lg:top-1/3 lg:right-[15%]"
            ref={(el) => {
              decorativeCardsRef.current[1] = el;
            }}
          >
            <AnimatedPokerCard
              className="h-32 w-24 lg:h-72 lg:w-48"
              floatDuration={3.5}
              isDecorative={true}
              rank="A"
              rotationSpeed={15}
              suit="♥"
            />
          </div>
          <div
            className="absolute bottom-1/4 left-[20%] lg:bottom-1/4 lg:left-[25%]"
            ref={(el) => {
              decorativeCardsRef.current[2] = el;
            }}
          >
            <AnimatedPokerCard
              className="h-24 w-20 lg:h-56 lg:w-40"
              floatDuration={4.5}
              isDecorative={true}
              rank="Q"
              rotationSpeed={-10}
              suit="♦"
            />
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center px-4 text-foreground">
          <div className="mb-8 flex items-center gap-4">
            <Image alt="Chip Logo" height={70} src="/logo.png" width={70} />
            <h1 className="font-bold text-5xl md:text-6xl" ref={heroTitleRef}>
              Chip
            </h1>
          </div>
          <p
            className="mb-12 max-w-2xl px-6 text-center text-muted-foreground text-xl md:text-2xl"
            ref={heroSubtitleRef}
          >
            Play poker anywhere - leave the chips at home
          </p>

          <div className="flex flex-col gap-4 sm:flex-row" ref={heroButtonsRef}>
            <div className="relative flex-1 sm:w-48">
              <Button
                className={BUTTON_PRIMARY_CLASSES}
                onClick={() => router.push(ROUTES.CREATE)}
                size="lg"
              >
                <Plus className="mr-2 size-5 transition-transform duration-200 group-hover:rotate-90" />
                Create Game
              </Button>
            </div>
            <div className="relative flex-1 sm:w-48">
              <Button
                className={BUTTON_OUTLINE_CLASSES}
                onClick={() => router.push(ROUTES.JOIN)}
                size="lg"
                variant="outline"
              >
                <PlusCircle className="mr-2 size-5 transition-transform duration-200 group-hover:scale-110" />
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
              <Card className={FEATURE_CARD_CLASSES}>
                <div
                  className="mb-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10"
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
