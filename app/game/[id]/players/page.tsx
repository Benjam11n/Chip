'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Copy, Lock, Unlock, UserMinus, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Game } from '@/app/types';
import { toast } from 'sonner';

interface PlayersPageProps {
  params: {
    id: string;
  };
}

export default function PlayersPage({ params }: PlayersPageProps) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGame = async () => {
      try {
        const { data: game, error } = await supabase
          .from('games')
          .select('*, players(*)')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setGame(game);
      } catch (error) {
        toast.error('Error', {
          description: 'Failed to load game',
        });
      } finally {
        setLoading(false);
      }
    };

    loadGame();

    // Set up real-time subscription
    const subscription = supabase
      .channel('game_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${params.id}`,
        },
        (payload) => {
          setGame(payload.new as Game);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${params.id}`,
        },
        () => {
          // Reload game data to get updated players
          loadGame();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [params.id]);

  const toggleGameLock = async () => {
    if (!game) return;

    try {
      const { error } = await supabase
        .from('games')
        .update({ is_locked: !game.isLocked })
        .eq('id', game.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Game ${
          game.isLocked ? 'unlocked' : 'locked'
        } successfully`,
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to update game status',
      });
    }
  };

  const removePlayer = async (playerId: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);

      if (error) throw error;

      toast('Success', {
        description: 'Player removed successfully',
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to remove player',
      });
    }
  };

  const copyJoinLink = () => {
    if (!game) return;
    const joinUrl = `${window.location.origin}/join/${game.code}`;
    navigator.clipboard.writeText(joinUrl);
    toast('Copied', {
      description: 'Join link copied to clipboard',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <p className="text-muted-foreground">
            The game you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{game.name}</h1>
            <p className="text-muted-foreground">
              <Users className="inline-block h-4 w-4 mr-1" />
              {game.players.length} / {game.maxPlayers} players
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex-1 md:flex-none"
              onClick={copyJoinLink}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Join Link
            </Button>
            <div className="flex items-center gap-2">
              <Switch
                checked={game.isLocked}
                onCheckedChange={toggleGameLock}
              />
              {game.isLocked ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Unlock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Players</h2>
              <p className="text-sm text-muted-foreground">
                Game Code: {game.code}
              </p>
            </div>

            <div className="divide-y">
              {game.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{player.name}</span>
                    {player.id === game.createdBy && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Host
                      </span>
                    )}
                  </div>
                  {player.id !== game.createdBy && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <UserMinus className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Player</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {player.name} from
                            the game? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removePlayer(player.id)}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>

            {game.players.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No players have joined yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
