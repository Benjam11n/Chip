/* eslint-disable react-hooks/static-components */
"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { AnimatedPokerCard } from "@/components/animated-poker-card";
import { CardDealAnimation } from "@/components/card-deal-animation";
import { FloatingParticles } from "@/components/floating-particles";
import { PokerChipCounter } from "@/components/poker-chip-counter";
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
  const dicesIconRef = useRef<SVGSVGElement>(null);
  const featuresTitleRef = useRef<HTMLHeadingElement>(null);
  const featuresGridRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const decorativeCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Hero section entrance animations
  useGSAP(() => {
    // Staggered text reveal for title
    if (heroTitleRef.current) {
      const title = heroTitleRef.current;
      const text = title.innerText;
      title.innerHTML = "";

      text.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.innerText = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "rotateY(90deg) translateZ(50px)";
        title.appendChild(span);

        gsap.to(span, {
          opacity: 1,
          rotationY: 0,
          z: 0,
          duration: 0.5,
          delay: index * 0.05,
          ease: "back.out(1.7)",
        });
      });
    }

    // Dices icon animation
    if (dicesIconRef.current) {
      gsap.fromTo(
        dicesIconRef.current,
        { rotation: -180, scale: 0 },
        {
          rotation: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "elastic.out(1, 0.5)",
        }
      );

      // Subtle wobble after initial animation
      gsap.to(dicesIconRef.current, {
        rotation: 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });
    }

    // Subtitle fade in
    if (heroSubtitleRef.current) {
      gsap.fromTo(
        heroSubtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: "power2.out" }
      );
    }

    // Buttons slide up with stagger
    if (heroButtonsRef.current) {
      const buttons = heroButtonsRef.current.children;
      gsap.fromTo(
        buttons,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.2,
          delay: 0.8,
          ease: "power2.out",
        }
      );
    }

    // Decorative cards entrance
    if (decorativeCardsRef.current.length > 0) {
      gsap.fromTo(
        decorativeCardsRef.current,
        { opacity: 0, scale: 0, rotation: -180 },
        {
          opacity: 0.1,
          scale: 1,
          rotation: (index) => (index === 0 ? -12 : 12),
          duration: 1,
          stagger: 0.3,
          delay: 1,
          ease: "back.out(1.7)",
        }
      );
    }

    // Parallax effect for decorative cards on scroll
    decorativeCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.to(card, {
          yPercent: -50 * (index + 1),
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
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
  useEffect(() => {
    const validCards = featureCardsRef.current.filter(Boolean);
    const validIcons = iconRefs.current.filter(Boolean);

    const handleCardMouseEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const index = featureCardsRef.current.indexOf(target as HTMLDivElement);
      const icon = validIcons[index];

      // 3D lift and rotation effect
      gsap.to(target, {
        y: -10,
        rotationY: 5,
        rotationX: -5,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 1000,
      });

      // Icon animation
      if (icon) {
        gsap.to(icon, {
          scale: 1.15,
          rotation: 360,
          duration: 0.5,
          ease: "back.out(1.7)",
        });
      }

      // Add glow effect
      gsap.to(target, {
        boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
        duration: 0.3,
      });
    };

    const handleCardMouseLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const index = featureCardsRef.current.indexOf(target as HTMLDivElement);
      const icon = validIcons[index];

      gsap.to(target, {
        y: 0,
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      if (icon) {
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      // Remove glow
      gsap.to(target, {
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
      });
    };

    const handleCardMouseMove = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 5;
      const rotateX = ((centerY - y) / centerY) * 5;

      gsap.to(target, {
        rotationY: rotateY,
        rotationX: rotateX,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    for (const card of validCards) {
      if (card) {
        card.style.transformStyle = "preserve-3d";
        (card as any).style.transformPerspective = "1000px";
        card.addEventListener("mouseenter", handleCardMouseEnter);
        card.addEventListener("mouseleave", handleCardMouseLeave);
        card.addEventListener(
          "mousemove",
          handleCardMouseMove as EventListener
        );
      }
    }

    return () => {
      for (const card of validCards) {
        if (card) {
          card.removeEventListener("mouseenter", handleCardMouseEnter);
          card.removeEventListener("mouseleave", handleCardMouseLeave);
          card.removeEventListener(
            "mousemove",
            handleCardMouseMove as EventListener
          );
        }
      }
    };
  }, []);

  // Enhanced button hover effects with ripple
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

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement("span");

      // Create ripple element
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = "20px";
      ripple.style.left = `${e.clientX - rect.left - 10}px`;
      ripple.style.top = `${e.clientY - rect.top - 10}px`;

      target.appendChild(ripple);

      // Animate button press
      gsap.to(target, { scale: 0.97, duration: 0.1, ease: "power2.out" });

      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    const handleMouseUp = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      gsap.to(target, { scale: 1.03, duration: 0.1, ease: "power2.out" });
    };

    for (const button of buttonElements) {
      if (button) {
        button.style.position = "relative";
        button.style.overflow = "hidden";
        button.addEventListener("mouseenter", handleMouseEnter);
        button.addEventListener("mouseleave", handleMouseLeave);
        button.addEventListener("mousedown", handleMouseDown as EventListener);
        button.addEventListener("mouseup", handleMouseUp);
      }
    }

    return () => {
      for (const button of buttonElements) {
        if (button) {
          button.removeEventListener("mouseenter", handleMouseEnter);
          button.removeEventListener("mouseleave", handleMouseLeave);
          button.removeEventListener(
            "mousedown",
            handleMouseDown as EventListener
          );
          button.removeEventListener("mouseup", handleMouseUp);
        }
      }
    };
  }, []);

  return (
    <div className="gpu-accelerated relative mt-20 flex min-h-screen flex-col">
      {/* Floating particles background */}
      <FloatingParticles />

      {/* Poker chip counter */}
      <PokerChipCounter />

      {/* Card deal animation */}
      <CardDealAnimation />

      {/* Hero Section */}
      <div className="relative flex min-h-[400px] flex-1 items-center justify-center overflow-hidden py-16">
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
                className="group relative w-full overflow-hidden px-8"
                onClick={() => router.push(ROUTES.CREATE)}
                ref={(el) => {
                  buttonRefs.current[0] = el;
                }}
                size="lg"
              >
                <Plus className="mr-2 size-5 transition-transform duration-200 group-hover:rotate-90" />
                Create Game
              </Button>
            </div>
            <div className="relative flex-1 sm:w-48">
              <Button
                className="group relative z-10 w-full overflow-hidden px-8"
                onClick={() => router.push(ROUTES.JOIN)}
                ref={(el) => {
                  buttonRefs.current[1] = el;
                }}
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
