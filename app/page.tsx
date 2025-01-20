'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dices, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col mt-20">
      {/* Hero Section */}
      <div className="flex-1 relative min-h-[400px] flex items-center justify-center py-16">
        {/* Decorative cards */}
        <div className="absolute inset-0 dark:opacity-30 opacity-10">
          <div className="absolute top-1/4 left-[10%] transform -rotate-12">
            <div className="w-32 h-48 bg-gray-700 rounded-lg border-4 border-gray-950 shadow-xl" />
          </div>
          <div className="absolute top-1/3 right-[15%] transform rotate-12">
            <div className="w-32 h-48 bg-primary rounded-lg border-4 border-gray-700 shadow-xl" />
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
            <Button
              size="lg"
              onClick={() => router.push('/create')}
              className="px-8"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Game
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/join')}
              className="px-8"
            >
              <Users className="mr-2 h-5 w-5" />
              Join Game
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Automatic Bank</h3>
            <p className="text-muted-foreground">
              Keep track of everyone&apos;s stack with automatic pot
              calculations and buy-in management.
            </p>
          </Card>
          <Card className="p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Dices className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Hand Guide</h3>
            <p className="text-muted-foreground">
              Quick reference for poker hand rankings and starting hand
              strengths.
            </p>
          </Card>
          <Card className="p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quick Setup</h3>
            <p className="text-muted-foreground">
              Start your game in seconds - just create a room and share the
              code.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
