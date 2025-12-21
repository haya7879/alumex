import * as React from "react";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

function InputWithAction({
  className,
  icon,
  type,
  onToggle,
  ...props
}: React.ComponentProps<"input"> & {
  icon?: LucideIcon;
  onToggle?: () => void;
}) {
  const Icon = icon;
  return (
    <div className="relative w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground  placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground  border-border-secondary  flex h-12 w-full min-w-0 rounded-full border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "[&::-webkit-calendar-picker-indicator]:hidden",
          className
        )}
        {...props}
      />
      {Icon && !onToggle && (
        <Icon className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}

      {Icon && onToggle && (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground h-8 w-8"
          onClick={onToggle}
        >
          {Icon && <Icon className="size-4" />}
        </Button>
      )}
    </div>
  );
}

export { InputWithAction };
