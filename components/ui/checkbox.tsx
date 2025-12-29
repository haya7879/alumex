"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeType = "default" | "primary" | "blue" | "warning" | "danger";

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  theme?: ThemeType;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, theme = "default", ...props }, ref) => {
  const getThemeColor = () => {
    switch (theme) {
      case "primary":
        return "data-[state=checked]:bg-[#3675AF] data-[state=checked]:border-[#3675AF]";
      case "blue":
        return "data-[state=checked]:bg-[#3675AF] data-[state=checked]:border-[#3675AF]";
      case "warning":
        return "data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500";
      case "danger":
        return "data-[state=checked]:bg-[#EF507B] data-[state=checked]:border-[#EF507B]";
      default:
        return "data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary";
    }
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-[#3675AF] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-[#3675AF] group",
        getThemeColor(),
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
