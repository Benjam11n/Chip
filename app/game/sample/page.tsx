'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { PlayerCard } from '@/components/player-card';
import { MoveHistory } from '@/components/move-history';
import { HandInput } from '@/components/hand-input/hand-input';
import { PokerHandsChart } from '@/components/poker-hands-chart';
import { Player, GameState, MoveHistory as MoveHistoryType } from '@/app/types';
import { nanoid } from 'nanoid';

// Mock initial game state
const initialGameState: GameState = {
  id: 'sample-game',
  players: [
    {
      id: 'player1',
      name: 'Alice',
      stack: 500,
      position: 1,
    },
    {
      id: 'player2',
      name: 'Bob',
      stack: 500,
      position: 2,
    },
    {
      id: 'player3',
      name: 'Charlie',
      stack: 500,
      position: 3,
    }
  ],
  pot: 0,
  moves: [],
  initialBuyIn: 500
};

export default function SamplePokerRoom() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [currentUserId, setCurrentUserId] = useState<string>('player1'); // In a real app, this would come from auth

  const handlePotAction = (playerId: string, amount: number, action: 'add' | 'remove') => {
    // Only allow players to manage their own pot actions
    if (playerId !== currentUserId) return;

    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    // Validate the action
    if (action === 'add' && player.stack < amount) return;
    if (action === 'remove' && gameState.pot < amount) return;

    // Update player stack and pot
    const newGameState = { ...gameState };
    const playerIndex = newGameState.players.findIndex(p => p.id === playerId);
    
    if (action === 'add') {
      newGameState.players[playerIndex].stack -= amount;
      newGameState.pot += amount;
    } else {
      newGameState.players[playerIndex].stack += amount;
      newGameState.pot -= amount;
    }

    // Record the action
    const move: MoveHistoryType = {
      id: nanoid(),
      playerId,
      timestamp: Date.now(),
      type: 'money',
      moneyAction: action,
      amount
    };

    newGameState.moves.push(move);
    setGameState(newGameState);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-32">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Sample Poker Room</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Game ID: {gameState.id}</span>
              <span className="font-medium text-primary">
                Total Pot: ${gameState.pot}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <HandInput />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gameState.players.map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isCurrentUser={player.id === currentUserId}
                  onPotAction={handlePotAction}
                  pot={gameState.pot}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <MoveHistory
              moves={gameState.moves}
              players={gameState.players}
              totalPot={gameState.pot}
            />
          </div>
        </div>

        <PokerHandsChart />
      </div>
    </div>
  );
}