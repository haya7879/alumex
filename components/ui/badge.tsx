import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-[11px] font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success:
          "border-green-200 text-green-700 bg-[#ECFDF3] dark:bg-transparent [&>svg]:text-green-500",
        destructive:
          "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318] [&>svg]:text-[#B42318]",
        error:
          "bg-red-100 text-red-700 dark:bg-transparent dark:border-red-700 dark:border [&>svg]:text-[#B42318]",
        warning:
          "border-yellow-200 bg-yellow-50 text-yellow-700 [&>svg]:text-yellow-500",
        "1:1 Coaching":
          "bg-[#FAECEE] text-[#B94C64] border-none px-2.5 py-1 text-sm",
        "Group coaching":
          "bg-[#EAF5F8] text-[#3894A7] border-none px-2.5 py-1 text-sm",
        groupCoaching:
          "bg-[#EAF5F8] text-[#3894A7] border-none px-1 py-1 text-xs rounded-full",
        oneToOne: "bg-[#FAECEE] text-[#B94C64] border-none px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
