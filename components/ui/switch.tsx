"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

type ThemeType = "default" | "primary" | "success" | "orange" | "danger";

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  theme?: ThemeType;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, theme = "default", ...props }, ref) => {
  const getThemeColor = () => {
    switch (theme) {
      case "primary":
        return "data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary/90";
      case "success":
        return "data-[state=checked]:bg-green-500 dark:data-[state=checked]:bg-green-400";
      case "orange":
        return "data-[state=checked]:bg-[#FCB918] dark:data-[state=checked]:bg-[#FCB918]/90";
      case "danger":
        return "data-[state=checked]:bg-[#EF507B] dark:data-[state=checked]:bg-[#EF507B]/90";
      default:
        return "data-[state=checked]:bg-brand-primary dark:data-[state=checked]:bg-brand-primary/90";
    }
  };

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-5 w-[36px] min-w-[36px] py-0.5 cursor-pointer items-center rounded-full border-none transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-muted",
        getThemeColor(),
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background dark:bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4.5 data-[state=unchecked]:translate-x-0.5"
        )}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
