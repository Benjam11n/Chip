import { Button } from "@/components/ui/button";

type GameNotFoundProps = {
  onRetry: () => void;
};

export const GameNotFound = ({ onRetry }: GameNotFoundProps) => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="mx-auto max-w-md px-8 text-center">
      <h1 className="mb-4 font-bold text-2xl">Game Not Found</h1>
      <p className="text-muted-foreground">
        The game url you entered is either incorrect or the game has expired.
        Games automatically expire after 24 hours of inactivity to keep things
        fresh.
      </p>
      <Button className="mt-6" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  </div>
);
