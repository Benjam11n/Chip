"use client";

import { ArrowLeft, Dices } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ROUTES } from "@/lib/routes";

type GameData = {
  name: string;
  maxPlayers: number;
  initialBuyIn: number;
};

// todo: move to a constants file
const MAXIMUM_VALUE = 1000;
const DEFAULT_MAX_PLAYERS = 6;
const MINIMUM_BUY_IN = 100;
const BUY_IN_ROUND_TO = 5;

export default function CreateGamePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(DEFAULT_MAX_PLAYERS);
  const [initialBuyIn, setInitialBuyIn] = useState(MAXIMUM_VALUE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }

    setLoading(true);

    const gameData: GameData = {
      name: name.trim(),
      maxPlayers,
      initialBuyIn,
    };

    try {
      const response = await fetch(ROUTES.API.GAMES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Failed to create game");
      }

      const data = await response.json();

      toast.success("Success", {
        description: "Game created successfully",
      });

      router.push(ROUTES.JOIN_WITH_CODE(data.code));
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to create game",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    // Round to nearest $5 and ensure minimum of $100
    const roundedValue = Math.max(
      MINIMUM_BUY_IN,
      Math.round(value / BUY_IN_ROUND_TO) * BUY_IN_ROUND_TO
    );
    setInitialBuyIn(roundedValue);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-md space-y-6">
        <Button
          className="flex items-center gap-2"
          onClick={() => router.push(ROUTES.HOME)}
          variant="ghost"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="mt-6 flex items-center justify-center gap-2">
          <Dices className="size-8" />
          <h1 className="font-bold text-3xl">Create Game</h1>
        </div>

        <Card className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Game Name</Label>
              <Input
                disabled={loading}
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter game name"
                value={name}
              />
            </div>

            <div className="space-y-4">
              <Label>Maximum Players: {maxPlayers}</Label>
              <Slider
                disabled={loading}
                max={20}
                min={2}
                onValueChange={(value) => setMaxPlayers(value[0] as number)}
                step={1}
                value={[maxPlayers]}
              />
              <p className="text-muted-foreground text-sm">
                Set the maximum number of players that can join your game.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyIn">Initial Buy-in Amount ($)</Label>
              <Input
                disabled={loading}
                id="buyIn"
                max={100_000_000}
                min={100}
                onChange={handleBuyInChange}
                placeholder="Enter initial buy-in amount"
                step={5}
                type="number"
                value={initialBuyIn}
              />
              <p className="text-muted-foreground text-sm">
                Set the initial amount each player starts with. Minimum $100, in
                increments of $5.
              </p>
            </div>

            <Button
              className="w-full"
              disabled={!name.trim() || loading}
              type="submit"
            >
              {loading ? "Creating..." : "Create Game"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
