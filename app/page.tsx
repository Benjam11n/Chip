'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dices, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-br from-red-900 to-black overflow-hidden">
        {/* Decorative cards */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[10%] left-[10%] transform -rotate-12">
            <div className="w-32 h-48 bg-white rounded-lg border-4 border-white shadow-xl" />
          </div>
          <div className="absolute top-[20%] right-[15%] transform rotate-12">
            <div className="w-32 h-48 bg-red-600 rounded-lg border-4 border-white shadow-xl" />
          </div>
        </div>

        {/* Main content */}
        <div className="relative h-full flex flex-col items-center justify-center text-white p-4">
          <div className="flex items-center gap-4 mb-6">
            <Dices className="h-16 w-16 text-red-500" />
            <h1 className="text-5xl md:text-6xl font-bold">Chip</h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 text-center max-w-2xl mb-12">
            Track chips, manage players, and elevate your poker game to the next
            level
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              onClick={() => router.push('/create')}
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Game
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-red-500 text-red-500 hover:bg-red-950 px-8"
              onClick={() => router.push('/join')}
            >
              <Users className="mr-2 h-5 w-5" />
              Join Game
            </Button>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 bg-zinc-900 border-zinc-800 text-white">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
            <p className="text-gray-400">
              Monitor chip counts, player actions, and game progress in
              real-time
            </p>
          </Card>

          <Card className="p-6 bg-zinc-900 border-zinc-800 text-white">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <Dices className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Hand Analysis</h3>
            <p className="text-gray-400">
              Get instant analysis of your poker hands with probability
              calculations
            </p>
          </Card>

          <Card className="p-6 bg-zinc-900 border-zinc-800 text-white">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Setup</h3>
            <p className="text-gray-400">
              Create or join games quickly with a simple, intuitive interface
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
