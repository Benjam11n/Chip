import { GameRoomClient } from '@/components/game/game-room-client';

export default async function GameRoom({ params }: Readonly<RouteParams>) {
  const { id } = await params;

  return (
    <div className="bg-background min-h-screen">
      <GameRoomClient gameId={id} />
    </div>
  );
}
