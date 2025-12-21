"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  onValueChange?: (values: number[]) => void;
  min?: number | string;
  max?: number | string;
  step?: number | string;
}) {
  const numericMin = typeof min === "string" ? parseFloat(min) : min;
  const numericMax = typeof max === "string" ? parseFloat(max) : max;
  const numericStep = typeof step === "string" ? parseFloat(step) : step;

  const midpoint = React.useMemo(
    () => numericMin + (numericMax - numericMin) / 2,
    [numericMin, numericMax]
  );

  const [internalValue, setInternalValue] = React.useState<number[]>(() => {
    let initialValues: number[] = [];

    if (Array.isArray(value)) {
      initialValues = [
        Math.min(value[0], midpoint),
        Math.max(value[1], midpoint),
      ];
    } else if (Array.isArray(defaultValue)) {
      initialValues = [
        Math.min(defaultValue[0], midpoint),
        Math.max(defaultValue[1], midpoint),
      ];
    } else {
      initialValues = [numericMin, numericMax];
    }

    return initialValues;
  });

  const handleValueChange = (newValues: number[]) => {
    if (newValues.length === 2) {
      const constrained = [
        Math.min(newValues[0], midpoint),
        Math.max(newValues[1], midpoint),
      ];

      setInternalValue(constrained);
      onValueChange?.(constrained);
    }
  };

  React.useEffect(() => {
    if (Array.isArray(value)) {
      setInternalValue([
        Math.min(value[0], midpoint),
        Math.max(value[1], midpoint),
      ]);
    }
  }, [value, midpoint]);

  return (
    <div className="pt-4 relative">
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={internalValue}
        value={internalValue}
        min={numericMin}
        max={numericMax}
        step={numericStep}
        onValueChange={handleValueChange}
        className={cn(
          "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "bg-gray-50 relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              "bg-brand-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
            )}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          data-range={
            typeof min === "string" && (min as string).includes("%")
              ? `${internalValue[0]}%`
              : internalValue[0].toString().padStart(2, "0")
          }
          data-slot="slider-thumb"
          className="border-brand-primary bg-background ring-brand-primary/60 block size-6 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 relative after:absolute after:top-[120%] after:w-full after:h-full after:z-100 after:content-[attr(data-range)] after:text-sm after:font-medium"
        />
        <SliderPrimitive.Thumb
          data-range={
            typeof max === "string" && (max as string).includes("%")
              ? `${internalValue[1]}%`
              : internalValue[1].toString().padStart(2, "0")
          }
          data-slot="slider-thumb"
          className="border-brand-primary bg-background ring-brand-primary/60 block size-6 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 relative after:absolute after:top-[120%] after:w-full after:h-full after:z-100 after:content-[attr(data-range)] after:text-sm after:font-medium"
        />
      </SliderPrimitive.Root>
    </div>
  );
}

export { Slider };
