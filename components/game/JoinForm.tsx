'use client';

import { Users } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Game } from '@/types';

const JoinGameSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(30, 'Name must be less than 30 characters'),
});

type FormValues = z.infer<typeof JoinGameSchema>;

interface JoinFormProps {
  game: Game;
  form: UseFormReturn<FormValues>;
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
}

export function JoinForm({ game, form, onSubmit, isSubmitting }: JoinFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">{game.name}</h1>
        <div className="text-muted-foreground flex items-center justify-center gap-2">
          <Users className="size-4" />
          <span>
            {game?.players?.length} / {game.max_players} players
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name (2-30 characters)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Joining...' : 'Join Game'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
