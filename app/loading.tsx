'use client';

import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
}

export default function Loading({ className }: Readonly<LoadingProps>) {
  return (
    <div className={cn('flex min-h-screen items-center justify-center', className)}>
      <div className="relative size-20 animate-spin">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="size-full">
          {/* Outer ring of the poker chip */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="70.1 23.4"
            className="text-primary"
          />

          {/* Inner details */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted-foreground opacity-50"
          />

          {/* Decorative patterns */}
          {[0, 60, 120, 180, 240, 300].map((rotation) => (
            <rect
              key={rotation}
              x="48"
              y="15"
              width="4"
              height="10"
              fill="currentColor"
              className="text-primary"
              transform={`rotate(${rotation} 50 50)`}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
