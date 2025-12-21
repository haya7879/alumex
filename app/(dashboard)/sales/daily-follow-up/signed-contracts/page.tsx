"use client";

import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import FilterSheet, {
  FilterField,
} from "../../../../../modules/sales/components/filter-sheet";
import { Calendar } from "lucide-react";
import {
  SignedContractRowData,
  signedContractsColumns,
} from "@/modules/sales/components/columns";

// Sample data based on the image
const tableData: SignedContractRowData[] = [
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    location: "حي النجار",
    representativeName: "م. سجاد حسن",
    contractSigningDate: "23/8/2525",
    totalContractValue: "6,034,124 د.ع",
    totalProjectArea: "25",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    location: "حي النجار",
    representativeName: "م. سجاد حسن",
    contractSigningDate: "23/8/2525",
    totalContractValue: "6,034,124 د.ع",
    totalProjectArea: "30",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    location: "حي النجار",
    representativeName: "م. سجاد حسن",
    contractSigningDate: "23/8/2525",
    totalContractValue: "6,034,124 د.ع",
    totalProjectArea: "80",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    location: "حي النجار",
    representativeName: "م. سجاد حسن",
    contractSigningDate: "23/8/2525",
    totalContractValue: "6,034,124 د.ع",
    totalProjectArea: "45",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    location: "حي النجار",
    representativeName: "م. سجاد حسن",
    contractSigningDate: "23/8/2525",
    totalContractValue: "6,034,124 د.ع",
    totalProjectArea: "70",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    location: "حي النجار",
    representativeName: "م. سجاد حسن",
    contractSigningDate: "23/8/2525",
    totalContractValue: "6,034,124 د.ع",
    totalProjectArea: "25",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    location: "حي النجار",
    representativeName: "م. سجاد حسن",
    contractSigningDate: "23/8/2525",
    totalContractValue: "6,034,124 د.ع",
    totalProjectArea: "45",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    location: "حي النجار",
    representativeName: "م. سجاد حسن",
    contractSigningDate: "23/8/2525",
    totalContractValue: "6,034,124 د.ع",
    totalProjectArea: "25",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    location: "حي النجار",
    representativeName: "م. سجاد حسن",
    contractSigningDate: "23/8/2525",
    totalContractValue: "6,034,124 د.ع",
    totalProjectArea: "45",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    location: "حي النجار",
    representativeName: "م. سجاد حسن",
    contractSigningDate: "23/8/2525",
    totalContractValue: "6,034,124 د.ع",
    totalProjectArea: "25",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    location: "حي النجار",
    representativeName: "م. سجاد حسن",
    contractSigningDate: "23/8/2525",
    totalContractValue: "6,034,124 د.ع",
    totalProjectArea: "30",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    location: "حي النجار",
    representativeName: "م. سجاد حسن",
    contractSigningDate: "23/8/2525",
    totalContractValue: "6,034,124 د.ع",
    totalProjectArea: "25",
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    location: "حي النجار",
    representativeName: "م. سجاد حسن",
    contractSigningDate: "23/8/2525",
    totalContractValue: "6,034,124 د.ع",
    totalProjectArea: "25",
  },
];

export default function SignedContractsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
  };

  // Define filter fields for signed contracts
  const filterFields: FilterField[] = [
    {
      key: "customerName",
      label: "اسم الزبون",
      type: "input",
      placeholder: "ابحث باسم الزبون",
    },
    {
      key: "location",
      label: "الموقع",
      type: "select",
      placeholder: "اختار اجابة من القائمة",
      options: [
        { value: "location1", label: "حي النجار" },
        { value: "location2", label: "موقع 2" },
        { value: "location3", label: "موقع 3" },
      ],
    },
    {
      key: "date",
      label: "التاريخ",
      type: "date",
      placeholder: "---- / -- / --",
      icon: Calendar,
    },
  ];

  // Calculate summary statistics
  const totalContractValue = "56461,56145,45444 د.ع";
  const totalArea = "456784 م2";

  return (
    <div className="space-y-2">
      {/* Filter Section */}
      <FilterSheet
        fields={filterFields}
        initialFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
        title="فلترة العقود الموقعة"
        description="استخدم الحقول التالية لفلترة العقود الموقعة"
      />
      {/* Summary Statistics */}
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-700">
              القيمة الكلية للعقود:
            </h3>
            <p className="text-lg font-bold text-primary">
              {totalContractValue}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-700">
              المساحة الاجمالية:
            </h3>
            <p className="text-lg font-bold text-primary">{totalArea}</p>
          </div>
        </div>
      </div>
      {/* Table Section */}
      <div className="space-y-3">
        <DataTable
          data={tableData}
          columns={signedContractsColumns}
          emptyMessage="لا توجد بيانات للعرض"
        />
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
