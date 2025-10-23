"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/lib/supabase/client";
import type { Game } from "@/types";

const JoinGameSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(30, "Name must be less than 30 characters"),
});

type FormValues = z.infer<typeof JoinGameSchema>;

interface UseJoinFormOptions {
  game: Game | null;
}

export function useJoinForm({ game }: UseJoinFormOptions) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(JoinGameSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleJoin = async (data: FormValues) => {
    if (!game) return;
    const { name } = data;

    try {
      if (game?.players?.length >= game.max_players) {
        throw new Error("Game is full");
      }

      if (
        game?.players?.some((p) => p.name.toLowerCase() === name.toLowerCase())
      ) {
        throw new Error("Name already taken. Please choose another name");
      }

      const { error: insertError } = await supabase.from("players").insert({
        game_id: game.id,
        name: name.trim(),
        stack: game.initial_buy_in,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      localStorage.setItem(
        "currentPlayer",
        JSON.stringify({
          name,
          gameId: game.id,
        }),
      );

      toast.success("Success", {
        description: "Successfully joined the game",
      });

      router.push(`/game/${game.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: error instanceof Error
          ? error.message
          : "Failed to join game",
      });
    }
  };

  return {
    form,
    handleJoin,
    isSubmitting: form.formState.isSubmitting,
  };
}
