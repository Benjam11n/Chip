"use client";

import { Users } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Game } from "@/types";

const MINIMUM_NAME_LENGTH = 2;
const MAXIMUM_NAME_LENGTH = 30;

const JoinGameSchema = z.object({
  name: z
    .string()
    .min(MINIMUM_NAME_LENGTH, "Name must be at least 2 characters long")
    .max(MAXIMUM_NAME_LENGTH, "Name must be less than 30 characters"),
});

type FormValues = z.infer<typeof JoinGameSchema>;

type JoinFormProps = {
  game: Game;
  form: UseFormReturn<FormValues>;
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
};

export function JoinForm({
  game,
  form,
  onSubmit,
  isSubmitting,
}: JoinFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-bold text-2xl">{game.name}</h1>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Users className="size-4" />
          <span>
            {game?.players?.length} / {game.max_players} players
          </span>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name (2-30 characters)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Joining..." : "Join Game"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
