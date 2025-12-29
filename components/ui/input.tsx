import * as React from "react";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Input({
  className,
  icon: Icon,
  type,
  ...props
}: React.ComponentProps<"input"> & {
  icon?: LucideIcon;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <input
        type={type}
        data-slot="input"
        placeholder=""
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-10 w-full min-w-0 rounded-full outline-0 border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      {Icon && (
        <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
    </div>
  );
}

export { Input };
