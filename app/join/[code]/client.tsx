'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { QrCode, Copy, Users, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { JoinSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase/client';
import { Game } from '@/types';

interface JoinGameClientProps {
  code: string;
}

const JoinGameSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(30, 'Name must be less than 30 characters'),
});

type FormValues = z.infer<typeof JoinGameSchema>;

export default function JoinGameClient({ code }: JoinGameClientProps) {
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(JoinGameSchema),
    defaultValues: {
      name: '',
    },
  });

  // Memoize loadGame function to prevent unnecessary recreations
  const loadGame = useCallback(async () => {
    try {
      const { data: game, error: fetchError } = await supabase
        .from('games')
        .select('*, players(*)')
        .eq('code', code)
        .single();

      if (fetchError) {
        throw new Error('An error occured when fetching the game');
      }

      if (!game) {
        throw new Error('Game not found');
      }

      setGame(game);

      try {
        // Generate QR code in parallel
        const url = window.location.href;
        const qr = await QRCode.toDataURL(url, {
          errorCorrectionLevel: 'M',
          margin: 2,
          width: 256,
        });
        setQrCode(qr);
      } catch (qrError) {
        console.error('Failed to generate QR code:', qrError);
        // Don't throw - QR code is non-critical
      }
    } catch (error) {
      console.error(error);
      toast.error('Error', {
        description: 'Game not found or invalid code',
      });
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    loadGame();

    // Set up real-time subscription with error handling
    const subscription = supabase
      .channel('game_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `code=eq.${code}`,
        },
        (payload) => {
          try {
            setGame(payload.new as Game);
          } catch (error) {
            console.error('Error processing game update:', error);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [code, loadGame]);

  const handleJoin = async (data: FormValues) => {
    if (!game) return;
    const name = data.name;

    try {
      if (game?.players?.length >= game.max_players) {
        throw new Error('Game is full');
      }

      if (
        game.players.some((p) => p.name.toLowerCase() === name.toLowerCase())
      ) {
        throw new Error('Name already taken. Please choose another name');
      }

      const { error: insertError } = await supabase.from('players').insert({
        game_id: game.id,
        name: name.trim(),
        stack: game.initial_buy_in,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      localStorage.setItem(
        'currentPlayer',
        JSON.stringify({
          name,
          gameId: game.id,
        })
      );

      toast.success('Success', {
        description: 'Successfully joined the game',
      });

      router.push(`/game/${game.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Failed to join game',
      });
    }
  };

  const copyJoinLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Success', {
        description: 'Join link copied to clipboard',
      });
    } catch (error) {
      console.error(error);
      toast.error('Error', {
        description:
          error instanceof Error
            ? error.message
            : 'Failed to copy link to clipboard',
      });
    }
  };

  if (loading) {
    return <JoinSkeleton />;
  }

  if (!game) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mx-auto max-w-md px-8 text-center">
          <h1 className="mb-4 text-2xl font-bold">Game Not Found</h1>
          <p className="text-muted-foreground">
            The game code you entered is either incorrect or the game has
            expired. Games automatically expire after 24 hours of inactivity to
            keep things fresh.
          </p>
          <Button className="mt-6" onClick={() => router.push('/join')}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="size-4" />
          Home
        </Button>
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">{game.name}</h1>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Users className="size-4" />
                <span>
                  {game?.players?.length} / {game.max_players} players
                </span>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleJoin)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name (2-30 characters)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Joining...' : 'Join Game'}
                </Button>
              </form>
            </Form>

            <div className="space-y-4">
              {qrCode ? (
                <div className="flex justify-center">
                  <Image
                    width={252}
                    height={252}
                    src={qrCode}
                    alt="Join QR Code"
                    className="rounded-md"
                  />
                </div>
              ) : (
                <div className="flex justify-center">
                  <Skeleton className="size-48" />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={copyJoinLink}
                >
                  <Copy className="mr-2 size-4" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.print()}
                >
                  <QrCode className="mr-2 size-4" />
                  Save QR
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {game?.players?.length > 0 && (
          <Card className="p-6">
            <h2 className="mb-4 font-semibold">Current Players</h2>
            <div className="space-y-2">
              {game.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between border-b py-2 last:border-0"
                >
                  <span>{player.name}</span>
                  {player.id === game.createdBy && (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                      Host
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
