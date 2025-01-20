'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dices, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-auto mt-20">
        {/* Decorative cards */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[10%] left-[10%] transform -rotate-12">
            <div className="w-32 h-48 bg-card rounded-lg border-4 border-background shadow-xl" />
          </div>
          <div className="absolute top-[20%] right-[15%] transform rotate-12">
            <div className="w-32 h-48 bg-primary rounded-lg border-4 border-background shadow-xl" />
          </div>
        </div>
        {/* Main content */}
        <div className="relative h-full flex flex-col items-center justify-center text-foreground p-4">
          <div className="flex items-center gap-4 mb-6">
            <Dices className="h-16 w-16 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold">Chip</h1>
          </div>
          <p className="text-lg md:text-2xl text-muted-foreground text-center max-w-2xl mb-12 px-4">
            Track chips, manage players, and elevate your poker game to the next
            level
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => router.push('/create')}>
              <Plus className="mr-2 h-5 w-5" />
              Create Game
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/join')}
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
            <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
            <p className="text-muted-foreground">
              Monitor chip counts, player actions, and game progress in
              real-time
            </p>
          </Card>
          <Card className="p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Dices className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Hand Analysis</h3>
            <p className="text-muted-foreground">
              Get instant analysis of your poker hands with probability
              calculations
            </p>
          </Card>
          <Card className="p-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Setup</h3>
            <p className="text-muted-foreground">
              Create or join games quickly with a simple, intuitive interface
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
