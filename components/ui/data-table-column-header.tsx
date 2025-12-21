import * as React from "react";

import { Column } from "@tanstack/react-table";
import { ChevronDown, ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Info12Regular, ArrowSort16Regular } from "@fluentui/react-icons";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  description?: string;
  type?: "default" | "filter";
  options?: {
    label: string;
    value: string;
  }[];
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  description,
  type = "default",
  options,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);
  const isSorted = column.getIsSorted();

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);
  const isFiltered = selectedValues.size > 0;

  if (description && type !== "filter") {
    return (
      <div className={cn("flex items-center gap-1.5 group", className)}>
        <div
          className="flex items-center gap-1.5 cursor-pointer"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          <span className="text-gray-500 font-medium">{title}</span>
          <ArrowSort16Regular
            className={cn(
              "size-4 transition-opacity",
              isSorted ? "opacity-100" : "opacity-0 group-hover:opacity-70"
            )}
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info12Regular className="cursor-pointer size-4 text-gray-400 hover:text-gray-600 transition-colors" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  if (type === "filter") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-1.5">
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex h-8 items-center gap-1.5 px-2 py-1 hover:bg-muted/50 data-[state=open]:bg-muted/50",
                isFiltered && "text-primary font-medium"
              )}
            >
              <span>{title}</span>
              {isFiltered && (
                <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                  {selectedValues.size}
                </span>
              )}
              <ChevronDown className="size-4 opacity-70" />
            </Button>
          </PopoverTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info12Regular className="cursor-pointer size-4 text-gray-400 hover:text-gray-600 transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <PopoverContent className="p-0 w-[220px]" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>No options available</CommandEmpty>
              <CommandGroup>
                {options?.map((option) => {
                  const isSelected = selectedValues.has(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        if (isSelected) {
                          selectedValues.delete(option.value);
                        } else {
                          selectedValues.add(option.value);
                        }
                        const filterValues = Array.from(selectedValues);
                        column?.setFilterValue(
                          filterValues.length ? filterValues : undefined
                        );
                      }}
                      className="flex items-center gap-2 px-2 py-1.5"
                    >
                      <Checkbox
                        checked={isSelected}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="flex-1">{option.label}</span>
                      {facets?.get(option.value) && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 font-mono text-xs">
                          {facets.get(option.value)}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        column?.setFilterValue(undefined);
                        setOpen(false);
                      }}
                      className="justify-center text-center text-sm text-muted-foreground hover:text-foreground"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex h-8 items-center gap-1.5 px-2 py-1 hover:bg-muted/50 data-[state=open]:bg-muted/50",
        className
      )}
      onClick={() => column.toggleSorting(isSorted === "asc")}
    >
      <span className="text-gray-500">{title}</span>
      <ArrowUpDown
        className={cn(
          "size-4 transition-opacity",
          isSorted ? "opacity-100" : "opacity-50"
        )}
      />
    </Button>
  );
}
