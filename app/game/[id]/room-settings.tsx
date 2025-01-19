'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Share2, Copy, QrCode, UserMinus } from 'lucide-react';
import QRCode from 'qrcode';
import { Player } from '@/app/types';
import { toast } from 'sonner';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { SheetFooter } from '@/components/ui/sheet';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface RoomSettingsProps {
  gameId: string;
  gameCode: string;
  players: Player[];
  currentUsername: string;
  onKickPlayer: (playerId: string) => void;
}

export function RoomSettings({
  gameId,
  gameCode,
  players,
  currentUsername,
  onKickPlayer,
}: RoomSettingsProps) {
  const router = useRouter();
  const [qrCode, setQrCode] = useState<string>('');
  const [showQR, setShowQR] = useState(false);

  const roomUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/join/${gameCode}`
      : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Poker Game',
          text: 'Join my poker game!',
          url: roomUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomUrl);
    toast('Link copied', {
      description: 'Room link copied to clipboard',
    });
  };

  const handleShowQR = async () => {
    if (!qrCode) {
      try {
        const code = await QRCode.toDataURL(roomUrl, {
          errorCorrectionLevel: 'M',
          margin: 2,
          width: 256,
        });
        setQrCode(code);
      } catch (err) {
        console.error('QR generation error:', err);
      }
    }
    setShowQR(true);
  };

  const handleEndGame = async (gameId: string) => {
    try {
      await supabase.rpc('set_config', {
        key: 'app.current_game_id',
        value: gameId,
      });

      const { error } = await supabase.from('games').delete().eq('id', gameId);

      if (error) throw error;
      toast.success('Success', { description: 'Game ended successfully' });

      localStorage.removeItem('currentPlayer');
      router.push('/');
    } catch (error) {
      toast.error(
        'Error ending game: ' + (error instanceof Error ? error.message : error)
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="flex-1" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Room
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleCopyLink}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
      </div>
      <div className="flex">
        <Dialog open={showQR} onOpenChange={setShowQR}>
          <DialogTrigger asChild>
            <Button variant="default" className="flex-1" onClick={handleShowQR}>
              <QrCode className="h-4 w-4 mr-2" />
              Show QR
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Room QR Code</DialogTitle>
            </DialogHeader>
            {qrCode && (
              <div className="flex justify-center p-4">
                <Image
                  width={256}
                  height={256}
                  src={qrCode}
                  alt="Room QR Code"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Players</h3>
            <span className="text-sm text-muted-foreground">
              {players.length} players
            </span>
          </div>
          <div className="divide-y">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{player.name}</span>
                  {player.name === currentUsername && (
                    <Badge className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      You
                    </Badge>
                  )}
                </div>
                {player.name !== currentUsername && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <UserMinus className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Kick Player</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to kick {player.name} from the
                          game? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onKickPlayer(player.id)}
                        >
                          Kick Player
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <SheetFooter className="absolute inset-x-0 bottom-0 mt-6 flex-col p-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">End game</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End Game</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to end the game for all players? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleEndGame(gameId)}>
                End
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetFooter>
    </div>
  );
}
