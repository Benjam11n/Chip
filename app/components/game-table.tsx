'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { PlayerCard } from './player-card';
import { ActionPanel } from './action-panel';
import { HandHistory } from './hand-history';
import { GameState, Player, PlayerAction, HandHistory as HandHistoryType, ActionHistory } from '../types';
import { nanoid } from 'nanoid';

interface GameTableProps {
  initialState: GameState;
}

export function GameTable({ initialState }: GameTableProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const handleAction = (action: PlayerAction, amount?: number) => {
    // Validate action
    if (!isValidAction(action, amount)) return;

    // Process action
    const updatedState = processAction(gameState, action, amount);

    // Record action in history
    const updatedStateWithHistory = recordAction(updatedState, action, amount);

    // Move to next player or betting round
    const nextState = moveToNextPlayer(updatedStateWithHistory);

    setGameState(nextState);
  };

  const recordAction = (state: GameState, action: PlayerAction, amount?: number): GameState => {
    if (!state.currentHand) return state;

    const newAction: ActionHistory = {
      id: nanoid(),
      playerId: state.currentPlayer,
      action,
      amount,
      timestamp: Date.now(),
      round: state.bettingRound.round
    };

    return {
      ...state,
      currentHand: {
        ...state.currentHand,
        actions: [...state.currentHand.actions, newAction]
      }
    };
  };

  const startNewHand = () => {
    const newHand: HandHistoryType = {
      id: nanoid(),
      handNumber: (gameState.handHistory.length + 1),
      dealer: gameState.dealer,
      smallBlind: gameState.smallBlind,
      bigBlind: gameState.bigBlind,
      actions: [],
      startTime: Date.now(),
      winners: []
    };

    setGameState(state => ({
      ...state,
      currentHand: newHand,
      isHandInProgress: true,
      bettingRound: {
        ...state.bettingRound,
        round: 'preflop',
        currentBet: 0,
        lastRaise: 0,
        pots: []
      }
    }));
  };

  const endCurrentHand = (winners: Array<{ playerId: string; amount: number; potId: string }>) => {
    if (!gameState.currentHand) return;

    const completedHand: HandHistoryType = {
      ...gameState.currentHand,
      endTime: Date.now(),
      winners
    };

    setGameState(state => ({
      ...state,
      handHistory: [...state.handHistory, completedHand],
      currentHand: undefined,
      isHandInProgress: false
    }));
  };

  // ... rest of the existing code ...

  return (
    <div className="min-h-screen bg-background p-4 pb-32">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gameState.players.map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isActive={player.id === gameState.currentPlayer}
                  isDealer={player.id === gameState.dealer}
                  onUpdate={() => {}}
                  onRemove={() => {}}
                />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <HandHistory
              history={gameState.handHistory}
              players={gameState.players}
            />
          </div>
        </div>
      </div>
      
      {currentPlayer && (
        <ActionPanel
          gameState={gameState}
          currentPlayer={currentPlayer}
          onAction={handleAction}
        />
      )}
    </div>
  );
}