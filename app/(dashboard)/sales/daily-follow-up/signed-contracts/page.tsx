"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { signedContractsColumns } from "@/app/(dashboard)/sales/_components/columns/columns";
import { useContracts } from "@/services/sales/sales-hooks";
import { ContractData } from "@/services/sales/sales-services";
import { useDateConverter } from "@/hooks/use-date-converter";

export default function SignedContractsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");

  // Date converter hook
  const { formatDate } = useDateConverter();

  // Fetch contracts from API
  const { data: contractsData, isLoading, error } = useContracts({
    page: currentPage,
    per_page: pageSize,
  });

  // Convert API data to SignedContractRowData format
  const tableData = useMemo(() => {
    if (!contractsData?.data) return [];

    return contractsData.data.map((contract: ContractData) => ({
      customerName: contract.form_name || "-",
      location: contract.address || "-",
      representativeName: contract.sales_agent || "-",
      contractSigningDate: contract.contract_date ? formatDate(contract.contract_date) : "-",
      totalContractValue: contract.total_amount != null
        ? `${Number(contract.total_amount).toLocaleString()} د.ع`
        : "-",
      totalProjectArea: contract.total_area_m2 != null
        ? String(contract.total_area_m2)
        : "-",
    }));
  }, [contractsData, formatDate]);

  return (
    <>
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
            data={tableData}
            columns={signedContractsColumns}
            emptyMessage="لا توجد بيانات للعرض"
            enableExport
            exportFilename="signed-contracts"
            enableSearch
            searchValue={searchQuery}
            onSearchChange={(value) => {
              setSearchQuery(value);
              console.log("Search Query:", value);
            }}
            searchPlaceholder="Search"
            searchWidth="250px"
          />
          {contractsData?.meta && (
            <TablePagination
              currentPage={contractsData.meta.current_page}
              totalPages={contractsData.meta.last_page}
              pageSize={contractsData.meta.per_page}
              totalItems={contractsData.meta.total}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}
    </>
  );
}
