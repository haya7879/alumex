"use client";

import { useState, useMemo } from "react";
import { TableRowData } from "../_components/columns";
import { useForms } from "@/services/sales/sales-hooks";
import { TablePagination } from "@/components/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, MoreVerticalIcon, Copy } from "lucide-react";
import { FaFileAlt, FaCopy } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { toast } from "sonner";
import jsPDF from "jspdf";

// Helper function to format date from API format (YYYY-MM-DD) to display format
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function DailyFollowUpPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch forms from API
  const {
    data: formsData,
    isLoading,
    error,
  } = useForms({
    page: currentPage,
    per_page: 10,
  });

  // Dialog states
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [contractData, setContractData] = useState({
    offerNumber: "",
    offerDate: "",
    contractDuration: "",
  });
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );
  const [hoveredPopoverIndex, setHoveredPopoverIndex] = useState<number | null>(
    null
  );

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
    if (
      !contractData.offerNumber ||
      !contractData.offerDate ||
      !contractData.contractDuration
    ) {
      return;
    }
    console.log(
      "Contract signed for item:",
      selectedItemIndex,
      "Data:",
      contractData
    );
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
    // TODO: Add more details as designed by Osama
    doc.save(`عرض_سعر_${item.customerName}_${Date.now()}.pdf`);
  };

  const handleView = (index: number) => {
    // TODO: Navigate to view page
    console.log("View item:", index);
  };

  const handleEdit = (
    section: "basic" | "followup" | "measurements",
    index: number
  ) => {
    // TODO: Navigate to edit page with section
    console.log("Edit", section, "for item:", index);
  };

  const handleCopySerialNumber = (serialNumber: string) => {
    navigator.clipboard.writeText(serialNumber);
    toast.success("تم نسخ الرقم التسلسلي");
  };

  // Convert API data to TableRowData format
  const tableData = useMemo(() => {
    if (!formsData?.data) return [];

    return formsData.data.map((form) => {
      // Determine if it's original or duplicate based on parent serial
      const isOriginal = form.serials.parent === null;

      // Format quotation price if exists
      const lastOfferPrice = form.quotation
        ? form.quotation.total_value.toLocaleString("en-US")
        : "";

      // Determine received offer status
      const receivedOffer = form.quotation ? "نعم" : "لا";

      // Get response from last follow-up note if exists
      const lastFollowUp =
        form.follow_ups.length > 0
          ? form.follow_ups[form.follow_ups.length - 1].note
          : "";

      return {
        id: form.id,
        customerName: form.form_name,
        serialNumber: form.serials.current,
        entry_date: formatDate(form.entry_date),
        followUp: {
          origin: isOriginal ? ("blue" as const) : ("green" as const),
          branch: "blue",
        },
        // Store additional data for use in dialogs
        formData: form,
      };
    });
  }, [formsData]);

  // Use tableData directly without filtering
  const filteredData = tableData;

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          جاري التحميل...
        </div>
      ) : error ? (
        <div className="text-center py-12 text-muted-foreground">
          حدث خطأ أثناء تحميل البيانات
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد بيانات للعرض
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredData.map((item, index) => (
            <Card key={index} className="w-full">
              <CardContent className="p-2.5">
                <div className="flex flex-col gap-3">
                  {/* Customer Name */}
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-semibold">
                        {item.customerName}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          ({item.serialNumber})
                        </span>
                        <button
                          onClick={() =>
                            handleCopySerialNumber(item.serialNumber)
                          }
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                          title="نسخ الرقم التسلسلي"
                        >
                          <Copy className="size-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="">
                            <MoreVerticalIcon className="size-4 text-[#3675AF] dark:text-white" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              تعديل
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => handleEdit("basic", index)}
                              >
                                المعلومات الأساسية
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit("followup", index)}
                              >
                                برنامج المتابعة
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEdit("measurements", index)
                                }
                              >
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
                          <DropdownMenuItem
                            onClick={() => handleCreatePriceOffer(index)}
                          >
                            إنشاء عرض سعر
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleContractSigned(index)}
                          >
                            <CheckCircle2 className="size-4 ml-2" />
                            تم توقيع العقد
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Information Grid - Compact Layout */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                    {/* التاريخ */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        التاريخ
                      </p>
                      <p className="text-sm font-medium">
                        {item.entry_date}
                      </p>
                    </div>

                    {/* الحالة */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        الحالة
                      </p>
                      {item.formData?.status === "new" ? (
                        <Badge variant="default" className="px-3 py-1">
                          {item.formData?.status}
                        </Badge>
                      ) : item.formData?.status === "in_progress" ? (
                        <Badge variant="warning" className="px-3 py-1">
                          {item.formData?.status}
                        </Badge>
                      ) : item.formData?.status === "completed" ? (
                        <Badge variant="success" className="px-3 py-1">
                          {item.formData?.status}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="px-3 py-1">
                          {item.formData?.status}
                        </Badge>
                      )}
                    </div>

                    {/* أصل / فرع */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        أصل / فرع
                      </p>
                      <div
                        className="flex items-center gap-1"
                        title={
                          item.followUp.origin === "blue"
                            ? "نسخة أصلية"
                            : "نسخة مكررة"
                        }
                      >
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

                    {/* المتابعة */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        المتابعة
                      </p>
                      <Popover
                        open={hoveredPopoverIndex === index}
                        onOpenChange={(open) =>
                          setHoveredPopoverIndex(open ? index : null)
                        }
                      >
                        <PopoverTrigger asChild>
                          <button
                            className="flex items-center gap-1 text-xs font-medium hover:text-primary transition-colors"
                            onMouseEnter={() => setHoveredPopoverIndex(index)}
                          >
                            <FileText className="size-4" />
                            <span>برنامج المتابعة</span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-80"
                          align="start"
                          onMouseEnter={() => setHoveredPopoverIndex(index)}
                          onMouseLeave={() => setHoveredPopoverIndex(null)}
                        >
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">
                              ملاحظات المتابعة
                            </h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {item.formData?.follow_ups &&
                              item.formData.follow_ups.length > 0 ? (
                                item.formData.follow_ups.map(
                                  (
                                    note: {
                                      note: string;
                                      user: string;
                                      date: string;
                                    },
                                    noteIndex: number
                                  ) => (
                                    <div
                                      key={noteIndex}
                                      className="border-b pb-2 last:border-0"
                                    >
                                      <p className="text-sm mb-3">
                                        {note.note}
                                      </p>
                                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{note.user}</span>
                                        <span>{formatDate(note.date)}</span>
                                      </div>
                                    </div>
                                  )
                                )
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  لا توجد ملاحظات
                                </p>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {formsData && (
        <TablePagination
          currentPage={formsData.meta.current_page}
          totalPages={formsData.meta.last_page}
          pageSize={formsData.meta.per_page}
          totalItems={formsData.meta.total}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفض النموذج</DialogTitle>
            <DialogDescription>يرجى إدخال سبب الرفض</DialogDescription>
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
            <DialogDescription>يرجى إدخال معلومات العقد</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="offer-number">رقم العرض</Label>
              <Input
                id="offer-number"
                placeholder="أدخل رقم العرض"
                value={contractData.offerNumber}
                onChange={(e) =>
                  setContractData({
                    ...contractData,
                    offerNumber: e.target.value,
                  })
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
                  setContractData({
                    ...contractData,
                    offerDate: e.target.value,
                  })
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
                  setContractData({
                    ...contractData,
                    contractDuration: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setContractDialogOpen(false);
                setContractData({
                  offerNumber: "",
                  offerDate: "",
                  contractDuration: "",
                });
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
