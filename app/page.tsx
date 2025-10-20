'use client';

import { Dices, Plus, Users } from 'lucide-react';
import { motion, useTime, useTransform } from 'motion/react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FEATURES } from '@/constants';

export default function Home() {
  const router = useRouter();
  const time = useTime();
  const MotionButton = motion.create(Button);

  const rotate = useTransform(time, [0, 3000], [0, 360], {
    clamp: false,
  });
  const rotationBg = useTransform(rotate, (r) => {
    return `conic-gradient(from ${r}deg, #8B0000, #FFD700, #2C3E50, #C41E3A, #8B0000)`;
  });

  return (
    <div className="mt-20 flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="relative flex min-h-[400px] flex-1 items-center justify-center py-16">
        {/* Decorative cards */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute left-[10%] top-1/4 -rotate-12">
            <div className="h-48 w-32 rounded-lg border-4 border-muted-foreground bg-muted shadow-xl lg:h-72 lg:w-48" />
          </div>
          <div className="absolute right-[15%] top-1/3 rotate-12">
            <div className="h-48 w-32 rounded-lg border-4 border-muted-foreground bg-primary shadow-xl lg:h-72 lg:w-48" />
          </div>
        </div>

        {/* Main content */}
        <div className="relative flex flex-col items-center px-4 text-foreground">
          <div className="mb-8 flex items-center gap-4">
            <Dices className="size-16 text-primary" />
            <h1 className="text-5xl font-bold md:text-6xl">Chip</h1>
          </div>
          <p className="mb-12 max-w-2xl px-6 text-center text-xl text-muted-foreground md:text-2xl">
            Play poker anywhere - leave the chips at home
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1 sm:w-48">
              <MotionButton
                size="lg"
                onClick={() => router.push('/create')}
                className="relative w-full px-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
                variant="outline"
                size="lg"
                onClick={() => router.push('/join')}
                className="relative z-10 w-full px-8"
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
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="flex h-full flex-col p-6">
                <motion.div
                  className="mb-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="size-6 text-primary" />
                </motion.div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="grow text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
