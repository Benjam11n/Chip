import { GameRoomClient } from '@/components/game-room-client';

export default async function GameRoom({ params }: RouteParams) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <GameRoomClient gameId={id} />
    </div>
  );
}
