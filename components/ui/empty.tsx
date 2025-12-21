import * as React from "react";

import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

function Empty({
  className,
  message,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  message?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-40 h-40">
        <Info className="w-24 h-24 text-[#D0D4DD] dark:text-white" />
      </div>
      <p className="text-xs text-[#A1AABA] text-center max-w-[200px]">
        {message || "No data found"}
      </p>
      {children}
    </div>
  );
}

export { Empty };
