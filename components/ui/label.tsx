"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const labelVariants = cva(
  "text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  hasInfo?: boolean;
  infoText?: string;
  isPaddingLeft?: boolean;
  parentClassName?: string;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(
  (
    {
      className,
      hasInfo,
      infoText,
      children,
      parentClassName,
      isPaddingLeft = false,
      ...props
    },
    ref
  ) => (
    <div
      className={cn(
        "flex items-center gap-1.5",
        isPaddingLeft && "ps-3",
        parentClassName
      )}
    >
      <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
      >
        {children}
      </LabelPrimitive.Root>

      {hasInfo && infoText && (
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>{infoText}</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
