"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { logger } from "@/lib/logger";
import { ROUTES } from "@/lib/routes";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to your error reporting service
    logger.error(
      {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          digest: error.digest,
        },
      },
      "Global error boundary caught an error"
    );
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-2xl text-destructive">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription>
            We encountered an unexpected error. The issue has been logged and
            our team will look into it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-lg bg-muted p-4">
            <p className="font-mono text-muted-foreground text-sm">
              Error ID:{" "}
              <span className="font-semibold">{error.digest || "unknown"}</span>
            </p>
          </div>
          {process.env.NODE_ENV === "development" && (
            <details className="text-left">
              <summary className="mb-2 cursor-pointer font-medium text-sm">
                Error Details (Dev Only)
              </summary>
              <pre className="max-h-32 overflow-auto rounded bg-muted p-2 text-xs">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={reset}>
            Try Again
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              window.location.href = ROUTES.HOME;
            }}
            variant="outline"
          >
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
