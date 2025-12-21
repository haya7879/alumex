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
}: DataTableProps<T>) {
  const getRowClassName = (row: T, index: number): string => {
    if (typeof rowClassName === "function") {
      return rowClassName(row, index);
    }
    return rowClassName || "";
  };

  return (
    <div className={cn("bg-white rounded-lg overflow-hidden", className)}>
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
                className="text-center py-8 text-gray-500"
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
