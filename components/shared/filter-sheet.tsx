"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X, LucideIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";

export type FilterFieldType = "input" | "select" | "date";

export interface FilterFieldOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  icon?: LucideIcon;
  options?: FilterFieldOption[];
  defaultValue?: string;
}

export interface FilterSheetProps {
  fields?: FilterField[];
  initialFilters?: Record<string, string>;
  onApplyFilters?: (filters: Record<string, string>) => void;
  title?: string;
  description?: string;
  buttonText?: string;
  triggerClassName?: string;
}

export default function FilterSheet({
  fields,
  initialFilters = {},
  onApplyFilters,
  title = "فلترة البيانات",
  description = "استخدم الحقول التالية لفلترة البيانات",
  buttonText = "فلترة",
  triggerClassName,
}: FilterSheetProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Initialize filters from fields and initialFilters
  const initializeFilters = () => {
    const defaultFilters: Record<string, string> = {};
    fields?.forEach((field) => {
      defaultFilters[field.key] = initialFilters[field.key] || field.defaultValue || "";
    });
    return defaultFilters;
  };

  const [filters, setFilters] = useState(initializeFilters);

  // Update filters when initialFilters or fields change
  useEffect(() => {
    setFilters(initializeFilters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleGetResults = () => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    setFilters(initializeFilters());
  };

  const renderField = (field: FilterField) => {
    const Icon = field.icon;
    
    switch (field.type) {
      case "input":
      case "date":
        return (
          <Input
            id={field.key}
            type={field.type === "date" ? "text" : "text"}
            placeholder={field.placeholder}
            value={filters[field.key] || ""}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
            icon={Icon}
            className="w-full"
          />
        );
      case "select":
        return (
          <Select
            value={filters[field.key] || ""}
            onValueChange={(value) => handleFilterChange(field.key, value)}
          >
            <SelectTrigger id={field.key} className="w-full">
              <SelectValue placeholder={field.placeholder || "اختار اجابة من القائمة"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-end">
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className={triggerClassName || "gap-2"}>
            <Filter className="size-4" />
            {/* {buttonText} */}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-full sm:max-w-md overflow-y-auto"
        >
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>{title}</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <X className="size-4" />
                </Button>
              </SheetClose>
            </div>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            {fields?.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label
                  htmlFor={field.key}
                  className="text-xs font-medium"
                >
                  {field.label}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-start gap-2">
            <Button onClick={handleGetResults} className="min-w-[100px]">
              فلترة
            </Button>
            <SheetClose asChild>
              <Button variant="outline" className="min-w-[100px]">
                إلغاء
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
