/* eslint-disable react-hooks/static-components */
"use client";

import { Dices, Plus, Users } from "lucide-react";
import { motion, useTime, useTransform } from "motion/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FEATURES } from "@/constants/ui";
import { ROUTES } from "@/lib/routes";

const MotionButton = motion.create(Button);

// todo: move to constants
const ROTATION_MS = 3000;
const ROTATION_DEGREES = 360;
const FEATURE_STAGGER_SECONDS = 0.2;

const Home = () => {
  const router = useRouter();
  const time = useTime();

  const rotate = useTransform(time, [0, ROTATION_MS], [0, ROTATION_DEGREES], {
    clamp: false,
  });
  const rotationBg = useTransform(
    rotate,
    (r) =>
      `conic-gradient(from ${r}deg, #8B0000, #FFD700, #2C3E50, #C41E3A, #8B0000)`
  );

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
              <MotionButton
                className="relative w-full px-8"
                onClick={() => router.push(ROUTES.CREATE)}
                size="lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Plus className="mr-2 size-5" />
                Create Game
              </MotionButton>
            </div>
            <div className="relative flex-1 sm:w-48">
              <motion.div
                className="absolute inset-[-1.5px] rounded-md"
                style={{
                  background: rotationBg,
                }}
              />
              <MotionButton
                className="relative z-10 w-full px-8"
                onClick={() => router.push(ROUTES.JOIN)}
                size="lg"
                variant="outline"
              >
                <Users className="mr-2 size-5" />
                Join Game
              </MotionButton>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center font-bold text-3xl text-foreground"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Features
        </motion.h2>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {FEATURES.map((feature, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              key={feature.title}
              transition={{ delay: index * FEATURE_STAGGER_SECONDS }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="flex h-full flex-col p-6">
                <motion.div
                  className="mb-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10"
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.07, rotate: 360 }}
                >
                  <feature.icon className="size-6 text-primary" />
                </motion.div>
                <h3 className="mb-2 font-bold text-xl">{feature.title}</h3>
                <p className="grow text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
