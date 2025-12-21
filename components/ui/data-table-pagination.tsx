import { Table } from "@tanstack/react-table";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    table.setPageIndex(page - 1);
  };

  const renderPageButtons = () => {
    if (totalPages <= 0) return null;

    const pages = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show

    // Always show first page
    pages.push(
      <Button
        key="page-1"
        variant={currentPage === 1 ? "default" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => goToPage(1)}
      >
        1
      </Button>
    );

    // Calculate range of pages to display
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust range to show more pages when at the beginning or end
    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 2);
    }

    // Show ellipsis before middle pages if needed
    if (startPage > 2) {
      pages.push(
        <div key="ellipsis-1" className="px-2">
          ...
        </div>
      );
    }

    // Show middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={`page-${i}`}
          variant={currentPage === i ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => goToPage(i)}
        >
          {i}
        </Button>
      );
    }

    // Show ellipsis after middle pages if needed
    if (endPage < totalPages - 1) {
      pages.push(
        <div key="ellipsis-2" className="px-2">
          ...
        </div>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(
        <Button
          key={`page-${totalPages}`}
          variant={currentPage === totalPages ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => goToPage(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center space-x-2">{renderPageButtons()}</div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
