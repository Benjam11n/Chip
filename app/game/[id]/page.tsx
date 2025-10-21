import { notFound } from 'next/navigation';

import { GameRoomClient } from '@/components/game/game-room-client';

export default async function GameRoom({ params }: Readonly<RouteParams>) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  return (
    <div className="min-h-screen">
      <GameRoomClient gameId={id} />
    </div>
  );
}
