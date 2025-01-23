'use client';

import { formatDistanceToNow } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase/client';
import { MoveHistoryView, PlayerView } from '@/types';

import { Skeleton } from './ui/skeleton';

interface MoveHistoryProps {
  gameId: string | undefined;
  players: PlayerView[];
  totalPot: number;
}

function MoveHistorySkeleton() {
  return (
    <Card className="p-4">
      <div className="mx-2 mb-4 flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <ScrollArea className="h-[380px] pr-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-border py-2 last:border-0"
            >
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

export function MoveHistory({ gameId, players, totalPot }: MoveHistoryProps) {
  const [moves, setMoves] = useState<MoveHistoryView[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when moves update
  const scrollToBottom = useCallback(() => {
    // Find the viewport element within ScrollArea
    const viewport = document.querySelector(
      '[data-radix-scroll-area-viewport]'
    );
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [moves, scrollToBottom]);

  const fetchMoves = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('game_actions')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMoves(
        data.map((move) => ({
          ...move,
          id: move.id,
          playerId: move.player_id,
          createdAt: move.created_at,
          amount: move.amount,
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error('Error fetching game history');
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  // Listen for realtime updates
  useEffect(() => {
    fetchMoves();

    const channel = supabase
      .channel(`moves:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_actions',
          filter: `game_id=eq.${gameId}`,
        },
        fetchMoves
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [fetchMoves, gameId]);

  if (loading) {
    return <MoveHistorySkeleton />;
  }

  const getPlayerName = (playerId: string) => {
    return players.find((p) => p.id === playerId)?.name || 'Unknown Player';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatMove = (move: MoveHistoryView) => {
    const playerName = getPlayerName(move.playerId);
    const action = move.action_type === 'add' ? 'places' : 'takes';
    return `${playerName} ${action} ${formatAmount(move.amount || 0)} ${
      move.action_type === 'add' ? 'in the pot' : 'from the pot'
    }`;
  };

  return (
    <Card className="p-4">
      <div className="mx-2 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Move History</h2>
        <div className="text-sm">
          <span className="text-muted-foreground">Total Pot: </span>
          <span className="font-bold text-foreground">
            {formatAmount(totalPot)}
          </span>
        </div>
      </div>
      <ScrollArea className="h-[380px] pr-4" ref={scrollAreaRef}>
        <div className="space-y-2">
          {moves.map((move) => (
            <div
              key={move.id}
              className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0"
            >
              <span className="text-foreground">{formatMove(move)}</span>
              <span className="text-muted-foreground">
                {formatDistanceToNow(move.createdAt, { addSuffix: true })}
              </span>
            </div>
          ))}
          {moves.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No moves yet
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
