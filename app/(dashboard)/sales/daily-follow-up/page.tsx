"use client";

import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import {
  columns,
  TableRowData,
} from "../../../../modules/sales/components/columns";
import { FilterField } from "../../../../modules/sales/components/filter-sheet";
import { TablePagination } from "@/components/table";

// Sample data based on the image
const tableData: TableRowData[] = [
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    lastOfferDate: "23/8/2525",
    lastOfferPrice: "450,000",
    receivedOffer: "نعم",
    response: "طلب خصم",
    followUp: { origin: "blue" as const, branch: "blue" },
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    lastOfferDate: "23/8/2525",
    lastOfferPrice: "450,000",
    receivedOffer: "نعم",
    response: "طلب خصم",
    followUp: { origin: "blue" as const, branch: "blue" },
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    lastOfferDate: "23/8/2525",
    lastOfferPrice: "450,000",
    receivedOffer: "نعم",
    response: "طلب خصم",
    followUp: { origin: "blue" as const, branch: "blue" },
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    lastOfferDate: "23/8/2525",
    lastOfferPrice: "450,000",
    receivedOffer: "نعم",
    response: "طلب خصم",
    followUp: { origin: "blue" as const, branch: "blue" },
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    lastOfferDate: "23/8/2525",
    lastOfferPrice: "450,000",
    receivedOffer: "نعم",
    response: "طلب خصم",
    followUp: { origin: "blue" as const, branch: "blue" },
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    lastOfferDate: "23/8/2525",
    lastOfferPrice: "450,000",
    receivedOffer: "نعم",
    response: "طلب خصم",
    followUp: { origin: "blue" as const, branch: "blue" },
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    lastOfferDate: "23/8/2525",
    lastOfferPrice: "450,000",
    receivedOffer: "نعم",
    response: "طلب خصم",
    followUp: { origin: "blue" as const, branch: "blue" },
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    lastOfferDate: "23/8/2525",
    lastOfferPrice: "",
    receivedOffer: "لا",
    response: "",
    followUp: { origin: "green" as const, branch: "blue" },
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    lastOfferDate: "23/8/2525",
    lastOfferPrice: "450,000",
    receivedOffer: "نعم",
    response: "طلب خصم",
    followUp: { origin: "blue" as const, branch: "blue" },
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    lastOfferDate: "23/8/2525",
    lastOfferPrice: "",
    receivedOffer: "لا",
    response: "",
    followUp: { origin: "green" as const, branch: "blue" },
  },
  {
    customerName: "شركة اليد البناء م. عباس المحترم اين",
    phone: "07 705582933",
    lastOfferDate: "23/8/2525",
    lastOfferPrice: "450,000",
    receivedOffer: "نعم",
    response: "طلب خصم",
    followUp: { origin: "blue" as const, branch: "blue" },
  },
];

export default function DailyFollowUpPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  // Define filter fields for daily follow-up
  const filterFields: FilterField[] = [
    {
      key: "customerName",
      label: "اسم الزبون",
      type: "input",
      placeholder: "ابحث باسم الزبون",
    },
    {
      key: "hasPriceOffer",
      label: "هل يوجد عرض سعر ؟",
      type: "select",
      placeholder: "اختار اجابة من القائمة",
      options: [
        { value: "yes", label: "نعم" },
        { value: "no", label: "لا" },
      ],
    },
    {
      key: "approvedCompanies",
      label: "الشركات المعتمدة",
      type: "select",
      placeholder: "أختر الشركة من القائمة",
      options: [
        { value: "company1", label: "شركة 1" },
        { value: "company2", label: "شركة 2" },
      ],
    },
    {
      key: "serialNumber",
      label: "الرقم التسلسلي",
      type: "input",
      defaultValue: "7895-5645",
    },
    {
      key: "originBranch",
      label: "الاصل / الفرع",
      type: "select",
      placeholder: "اختار اجابة من القائمة",
      options: [
        { value: "origin", label: "أصل" },
        { value: "branch", label: "فرع" },
      ],
    },
    {
      key: "representative",
      label: "المندوب",
      type: "select",
      placeholder: "اختار اجابة من القائمة",
      options: [
        { value: "rep1", label: "مندوب 1" },
        { value: "rep2", label: "مندوب 2" },
      ],
    },
  ];

  return (
    <div className="space-y-6">

      <DataTable
        data={tableData}
        columns={columns}
        emptyMessage="لا توجد بيانات للعرض"
        enableExport
        exportFilename="daily-follow-up"
        enableFilter
        filterFields={filterFields}
        initialFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
        enableSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search"
        searchWidth="250px"
      />
      <TablePagination
        currentPage={1}
        totalPages={1}
        pageSize={10}
        totalItems={10}
        onPageChange={() => {}}
      />
    </div>
  );
}
