import { notFound } from 'next/navigation';
import { JoinGameClient } from './client';

export default async function JoinGame({ params }: RouteParams) {
  const { code } = await params;

  if (!code) {
    return notFound();
  }

  return <JoinGameClient code={code} />;
}
