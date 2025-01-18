'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Player, GameState, PlayerAction } from '../types';

interface ActionPanelProps {
  gameState: GameState;
  currentPlayer: Player;
  onAction: (action: PlayerAction, amount?: number) => void;
}

export function ActionPanel({ gameState, currentPlayer, onAction }: ActionPanelProps) {
  const [betAmount, setBetAmount] = useState(gameState.bettingRound.currentBet);

  const canCheck = gameState.bettingRound.currentBet === 0;
  const minRaise = gameState.bettingRound.currentBet + gameState.bettingRound.lastRaise;
  const maxBet = currentPlayer.stack;

  const getQuickBetAmounts = () => {
    const potSize = gameState.bettingRound.pots.reduce((total, pot) => total + pot.amount, 0);
    return [
      { label: '½ Pot', amount: Math.min(potSize / 2, maxBet) },
      { label: 'Pot', amount: Math.min(potSize, maxBet) },
      { label: '2x Pot', amount: Math.min(potSize * 2, maxBet) },
    ];
  };

  const handleAction = (action: PlayerAction) => {
    if (action === 'bet' || action === 'raise') {
      onAction(action, betAmount);
    } else {
      onAction(action);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 space-y-4">
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          onClick={() => handleAction('fold')}
          className="flex-1"
        >
          Fold
        </Button>
        {canCheck ? (
          <Button
            variant="outline"
            onClick={() => handleAction('check')}
            className="flex-1"
          >
            Check
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => handleAction('call')}
            className="flex-1"
          >
            Call ${gameState.bettingRound.currentBet}
          </Button>
        )}
        {currentPlayer.stack > gameState.bettingRound.currentBet && (
          <Button
            variant="default"
            onClick={() => handleAction(gameState.bettingRound.currentBet > 0 ? 'raise' : 'bet')}
            className="flex-1"
          >
            {gameState.bettingRound.currentBet > 0 ? 'Raise' : 'Bet'}
          </Button>
        )}
      </div>

      {(gameState.bettingRound.currentBet === 0 || currentPlayer.stack > gameState.bettingRound.currentBet) && (
        <>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Amount: ${betAmount}</span>
              <span>Stack: ${currentPlayer.stack}</span>
            </div>
            <Slider
              value={[betAmount]}
              onValueChange={([value]) => setBetAmount(value)}
              min={gameState.bettingRound.currentBet > 0 ? minRaise : gameState.bigBlind}
              max={maxBet}
              step={gameState.bigBlind}
            />
          </div>

          <div className="flex gap-2">
            {getQuickBetAmounts().map(({ label, amount }) => (
              <Button
                key={label}
                variant="outline"
                onClick={() => setBetAmount(Math.floor(amount / gameState.bigBlind) * gameState.bigBlind)}
                className="flex-1"
              >
                {label}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}