"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { PlayerView } from "@/types";
import { PlayerCardSkeleton } from "./skeletons";
import { Badge } from "./ui/badge";

type PlayerCardProps = {
  player: PlayerView | null;
  isCurrentUser: boolean;
  onPotAction: (
    playerId: string,
    amount: number,
    action: "add" | "remove"
  ) => void;
  pot: number;
  isLoading?: boolean;
  actionLoading?: boolean;
};

export const PlayerCard = ({
  player,
  isCurrentUser,
  onPotAction,
  pot,
  isLoading = false,
  actionLoading = false,
}: Readonly<PlayerCardProps>) => {
  const [amount, setAmount] = useState(5);

  const handleAmountChange = (newAmount: number) => {
    const roundedAmount = Math.max(5, Math.round(newAmount / 5) * 5);
    setAmount(roundedAmount);
  };

  if (isLoading) {
    return <PlayerCardSkeleton />;
  }

  if (!player) {
    return null;
  }

  return (
    <Card
      className={cn("h-fit", isCurrentUser && "border-primary/20 bg-primary/5")}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">
            {player.name}
            {isCurrentUser ? (
              <Badge className="ml-2 rounded-full bg-primary/20 px-2 text-primary text-xs">
                You
              </Badge>
            ) : null}
          </h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-left">
          <span className="font-bold text-foreground text-lg">
            ${player.stack}
          </span>
        </div>
        {isCurrentUser ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                disabled={amount <= 5 || actionLoading}
                onClick={() => handleAmountChange(amount - 5)}
                size="icon"
                variant="outline"
              >
                <Minus className="size-4" />
              </Button>
              <Input
                className="text-center"
                disabled={actionLoading}
                min={0}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                step={5}
                type="number"
                value={amount}
              />
              <Button
                disabled={actionLoading}
                onClick={() => handleAmountChange(amount + 5)}
                size="icon"
                variant="outline"
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                disabled={player.stack < amount || actionLoading}
                onClick={() => onPotAction(player.id, amount, "add")}
              >
                Add to Pot
              </Button>
              <Button
                disabled={player.stack < amount || actionLoading}
                onClick={() => onPotAction(player.id, player.stack, "add")}
              >
                All in
              </Button>
              <Button
                disabled={pot < amount || actionLoading}
                onClick={() => onPotAction(player.id, amount, "remove")}
                variant="outline"
              >
                Take from Pot
              </Button>
              <Button
                disabled={pot < amount || actionLoading}
                onClick={() => onPotAction(player.id, pot, "remove")}
                variant="outline"
              >
                Take all from Pot
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
