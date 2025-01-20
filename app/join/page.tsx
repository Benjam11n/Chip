'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      // Check if game exists and is not expired
      const { data: game, error } = await supabase
        .from('games')
        .select('id')
        .eq('code', code.trim())
        .single();

      if (error || !game) {
        toast.error('Game not found', {
          description:
            "This game has either expired or doesn't exist. Games expire after 24 hours of inactivity. Create a new game to start playing!",
        });
        setCode('');
        return;
      }

      // Game exists, proceed to join page
      router.push(`/join/${code.trim()}`);
    } catch (error) {
      toast.error('Error', {
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-3xl font-bold">Join Game</h1>
          <p className="text-muted-foreground mt-2">
            Enter the game code to join
          </p>
        </div>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Game Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Your game code..."
                className="text-center"
                maxLength={6}
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!code.trim() || isLoading}
            >
              {isLoading ? 'Checking...' : 'Continue'}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
