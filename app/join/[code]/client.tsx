'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { JoinForm } from '@/components/game/JoinForm';
import { PlayerList } from '@/components/game/PlayerList';
import { QRCodeSection } from '@/components/game/QRCodeSection';
import { JoinSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameLoader } from '@/hooks/useGameLoader';
import { useJoinForm } from '@/hooks/useJoinForm';
import { ROUTES } from '@/lib/routes';

interface JoinGameClientProps {
  code: string;
}

export const JoinGameClient = ({ code }: Readonly<JoinGameClientProps>) => {
  const router = useRouter();
  const { game, loading, qrCode } = useGameLoader({ code });
  const { form, handleJoin, isSubmitting } = useJoinForm({ game });

  // Copy join link utility
  const copyJoinLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Success', {
        description: 'Join link copied to clipboard',
      });
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to copy link to clipboard',
      });
    }
  };

  // Load current user from localStorage
  useEffect(() => {
    if (!game) return;
    const currentPlayer = localStorage.getItem('currentPlayer');
    if (currentPlayer) {
      const { name } = JSON.parse(currentPlayer);
      const inGame = game?.players?.map((player) => player.name).includes(name);

      if (inGame) {
        router.push(ROUTES.GAME_ROOM(game?.id));
        return;
      }
    }
  }, [game, router]);

  if (loading) {
    return <JoinSkeleton />;
  }

  if (!game) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md px-8 text-center">
          <h1 className="mb-4 text-2xl font-bold">Game Not Found</h1>
          <p className="text-muted-foreground">
            The game code you entered is either incorrect or the game has expired. Games
            automatically expire after 24 hours of inactivity to keep things fresh.
          </p>
          <Button className="mt-6" onClick={() => router.push(ROUTES.JOIN)}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-md space-y-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => router.push(ROUTES.HOME)}
        >
          <ArrowLeft className="size-4" />
          Home
        </Button>
        <Card className="p-6">
          <div className="space-y-6">
            <JoinForm game={game} form={form} onSubmit={handleJoin} isSubmitting={isSubmitting} />
            <QRCodeSection qrCode={qrCode} onCopyLink={copyJoinLink} />
          </div>
        </Card>
        <PlayerList game={game} />
      </div>
    </div>
  );
};
