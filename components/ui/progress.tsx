"use client";

import { Indicator, Root } from "@radix-ui/react-progress";
import type * as React from "react";

import { cn } from "@/lib/utils";

const MAX_PROGRESS_PERCENT = 100;

const Progress = ({
  className,
  value,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof Root> & {
  ref?: React.RefObject<React.ElementRef<typeof Root> | null>;
}) => (
  <Root
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    ref={ref}
    {...props}
  >
    <Indicator
      className="size-full flex-1 bg-primary transition-all"
      style={{
        transform: `translateX(-${MAX_PROGRESS_PERCENT - (value ?? 0)}%)`,
      }}
    />
  </Root>
);
Progress.displayName = Root.displayName;

export { Progress };
