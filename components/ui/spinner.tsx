import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const spinnerVariants = cva("flex-shrink-0 animate-spin", {
  variants: {
    variant: {
      default: "text-base-white",
      destructive: "text-[#F04438]",
      success: "text-green-700",
    },
    size: {
      default: "size-4",
      sm: "size-3",
      md: "size-6",
      lg: "size-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

function Spinner({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof Loader2> &
  VariantProps<typeof spinnerVariants>) {
  return (
    <Loader2
      className={cn(spinnerVariants({ size, variant, className }))}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };
