import { GameRoomClient } from '@/components/game/game-room-client';
import { notFound } from 'next/navigation';

export default async function GameRoom({ params }: Readonly<RouteParams>) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <GameRoomClient gameId={id} />
    </div>
  );
}
