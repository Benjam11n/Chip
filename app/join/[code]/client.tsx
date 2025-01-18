'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { QrCode, Copy, Users } from 'lucide-react';
import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase/client';
import { Game } from '@/app/types';
import { toast } from 'sonner';
import Image from 'next/image';

interface JoinGameClientProps {
  code: string;
}

export default function JoinGameClient({ code }: JoinGameClientProps) {
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Memoize loadGame function to prevent unnecessary recreations
  const loadGame = useCallback(async () => {
    try {
      setError(null);
      const { data: game, error: fetchError } = await supabase
        .from('games')
        .select('*, players(*)')
        .eq('code', code)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
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
    } catch (error: any) {
      setError(error.message);
      toast.error('Error', {
        description: error.message || 'Game not found or invalid code',
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
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to game updates');
        } else {
          console.error('Failed to subscribe to game updates:', status);
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [code, loadGame]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!game || !playerName.trim()) return;

    setJoining(true);
    setError(null);

    try {
      // Input validation
      if (playerName.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }

      if (playerName.trim().length > 30) {
        throw new Error('Name must be less than 30 characters');
      }

      // Game state validation
      if (game.isLocked) {
        throw new Error('Game is locked');
      }

      if (game.players.length >= game.maxPlayers) {
        throw new Error('Game is full');
      }

      if (
        game.players.some(
          (p) => p.name.toLowerCase() === playerName.toLowerCase()
        )
      ) {
        throw new Error('Name already taken');
      }

      const { error: insertError } = await supabase.from('players').insert({
        game_id: game.id,
        name: playerName.trim(),
        stack: game.initial_buy_in,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      localStorage.setItem(
        'currentPlayer',
        JSON.stringify({
          name: playerName,
          gameId: game.id,
        })
      );

      toast.success('Success', {
        description: 'Successfully joined the game',
      });

      router.push(`/game/${game.id}`);
    } catch (error: any) {
      setError(error.message);
      toast.error('Error', {
        description: error.message || 'Failed to join game',
      });
    } finally {
      setJoining(false);
    }
  };

  const copyJoinLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Success', {
        description: 'Join link copied to clipboard',
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to copy link to clipboard',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <p className="text-muted-foreground">
            {error ||
              "The game you're looking for doesn't exist or has expired."}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push('/join')}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">{game.name}</h1>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {game.players.length} / {game.maxPlayers} players
                </span>
              </div>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playerName">Your Name</Label>
                <Input
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name (2-30 characters)"
                  disabled={joining || game.isLocked}
                  maxLength={30}
                  minLength={2}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!playerName.trim() || joining || game.isLocked}
              >
                {joining ? 'Joining...' : 'Join Game'}
              </Button>
            </form>

            <div className="space-y-4">
              {qrCode ? (
                <div className="flex justify-center">
                  <Image
                    width={252}
                    height={252}
                    src={qrCode}
                    alt="Join QR Code"
                  />
                </div>
              ) : (
                <div className="flex justify-center">
                  <Skeleton className="w-48 h-48" />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={copyJoinLink}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.print()}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Save QR
                </Button>
              </div>
            </div>

            {game.isLocked && (
              <div className="text-center text-muted-foreground">
                This game is currently locked by the host.
              </div>
            )}
          </div>
        </Card>

        {game.players.length > 0 && (
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Current Players</h2>
            <div className="space-y-2">
              {game.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span>{player.name}</span>
                  {player.id === game.createdBy && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
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
