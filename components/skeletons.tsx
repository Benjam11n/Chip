import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';

export const PlayerCardSkeleton = () => {
  return (
    <Card className="p-4">
      <div className="animate-pulse space-y-3">
        <Skeleton className="bg-muted h-4 w-1/3 rounded" />
        <Skeleton className="bg-muted h-6 w-1/2 rounded" />
        <div className="flex gap-2">
          <Skeleton className="bg-muted h-8 w-20 rounded" />
          <Skeleton className="bg-muted h-8 w-20 rounded" />
        </div>
      </div>
    </Card>
  );
};

export const MoveHistorySkeleton = () => {
  return (
    <Card className="p-4">
      <div className="mx-2 mb-4 flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <ScrollArea className="h-[380px] pr-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border-border flex items-center justify-between border-b py-2 last:border-0"
            >
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export const JoinSkeleton = () => {
  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-md space-y-4">
        <Skeleton className="mb-8 h-8 w-1/4" />
        <Skeleton className="h-[580px] w-full" />
      </div>
    </div>
  );
};

export const GameRoomSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="border-border border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div>
            <Skeleton className="mt-3 h-8 w-48" /> {/* Game name */}
            <div className="mt-1">
              <Skeleton className="h-5 w-32" /> {/* Game ID */}
            </div>
          </div>
          <Skeleton className="h-10 w-[120px]" /> {/* Settings button */}
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-3 p-4">
        {/* Mobile View */}
        <div className="block lg:hidden">
          <div className="space-y-6">
            {/* Tab buttons */}
            <div className="grid w-full grid-cols-2 gap-2 rounded-lg border p-1">
              <Skeleton className="h-8 rounded-md" />
              <Skeleton className="h-8 rounded-md" />
            </div>

            {/* Move History Card */}
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* Player Card */}
            <div className="rounded-lg border p-4">
              <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden gap-6 lg:grid lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {/* Move History Card */}
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* Hand Input Card */}
            <div className="rounded-lg border p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>

          {/* Player Cards Column */}
          <div className="grid grid-cols-1 content-start gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Collapsible Buttons */}
        <div className="space-y-3 lg:hidden">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};
