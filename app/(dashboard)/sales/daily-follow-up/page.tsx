"use client";

import { useState, useMemo } from "react";
import {
  TableRowData,
} from "../../../../modules/sales/components/columns";
import FilterSheet, { FilterField } from "../../../../components/shared/filter-sheet";
import { TablePagination } from "@/components/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Folder, 
  Menu, 
  MoreVertical, 
  FileText, 
  Eye,
  Edit,
  X,
  FileDown,
  CheckCircle2
} from "lucide-react";
import { FaFileAlt, FaCopy } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import jsPDF from "jspdf";

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

// Sample follow-up notes data
interface FollowUpNote {
  text: string;
  date: string;
  employeeName: string;
}

// Sample data for follow-up notes (in real app, this would come from API)
const sampleFollowUpNotes: Record<number, FollowUpNote[]> = {
  0: [
    {
      text: "تم التواصل مع العميل وطلب خصم إضافي",
      date: "25/8/2025",
      employeeName: "أحمد محمد",
    },
    {
      text: "سيتم إرسال عرض سعر محدث خلال 3 أيام",
      date: "26/8/2025",
      employeeName: "سارة علي",
    },
  ],
  1: [
    {
      text: "العميل ينتظر الموافقة من الإدارة",
      date: "24/8/2025",
      employeeName: "محمد خالد",
    },
  ],
};

export default function DailyFollowUpPage() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog states
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [contractData, setContractData] = useState({
    offerNumber: "",
    offerDate: "",
    contractDuration: "",
  });
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const handleApplyFilters = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Apply filters logic here
  };

  const handleReject = (index: number) => {
    setSelectedItemIndex(index);
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      return;
    }
    console.log("Rejecting item:", selectedItemIndex, "Reason:", rejectReason);
    // TODO: Add API call to reject
    setRejectDialogOpen(false);
    setRejectReason("");
    setSelectedItemIndex(null);
  };

  const handleContractSigned = (index: number) => {
    setSelectedItemIndex(index);
    setContractDialogOpen(true);
  };

  const handleConfirmContract = () => {
    if (!contractData.offerNumber || !contractData.offerDate || !contractData.contractDuration) {
      return;
    }
    console.log("Contract signed for item:", selectedItemIndex, "Data:", contractData);
    // TODO: Add API call to mark as signed
    setContractDialogOpen(false);
    setContractData({ offerNumber: "", offerDate: "", contractDuration: "" });
    setSelectedItemIndex(null);
  };

  const handleCreatePriceOffer = (index: number) => {
    const item = filteredData[index];
    // Create PDF
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("عرض سعر", 14, 20);
    doc.setFontSize(12);
    doc.text(`اسم العميل: ${item.customerName}`, 14, 30);
    doc.text(`رقم الهاتف: ${item.phone}`, 14, 40);
    doc.text(`تاريخ آخر عرض: ${item.lastOfferDate}`, 14, 50);
    doc.text(`سعر آخر عرض: ${item.lastOfferPrice || "غير محدد"}`, 14, 60);
    // TODO: Add more details as designed by Osama
    doc.save(`عرض_سعر_${item.customerName}_${Date.now()}.pdf`);
  };

  const handleView = (index: number) => {
    // TODO: Navigate to view page
    console.log("View item:", index);
  };

  const handleEdit = (section: "basic" | "followup" | "measurements", index: number) => {
    // TODO: Navigate to edit page with section
    console.log("Edit", section, "for item:", index);
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-accent border rounded-sm transition-colors">
                            <Menu className="size-4 text-[#3675AF] dark:text-white" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              تعديل
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => handleEdit("basic", index)}>
                                المعلومات الأساسية
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit("followup", index)}>
                                برنامج المتابعة
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit("measurements", index)}>
                                القياسات
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem 
                            onClick={() => handleReject(index)}
                            variant="destructive"
                          >
                            رفض
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCreatePriceOffer(index)}>
                            إنشاء عرض سعر
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleContractSigned(index)}>
                            <CheckCircle2 className="size-4 ml-2" />
                            تم توقيع العقد
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* Information Grid - Compact Layout */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-3">رقم الهاتف</p>
                      <p className="text-sm font-medium">{item.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-3">آخر عرض سعر</p>
                      <p className="text-sm font-medium">{item.lastOfferDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-3">سعر آخر عرض</p>
                      <p className="text-sm font-medium">{item.lastOfferPrice || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-3">هل استلم العرض</p>
                      <p className="text-sm font-medium">{item.receivedOffer}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-3">الرد</p>
                      <p className="text-sm font-medium">{item.response || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-3">المتابعة</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                            <FileText className="size-4" />
                            <span>برنامج المتابعة</span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="start">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">ملاحظات المتابعة</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {(sampleFollowUpNotes[index] || []).length > 0 ? (
                                sampleFollowUpNotes[index].map((note, noteIndex) => (
                                  <div key={noteIndex} className="border-b pb-2 last:border-0">
                                    <p className="text-sm mb-3">{note.text}</p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                      <span>{note.employeeName}</span>
                                      <span>{note.date}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">لا توجد ملاحظات</p>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-3">أصل / فرع</p>
                      <div className="flex items-center gap-1" title={item.followUp.origin === "blue" ? "نسخة أصلية" : "نسخة مكررة"}>
                        {item.followUp.origin === "blue" ? (
                          <FaFileAlt className="text-base text-blue-500" />
                        ) : (
                          <FaCopy className="text-base text-green-500" />
                        )}
                        <span className="text-sm font-medium">
                          {item.followUp.origin === "blue" ? "أصل" : "مكرر"}
                        </span>
                      </div>
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

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفض النموذج</DialogTitle>
            <DialogDescription>
              يرجى إدخال سبب الرفض
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">سبب الرفض</Label>
              <Textarea
                id="reject-reason"
                placeholder="أدخل سبب الرفض..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                maxLength={500}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason("");
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmReject}
              disabled={!rejectReason.trim()}
            >
              تأكيد الرفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contract Signed Dialog */}
      <Dialog open={contractDialogOpen} onOpenChange={setContractDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تم توقيع العقد</DialogTitle>
            <DialogDescription>
              يرجى إدخال معلومات العقد
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="offer-number">رقم العرض</Label>
              <Input
                id="offer-number"
                placeholder="أدخل رقم العرض"
                value={contractData.offerNumber}
                onChange={(e) =>
                  setContractData({ ...contractData, offerNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offer-date">تاريخ العرض</Label>
              <Input
                id="offer-date"
                type="date"
                value={contractData.offerDate}
                onChange={(e) =>
                  setContractData({ ...contractData, offerDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract-duration">مدة العقد (بالأيام)</Label>
              <Input
                id="contract-duration"
                type="number"
                placeholder="أدخل مدة العقد"
                value={contractData.contractDuration}
                onChange={(e) =>
                  setContractData({ ...contractData, contractDuration: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setContractDialogOpen(false);
                setContractData({ offerNumber: "", offerDate: "", contractDuration: "" });
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmContract}
              disabled={
                !contractData.offerNumber ||
                !contractData.offerDate ||
                !contractData.contractDuration
              }
            >
              تأكيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
