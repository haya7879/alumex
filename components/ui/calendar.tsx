"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onApply?: () => void;
  onCancel?: () => void;
  onToday?: () => void;
  selectedValue?: string;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onApply,
  onCancel,
  onToday,
  selectedValue,
  ...props
}: CalendarProps) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-2 p-4 pb-0">
        <Button
          variant="outline"
          onClick={onToday}
          className="w-full"
          size="sm"
        >
          {selectedValue || "Select date"}
        </Button>
        <Button
          variant="outline"
          onClick={onToday}
          className="w-full"
          size="sm"
        >
          Today
        </Button>
      </div>
      <div className="p-4">
        <DayPicker
          defaultMonth={new Date()}
          showOutsideDays={showOutsideDays}
          className={cn("p-0", className)}
          classNames={{
            months: "flex flex-col sm:flex-row gap-2",
            month: "flex flex-col gap-4",
            caption: "flex justify-center pt-1 relative items-center w-full",
            caption_label: "text-sm font-medium",
            nav: "flex items-center justify-center gap-1",
            nav_button: cn(
              buttonVariants({ variant: "outline" }),
              "size-8 bg-transparent p-0 opacity-50 hover:opacity-100"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-x-1",
            head_row: "flex",
            head_cell: "text-gray-600 rounded-full w-10 font-medium text-sm",
            row: "flex w-full mt-2",
            cell: cn(
              "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
              props.mode === "range"
                ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                : "[&:has([aria-selected])]:rounded-full"
            ),
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "size-10 p-0 font-normal aria-selected:opacity-100"
            ),
            day_range_start: "bg-brand-primary text-base-white",
            day_range_end: "bg-brand-primary text-base-white",
            day_selected: "bg-brand-primary text-base-white",
            day_today:
              "text-gray-600 relative before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:size-1  before:bg-gray-600 before:rounded-full",
            day_outside: "text-gray-600 opacity-50",
            day_disabled: "text-gray-600 opacity-50",
            day_range_middle: "bg-accent text-gray-600",
            day_hidden: "invisible",
            ...classNames,
          }}
          components={{
            IconLeft: ({ className, ...props }) => (
              <ChevronLeft
                className={cn("size-4 text-gray-500", className)}
                {...props}
              />
            ),
            IconRight: ({ className, ...props }) => (
              <ChevronRight
                className={cn("size-4 text-gray-500", className)}
                {...props}
              />
            ),
          }}
          {...props}
        />
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-3 p-4">
        <Button variant="outline" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="default" className="w-full" onClick={onApply}>
          Apply
        </Button>
      </div>
    </div>
  );
}

export { Calendar };
