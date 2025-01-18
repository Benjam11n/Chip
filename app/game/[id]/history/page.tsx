'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface GameAction {
  id: string;
  player: {
    name: string;
  };
  actionType: string;
  amount: number;
  createdAt: string;
}

interface GameRound {
  id: string;
  roundNumber: number;
  status: string;
  actions: GameAction[];
  pots: {
    amount: number;
    winner?: {
      name: string;
    };
  }[];
}

export default function HistoryPage({ params }: { params: { id: string } }) {
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRound, setSelectedRound] = useState<string>('all');
  const [expandedRounds, setExpandedRounds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data: gameRounds, error } = await supabase
          .from('game_rounds')
          .select(
            `
            id,
            round_number,
            status,
            game_actions (
              id,
              action_type,
              amount,
              created_at,
              player:players (name)
            ),
            game_pots (
              amount,
              winner:players (name)
            )
          `
          )
          .eq('game_id', params.id)
          .order('round_number', { ascending: false });

        if (error) throw error;
        setRounds(gameRounds || []);
      } catch (error) {
        toast.error('Error', {
          description: 'Failed to load game history',
        });
      } finally {
        setLoading(false);
      }
    };

    loadHistory();

    // Set up real-time subscription
    const subscription = supabase
      .channel('game_history')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_actions',
          filter: `game_id=eq.${params.id}`,
        },
        () => {
          loadHistory();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [params.id, toast]);

  const toggleRound = (roundId: string) => {
    const newExpanded = new Set(expandedRounds);
    if (newExpanded.has(roundId)) {
      newExpanded.delete(roundId);
    } else {
      newExpanded.add(roundId);
    }
    setExpandedRounds(newExpanded);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(new Date(date));
  };

  const filteredRounds = rounds.filter((round) => {
    const matchesSearch =
      searchTerm === '' ||
      round.actions.some((action) =>
        action.player.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesRound = selectedRound === 'all' || round.id === selectedRound;
    return matchesSearch && matchesRound;
  });

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by player name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedRound} onValueChange={setSelectedRound}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by round" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rounds</SelectItem>
            {rounds.map((round) => (
              <SelectItem key={round.id} value={round.id}>
                Round {round.roundNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {filteredRounds.map((round) => (
            <Card key={round.id} className="p-4">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => toggleRound(round.id)}
              >
                {expandedRounds.has(round.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <h3 className="text-lg font-semibold">
                  Round {round.roundNumber}
                </h3>
                <span className="text-sm text-muted-foreground ml-auto">
                  {round.status}
                </span>
              </div>

              {expandedRounds.has(round.id) && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    {round.actions.map((action) => (
                      <div
                        key={action.id}
                        className="flex items-center justify-between text-sm py-1 border-b last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {action.player.name}
                          </span>
                          <span className="text-muted-foreground">
                            {action.actionType}
                          </span>
                          {action.amount > 0 && (
                            <span>{formatAmount(action.amount)}</span>
                          )}
                        </div>
                        <span className="text-muted-foreground">
                          {formatDate(action.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {round.pots.map((pot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm bg-muted p-2 rounded"
                    >
                      <span>
                        Pot {index + 1}: {formatAmount(pot.amount)}
                      </span>
                      {pot.winner && (
                        <span className="font-medium">
                          Winner: {pot.winner.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}

          {filteredRounds.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No history found.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
