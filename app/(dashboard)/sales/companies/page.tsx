"use client";

import { useState, useMemo } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { MoreVertical, Calendar, Edit, Trash2 } from "lucide-react";
import { FilterField } from "../../../../components/shared/filter-sheet";
import { useAuthorizedCompanies } from "@/services/kpis/kpis-hooks";
import { Button } from "@/components/ui/button";

// Data interface
export interface CompanyRowData {
  id: number;
  companyName: string;
  location: string;
  phone: string;
  date: string;
}

// Table columns
const columns: Column<CompanyRowData>[] = [
  {
    key: "companyName",
    header: "اسم الشركة",
  },
  {
    key: "location",
    header: "الموقع",
    render: (row) => row.location || "-",
  },
  {
    key: "phone",
    header: "رقم الهاتف",
    render: (row) => row.phone || "-",
  },
  {
    key: "date",
    header: "التاريخ",
    render: (row) => row.date || "-",
  },
  {
    key: "options",
    header: "الخيارات",
    render: (row) => (
      <div className="flex items-center gap-2">
        <Button
          // onClick={() => handleEdit(row.id)}
          variant="outline"
          size="icon"
          title="تعديل"
          className="bg-white hover:bg-[#3675AF]/10"
        >
          <Edit className="size-4 text-[#3675AF] hover:text-[#3675AF]/80 cursor-pointer" />
        </Button>
        <Button
          // onClick={() => handleDelete(row.id)}
          variant="outline"
          size="icon"
          title="حذف"
          className="bg-white hover:bg-[#D32829]/10"
        >
          <Trash2 className="size-4 text-[#D32829] hover:text-[#D32829]/80 cursor-pointer" />
        </Button>
      </div>
    ),
  },
];

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function CompaniesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );

  // Fetch companies from API
  const { data: companiesData, isLoading, error } = useAuthorizedCompanies();

  // Convert API data to TableRowData format
  const tableData = useMemo(() => {
    if (!companiesData) return [];

    return companiesData.map((company) => ({
      id: company.id,
      companyName: company.name,
      location: "", // Not available in API response
      phone: "", // Not available in API response
      date: "", // Not available in API response
    }));
  }, [companiesData]);

  // Calculate pagination
  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = tableData.slice(startIndex, endIndex);

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Define filter fields for companies
  const filterFields: FilterField[] = [
    {
      key: "companyName",
      label: "اسم الشركة",
      type: "input",
      placeholder: "اسم الشركة",
    },
    {
      key: "status",
      label: "الحالة",
      type: "select",
      placeholder: "أختر الحالة من القائمة",
      options: [
        { value: "active", label: "نشط" },
        { value: "inactive", label: "غير نشط" },
        { value: "pending", label: "قيد الانتظار" },
      ],
    },
    {
      key: "delegate",
      label: "المندوب",
      type: "select",
      placeholder: "أختر المندوب من القائمة",
      options: [
        { value: "rep1", label: "مندوب 1" },
        { value: "rep2", label: "مندوب 2" },
      ],
    },
    {
      key: "date",
      label: "التاريخ",
      type: "date",
      placeholder: "__/__/____",
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          جاري التحميل...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 text-muted-foreground">
          حدث خطأ أثناء تحميل البيانات
        </div>
      )}

      {/* Table Section */}
      {!isLoading && !error && (
        <>
          <DataTable
            data={paginatedData}
            columns={columns}
            emptyMessage="لا توجد بيانات للعرض"
            enableFilter
            filterFields={filterFields}
            initialFilters={appliedFilters}
            onApplyFilters={handleApplyFilters}
          />

          {/* Pagination */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </div>
  );
}
