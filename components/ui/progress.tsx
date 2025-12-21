"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number;
  indicatorColor?: string;
  trackColor?: string;
}

function Progress({
  className,
  value,
  indicatorColor = "#ADC32D",
  trackColor = "#E4E7EC",
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      style={{ backgroundColor: trackColor }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 transition-all rounded-full"
        style={{ 
          backgroundColor: indicatorColor,
          transform: `translateX(-${100 - (value || 0)}%)` 
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
