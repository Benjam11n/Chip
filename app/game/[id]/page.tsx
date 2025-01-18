import { GameRoomClient } from '@/components/game-room-client';

export default async function GameRoom({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <GameRoomClient gameId={id} />
    </div>
  );
}
