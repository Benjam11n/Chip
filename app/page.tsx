'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dices, Plus, Users } from 'lucide-react';
import { motion, useTime, useTransform } from 'motion/react';
import { useRouter } from 'next/navigation';

const features = [
  {
    icon: Users,
    title: 'Automatic Bank',
    description:
      "Keep track of everyone's stack with automatic pot calculations and buy-in management.",
  },
  {
    icon: Dices,
    title: 'Hand Guide',
    description:
      'Quick reference for poker hand rankings and starting hand strengths.',
  },
  {
    icon: Plus,
    title: 'Quick Setup',
    description:
      'Start your game in seconds - just create a room and share the code.',
  },
];

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
    <div className="min-h-screen flex flex-col mt-20">
      {/* Hero Section */}
      <div className="flex-1 relative min-h-[400px] flex items-center justify-center py-16">
        {/* Decorative cards */}
        <div className="absolute inset-0 dark:opacity-30 opacity-10">
          <div className="absolute top-1/4 left-[10%] transform -rotate-12">
            <div className="w-32 h-48 lg:w-48 lg:h-72 bg-gray-600 rounded-lg border-4 border-gray-950 shadow-xl" />
          </div>
          <div className="absolute top-1/3 right-[15%] transform rotate-12">
            <div className="w-32 h-48 lg:w-48 lg:h-72 bg-primary rounded-lg border-4 border-gray-700 shadow-xl" />
          </div>
        </div>

        {/* Main content */}
        <div className="relative flex flex-col items-center text-foreground px-4">
          <div className="flex items-center gap-4 mb-8">
            <Dices className="h-16 w-16 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold">Chip</h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground text-center max-w-2xl mb-12 px-6">
            Play poker anywhere - leave the chips at home
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 sm:w-48">
              <MotionButton
                size="lg"
                onClick={() => router.push('/create')}
                className="px-8 relative w-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Game
              </MotionButton>
            </div>
            <div className="relative flex-1 sm:w-48">
              <motion.div
                className="absolute -inset-[1.5px] rounded-md"
                style={{
                  background: rotationBg,
                }}
              />
              <MotionButton
                variant="outline"
                size="lg"
                onClick={() => router.push('/join')}
                className="px-8 relative z-10 w-full"
              >
                <Users className="mr-2 h-5 w-5" />
                Join Game
              </MotionButton>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="p-6 h-full flex flex-col">
                <motion.div
                  className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 shrink-0"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="h-6 w-6 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground flex-grow">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
