import JoinGameClient from './client';

export default async function JoinGame({ params }: RouteParams) {
  const { code } = await params;
  return <JoinGameClient code={code} />;
}
