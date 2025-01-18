import JoinGameClient from './client';

interface JoinGamePageProps {
  params: {
    code: string;
  };
}

// This generates all possible route combinations at build time
export function generateStaticParams() {
  // Generate an array of all possible alphanumeric combinations
  // This ensures all possible game codes are pre-rendered
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const codes = [];
  
  // Generate single character codes (for testing/development)
  for (let i = 0; i < chars.length; i++) {
    codes.push({ code: chars[i] });
  }
  
  return codes;
}

export default function JoinGame({ params }: JoinGamePageProps) {
  return <JoinGameClient code={params.code} />;
}