import JoinGameClient from './client';

interface JoinGamePageProps {
  params: {
    code: string;
  };
}

export default async function JoinGame({ params }: JoinGamePageProps) {
  const { code } = await params;
  return <JoinGameClient code={code} />;
}
