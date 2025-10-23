"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";
import { ROUTES } from "@/lib/routes";
import { supabase } from "@/lib/supabase/client";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      // Check if game exists and is not expired
      const { data: game, error } = await supabase
        .from("games")
        .select("id")
        .eq("code", code.trim())
        .single();

      if (error || !game) {
        toast.error("Game not found", {
          description:
            "This game has either expired or doesn't exist. Games expire after 24 hours of inactivity. Create a new game to start playing!",
        });
        setCode("");
        return;
      }

      // Game exists, proceed to join page
      router.push(ROUTES.JOIN_WITH_CODE(code.trim()));
    } catch (error) {
      logger.error(error, "Failed to join game");
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
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
        <div className="text-center">
          <h1 className="font-bold text-3xl">Join Game</h1>
          <p className="mt-2 text-muted-foreground">
            Enter the game code to join
          </p>
        </div>
        <Card className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="code">Game Code</Label>
              <Input
                className="text-center"
                disabled={isLoading}
                id="code"
                maxLength={6}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Your game code..."
                value={code}
              />
            </div>
            <Button
              className="w-full"
              disabled={!code.trim() || isLoading}
              type="submit"
            >
              {isLoading ? "Checking..." : "Continue"}
              {!isLoading && <ArrowRight className="ml-2 size-4" />}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
