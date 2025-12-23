"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export interface ExportButtonProps {
  data?: Record<string, any>[];
  filename?: string;
  columns?: { key: string; header: string }[];
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function ExportButton({
  data,
  filename = "export",
  columns,
  className,
  variant = "outline",
  size = "default",
}: ExportButtonProps) {
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      console.warn("No data to export");
      return;
    }

    // If columns are provided, use them; otherwise, extract from first data row
    const headers = columns
      ? columns.map((col) => col.header)
      : Object.keys(data[0]);

    const keys = columns
      ? columns.map((col) => col.key)
      : Object.keys(data[0]);

    // Convert data to CSV format
    const csvRows: string[] = [];

    // Add headers
    csvRows.push(headers.join(","));

    // Add data rows
    data.forEach((row) => {
      const values = keys.map((key) => {
        const value = row[key];
        // Handle nested objects and arrays
        if (value === null || value === undefined) {
          return "";
        }
        if (typeof value === "object" && !Array.isArray(value)) {
          // For objects, try to extract meaningful values
          if (value.origin && value.branch) {
            return `${value.origin} / ${value.branch}`;
          }
          return JSON.stringify(value);
        }
        if (Array.isArray(value)) {
          return value.join("; ");
        }
        // Escape commas and quotes in CSV
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csvRows.push(values.join(","));
    });

    // Create CSV content
    const csvContent = csvRows.join("\n");

    // Create blob and download
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" }); // BOM for Excel UTF-8 support
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={exportToExcel}
      className={className}
    >
      <Upload className="size-4" />
      {/* <span>تصدير Excel</span> */}
    </Button>
  );
}

