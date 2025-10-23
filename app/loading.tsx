"use client";

import { cn } from "@/lib/utils";

type LoadingProps = {
  className?: string;
};

export default function Loading({ className }: Readonly<LoadingProps>) {
  return (
    <div
      className={cn("flex min-h-screen items-center justify-center", className)}
    >
      <div className="relative size-20 animate-spin">
        <svg
          aria-labelledby="loading-title"
          className="size-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title id="loading-title">Loading...</title>
          {/* Outer ring of the poker chip */}
          <circle
            className="text-primary"
            cx="50"
            cy="50"
            fill="none"
            r="45"
            stroke="currentColor"
            strokeDasharray="70.1 23.4"
            strokeWidth="8"
          />

          {/* Inner details */}
          <circle
            className="text-muted-foreground opacity-50"
            cx="50"
            cy="50"
            fill="none"
            r="35"
            stroke="currentColor"
            strokeWidth="6"
          />

          {/* Decorative patterns */}
          {/** biome-ignore lint/style/noMagicNumbers: The rotation angles are in degrees. */}
          {[0, 60, 120, 180, 240, 300].map((rotation) => (
            <rect
              className="text-primary"
              fill="currentColor"
              height="10"
              key={rotation}
              transform={`rotate(${rotation} 50 50)`}
              width="4"
              x="48"
              y="15"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
