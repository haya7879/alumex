"use client";

import { useState, useMemo } from "react";
import {
  TableRowData,
} from "../../../../modules/sales/components/columns";
import FilterSheet, { FilterField } from "../../../../components/shared/filter-sheet";
import { TablePagination } from "@/components/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Folder, Menu, MoreVertical } from "lucide-react";

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

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...tableData];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.customerName.toLowerCase().includes(query) ||
          item.phone.includes(query) ||
          item.lastOfferDate.includes(query) ||
          item.lastOfferPrice.includes(query) ||
          item.receivedOffer.includes(query) ||
          item.response.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (appliedFilters.customerName) {
      filtered = filtered.filter((item) =>
        item.customerName
          .toLowerCase()
          .includes(appliedFilters.customerName.toLowerCase())
      );
    }

    if (appliedFilters.hasPriceOffer) {
      const hasOffer = appliedFilters.hasPriceOffer === "yes";
      filtered = filtered.filter(
        (item) => (item.lastOfferPrice !== "") === hasOffer
      );
    }

    // Add more filter logic as needed

    return filtered;
  }, [searchQuery, appliedFilters]);

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
      {/* Toolbar with Search and Filter */}
      <div className="flex items-center gap-3 justify-between border-b dark:border-gray-700 pb-4">
        <div className="flex items-center gap-3 flex-1">
          <div style={{ width: "250px" }}>
            <Input
              type="text"
              placeholder="البحث"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
              className="max-w-md"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FilterSheet
            fields={filterFields}
            initialFilters={appliedFilters}
            onApplyFilters={handleApplyFilters}
          />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد بيانات للعرض
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredData.map((item, index) => (
            <Card key={index} className="w-full">
              <CardContent className="p-3">
                <div className="flex flex-col gap-3">
                  {/* Customer Name */}
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-sm font-semibold">{item.customerName}</h3>
                    <div className="flex items-center gap-2">
                      <MoreVertical className="size-4 cursor-pointer text-muted-foreground hover:text-foreground" />
                      <Folder className="size-4 cursor-pointer text-muted-foreground hover:text-foreground" />
                      <Menu className="size-4 cursor-pointer text-muted-foreground hover:text-foreground" />
                    </div>
                  </div>
                  
                  {/* Information Grid - Compact Layout */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">رقم الهاتف</p>
                      <p className="text-sm font-medium">{item.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">آخر عرض سعر</p>
                      <p className="text-sm font-medium">{item.lastOfferDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">سعر آخر عرض</p>
                      <p className="text-sm font-medium">{item.lastOfferPrice || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">هل استلم العرض</p>
                      <p className="text-sm font-medium">{item.receivedOffer}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">الرد</p>
                      <p className="text-sm font-medium">{item.response || "-"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <TablePagination
        currentPage={1}
        totalPages={1}
        pageSize={10}
        totalItems={filteredData.length}
        onPageChange={() => {}}
      />
    </div>
  );
}
