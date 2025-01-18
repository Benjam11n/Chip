'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Minus } from 'lucide-react';
import { Player, GameState, PlayerAction } from '@/app/types';

const ACTION_TOOLTIPS = {
  fold: "Give up your hand and forfeit any chips you've put in the pot. Use when you have a weak hand or face too much pressure.",
  check: "Pass the action to the next player without betting. Only available when there's no bet to call.",
  call: "Match the current bet to stay in the hand. Common play when you have a decent hand but don't want to raise.",
  bet: "Put chips in the pot when no one else has bet. Use to build the pot with strong hands or bluff.",
  raise: "Increase the current bet. Shows strength and builds the pot. Can be used to put pressure on opponents."
};

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
    const totalPot = gameState.bettingRound.totalPot;
    return [
      { label: '½ Pot', amount: Math.floor(totalPot / 2 / 5) * 5 },
      { label: 'Pot', amount: Math.floor(totalPot / 5) * 5 },
      { label: '2x Pot', amount: Math.floor((totalPot * 2) / 5) * 5 },
    ].filter(({ amount }) => amount <= maxBet && amount >= minRaise);
  };

  const handleBetChange = (amount: number) => {
    // Ensure amount is in increments of 5 and within valid range
    const roundedAmount = Math.round(amount / 5) * 5;
    const validAmount = Math.min(Math.max(roundedAmount, minRaise), maxBet);
    setBetAmount(validAmount);
  };

  const handleAction = (action: PlayerAction) => {
    if (action === 'bet' || action === 'raise') {
      onAction(action, betAmount);
    } else {
      onAction(action);
    }
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 space-y-4">
        <div className="flex gap-2 justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => handleAction('fold')}
                className="flex-1"
              >
                Fold
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{ACTION_TOOLTIPS.fold}</p>
            </TooltipContent>
          </Tooltip>

          {canCheck ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => handleAction('check')}
                  className="flex-1"
                >
                  Check
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{ACTION_TOOLTIPS.check}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => handleAction('call')}
                  className="flex-1"
                >
                  Call ${gameState.bettingRound.currentBet}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{ACTION_TOOLTIPS.call}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {currentPlayer.stack > gameState.bettingRound.currentBet && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  onClick={() => handleAction(gameState.bettingRound.currentBet > 0 ? 'raise' : 'bet')}
                  className="flex-1"
                >
                  {gameState.bettingRound.currentBet > 0 ? 'Raise' : 'Bet'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {gameState.bettingRound.currentBet > 0 ? ACTION_TOOLTIPS.raise : ACTION_TOOLTIPS.bet}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {(gameState.bettingRound.currentBet === 0 || currentPlayer.stack > gameState.bettingRound.currentBet) && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Amount: ${betAmount}</span>
                <span>Stack: ${currentPlayer.stack}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleBetChange(betAmount - 5)}
                  disabled={betAmount <= minRaise}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => handleBetChange(Number(e.target.value))}
                  className="text-center"
                  step={5}
                  min={minRaise}
                  max={maxBet}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleBetChange(betAmount + 5)}
                  disabled={betAmount >= maxBet}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              {getQuickBetAmounts().map(({ label, amount }) => (
                <Button
                  key={label}
                  variant="outline"
                  onClick={() => handleBetChange(amount)}
                  className="flex-1"
                >
                  {label}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}