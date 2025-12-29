import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#3675AF] text-white hover:bg-[#3675AF]/80",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "flex items-center gap-2 dark:bg-gray-900 dark:text-gray-300 border dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-300 bg-white text-gray-600",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        facebook: "bg-[#1877F2] text-white shadow-xs hover:bg-[#1877F2]/90",
        blue: "bg-brand-secondary text-white shadow-xs hover:bg-brand-secondary/90",
        green: "bg-brand-primary text-white shadow-xs hover:bg-brand-primary/90",
        red: " text-[#F04438]",
      },
      size: {
        default: "h-9 w-9 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-10",
        text: "",
      },
      rounded: {
        default: "rounded-full",
        sm: "rounded-md",
        lg: "rounded-lg",
        icon: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

interface CustomButtonProps {
  /** Show loading spinner and disable button */
  isLoading?: boolean;
}

function Button({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  isLoading,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> &
  CustomButtonProps & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        disabled={isLoading || disabled}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, rounded, className }))}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className="animate-spin size-4" />
      )}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
