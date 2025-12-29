"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import ExportButton from "../shared/export-button";
import FilterSheet, { FilterField } from "@/components/shared/filter-sheet";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface Column<T = any> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  showHeader?: boolean;
  // Toolbar props
  enableExport?: boolean;
  exportFilename?: string;
  enableFilter?: boolean;
  filterFields?: FilterField[];
  initialFilters?: Record<string, string>;
  onApplyFilters?: (filters: Record<string, string>) => void;
  enableSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchWidth?: string;
  renderToolbar?: () => ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  headerClassName,
  rowClassName,
  onRowClick,
  emptyMessage = "لا توجد بيانات",
  showHeader = true,
  enableExport = false,
  exportFilename = "export",
  enableFilter = false,
  filterFields,
  initialFilters,
  onApplyFilters,
  enableSearch = false,
  searchValue,
  onSearchChange,
  searchPlaceholder = "البحث",
  searchWidth = "250px",
  renderToolbar,
}: DataTableProps<T>) {
  const getRowClassName = (row: T, index: number): string => {
    if (typeof rowClassName === "function") {
      return rowClassName(row, index);
    }
    return rowClassName || "";
  };

  const showToolbar =
    enableExport || enableFilter || enableSearch || renderToolbar;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  return (
    <div className={cn("overflow-hidden", className)}>
      {showToolbar && (
        <div className="flex items-center gap-3 py-3 justify-start border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            {enableSearch && (
              <div style={{ width: searchWidth }}>
                <Input
                  type="text"
                  placeholder="البحث"
                  value={searchValue || ""}
                  onChange={handleSearchChange}
                  icon={Search}
                  className="max-w-md"
                />
              </div>
            )}
            {renderToolbar && renderToolbar()}
          </div>
          <div className="flex items-center gap-3">
            {enableFilter && filterFields && (
              <FilterSheet
                fields={filterFields}
                initialFilters={initialFilters}
                onApplyFilters={onApplyFilters}
              />
            )}
            {enableExport && (
              <ExportButton
                data={data}
                filename={exportFilename}
                columns={columns.map((col) => ({
                  key: col.key,
                  header: col.header,
                }))}
              />
            )}
          </div>
        </div>
      )}
      <Table>
        {showHeader && (
          <TableHeader>
            <TableRow className={cn(headerClassName)}>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(column.headerClassName)}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-8 text-gray-500 dark:text-gray-400"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={index}
                className={cn(
                  getRowClassName(row, index),
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(row, index)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={cn(column.className)}>
                    {column.render
                      ? column.render(row, index)
                      : (row[column.key] as ReactNode) || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
