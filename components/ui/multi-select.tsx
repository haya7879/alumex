"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { 
  CheckIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  XIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

type MultiSelectProps = Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>, 'value' | 'onValueChange'> & {
  value?: string[];
  onValueChange?: (value: string[]) => void;
  maxDisplay?: number;
  placeholder?: string;
};

type MultiSelectItemProps = {
  value: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  selected?: boolean;
};

const MultiSelect = React.forwardRef<
  HTMLDivElement,
  MultiSelectProps
>(({ 
  children, 
  value = [], 
  onValueChange, 
  maxDisplay, 
  placeholder = "Select...",
  ...props 
}, ref) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setSelectedValues(value);
  }, [value]);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleValueChange = (newValue: string) => {
    let updatedValues: string[];
    
    if (selectedValues.includes(newValue)) {
      updatedValues = selectedValues.filter((val) => val !== newValue);
    } else {
      updatedValues = [...selectedValues, newValue];
    }

    setSelectedValues(updatedValues);
    onValueChange?.(updatedValues);
  };

  const removeValue = (valueToRemove: string) => {
    const updatedValues = selectedValues.filter((val) => val !== valueToRemove);
    setSelectedValues(updatedValues);
    onValueChange?.(updatedValues);
  };

  const displayValues = maxDisplay && selectedValues.length > maxDisplay
    ? selectedValues.slice(0, maxDisplay)
    : selectedValues;
  
  const remainingCount = selectedValues.length - (maxDisplay || 0);
  const showRemainingBadge = maxDisplay && remainingCount > 0;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "border-input data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-11 w-full items-center justify-between gap-2 rounded-full border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          "flex-wrap"
        )}
      >
        {selectedValues.length > 0 ? (
          <div className="flex flex-wrap gap-1 mr-2">
            {displayValues.map((value) => (
              <div 
                key={value} 
                className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs"
              >
                <span>{value.length > 10 ? value.slice(0, 10) + "..." : value}</span>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    removeValue(value);
                  }}
                  className="hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full cursor-pointer"
                >
                  <XIcon className="size-3" />
                </div>
              </div>
            ))}
            {showRemainingBadge && (
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs">
                +{remainingCount}
              </div>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDownIcon className="size-4 opacity-50 ml-auto" />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md max-h-60 overflow-auto">
          <div className="p-1">
            {React.Children.map(children, (child) => {
              if (!React.isValidElement<MultiSelectItemProps>(child)) return null;
              
              return React.cloneElement(child, {
                onClick: (e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleValueChange(child.props.value);
                },
                selected: selectedValues.includes(child.props.value)
              });
            })}
          </div>
        </div>
      )}
    </div>
  );
});

MultiSelect.displayName = "MultiSelect";

const MultiSelectItem = ({
  value,
  children,
  onClick,
  selected
}: MultiSelectItemProps) => {
  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground",
        selected && "bg-accent text-accent-foreground"
      )}
      onClick={onClick}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        {selected && <CheckIcon className="size-4" />}
      </span>
      <span>{children}</span>
    </div>
  );
};

MultiSelectItem.displayName = "MultiSelectItem";

export { MultiSelect, MultiSelectItem }; 