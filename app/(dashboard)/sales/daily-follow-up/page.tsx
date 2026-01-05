"use client";

import { useState, useMemo, useEffect } from "react";
import { TableRowData } from "../_components/columns";
import { useForms, useCreateContract, useCreateQuotation, useSections } from "@/services/sales/sales-hooks";
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
import { Calendar } from "@/components/ui/calendar";
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
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

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

  // Create contract mutation
  const createContractMutation = useCreateContract();
  const createQuotationMutation = useCreateQuotation();
  const queryClient = useQueryClient();
  
  // Fetch sections for quotation dialog
  const { data: sectionsData } = useSections();

  // Dialog states
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [quotationDialogOpen, setQuotationDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [contractDate, setContractDate] = useState("");
  const [contractCalendarOpen, setContractCalendarOpen] = useState(false);
  const [selectedContractDate, setSelectedContractDate] = useState<Date | undefined>(undefined);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );
  const [hoveredPopoverIndex, setHoveredPopoverIndex] = useState<number | null>(
    null
  );
  const [sectionPrices, setSectionPrices] = useState<Record<number, number>>({});

  // Helper function to format date from Date object to DD/MM/YYYY
  const formatDateToDisplay = (date: Date | undefined): string => {
    if (!date) return "";
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to parse date from DD/MM/YYYY string to Date object
  const parseDateFromString = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    // Try DD/MM/YYYY format first
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    // Try YYYY-MM-DD format (from HTML date input)
    const parts2 = dateString.split("-");
    if (parts2.length === 3) {
      const [year, month, day] = parts2;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return undefined;
  };

  // Helper function to convert date from DD/MM/YYYY to YYYY-MM-DD
  const convertDateToAPIFormat = (dateString: string): string => {
    if (!dateString) return "";
    
    // If already in YYYY-MM-DD format, return as is
    if (dateString.includes("-") && dateString.split("-").length === 3) {
      const [year, month, day] = dateString.split("-");
      // Validate and ensure proper format
      if (year && month && day && year.length === 4) {
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
      return dateString;
    }
    
    // Convert from DD/MM/YYYY to YYYY-MM-DD
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    
    return dateString;
  };

  // Handle contract date selection from calendar
  const handleContractDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedContractDate(date);
      const formattedDate = formatDateToDisplay(date);
      setContractDate(formattedDate);
      setContractCalendarOpen(false);
    }
  };

  // Update selectedContractDate when contractDate changes
  useEffect(() => {
    if (contractDate) {
      const parsedDate = parseDateFromString(contractDate);
      setSelectedContractDate(parsedDate);
    }
  }, [contractDate]);

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

  const handleConfirmContract = async () => {
    if (!contractDate.trim()) {
      toast.error("يرجى إدخال تاريخ التوقيع");
      return;
    }

    if (selectedItemIndex === null) {
      toast.error("خطأ: لم يتم تحديد النموذج");
      return;
    }

    const formId = filteredData[selectedItemIndex]?.id;
    if (!formId) {
      toast.error("خطأ: لم يتم العثور على معرف النموذج");
      return;
    }

    try {
      const requestBody = {
        form_id: formId,
        contract_date: convertDateToAPIFormat(contractDate),
      };

      await createContractMutation.mutateAsync(requestBody);
      
      // Invalidate forms query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      
      toast.success("تم إنشاء العقد بنجاح");
      setContractDialogOpen(false);
      setContractDate("");
      setSelectedContractDate(undefined);
      setSelectedItemIndex(null);
    } catch (error: unknown) {
      const errorMessage = 
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "حدث خطأ أثناء إنشاء العقد";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleCreatePriceOffer = (index: number) => {
    setSelectedItemIndex(index);
    // Initialize section prices with empty values
    const initialPrices: Record<number, number> = {};
    if (sectionsData) {
      sectionsData.forEach((section) => {
        initialPrices[section.id] = 0;
      });
    }
    setSectionPrices(initialPrices);
    setQuotationDialogOpen(true);
  };

  const handleConfirmQuotation = async () => {
    if (selectedItemIndex === null) {
      toast.error("خطأ: لم يتم تحديد النموذج");
      return;
    }

    const formId = filteredData[selectedItemIndex]?.id;
    if (!formId) {
      toast.error("خطأ: لم يتم العثور على معرف النموذج");
      return;
    }

    // Validate that at least one section has a price
    const sectionsWithPrices = Object.entries(sectionPrices)
      .filter(([_, price]) => price > 0)
      .map(([sectionId, price]) => ({
        section_id: parseInt(sectionId),
        price_per_meter: price,
      }));

    if (sectionsWithPrices.length === 0) {
      toast.error("يرجى إدخال سعر لقطاع واحد على الأقل");
      return;
    }

    try {
      const requestBody = {
        form_id: formId,
        confirmed: true,
        sections_prices: sectionsWithPrices,
      };

      await createQuotationMutation.mutateAsync(requestBody);
      
      // Invalidate forms query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      
      toast.success("تم إنشاء عرض السعر بنجاح");
      setQuotationDialogOpen(false);
      setSectionPrices({});
      setSelectedItemIndex(null);
    } catch (error: unknown) {
      const errorMessage = 
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "حدث خطأ أثناء إنشاء عرض السعر";
      toast.error(errorMessage);
      console.error(error);
    }
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
      const lastOfferPrice = form.quotation && form.quotation.total_value != null
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
                      <p className="text-sm font-medium">{item.entry_date}</p>
                    </div>

                    {/* الحالة */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        الحالة
                      </p>
                      {item.formData?.status === "new" ? (
                        <Badge variant="default" className="px-3 py-1">
                          جديد
                        </Badge>
                      ) : item.formData?.status === "quoted" ? (
                        <Badge variant="warning" className="px-3 py-1">
                          تحول لعرض سعر
                        </Badge>
                      ) : item.formData?.status === "contracted" ? (
                        <Badge variant="success" className="px-3 py-1">
                          تم توقيع العقد
                        </Badge>
                      ) : item.formData?.status === "rejected" ? (
                        <Badge variant="destructive" className="px-3 py-1">
                          مرفوض
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="px-3 py-1"></Badge>
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

      {/* Create Quotation Dialog */}
      <Dialog open={quotationDialogOpen} onOpenChange={setQuotationDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إنشاء عرض سعر</DialogTitle>
            <DialogDescription>
              يرجى إدخال سعر المتر لكل قطاع
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {sectionsData && sectionsData.length > 0 ? (
              <div className="space-y-3">
                {sectionsData.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <Label htmlFor={`section-${section.id}`}>
                      {section.name}
                    </Label>
                    <Input
                      id={`section-${section.id}`}
                      type="number"
                      placeholder="أدخل سعر المتر"
                      value={sectionPrices[section.id] || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setSectionPrices((prev) => ({
                          ...prev,
                          [section.id]: value,
                        }));
                      }}
                      min="0"
                      step="0.01"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                جاري تحميل القطاعات...
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setQuotationDialogOpen(false);
                setSectionPrices({});
                setSelectedItemIndex(null);
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmQuotation}
              disabled={createQuotationMutation.isPending || !sectionsData || sectionsData.length === 0}
            >
              {createQuotationMutation.isPending ? "جاري الحفظ..." : "إنشاء عرض السعر"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contract Signed Dialog */}
      <Dialog open={contractDialogOpen} onOpenChange={setContractDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تم توقيع العقد</DialogTitle>
            <DialogDescription>يرجى إدخال تاريخ التوقيع</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contract-date">تاريخ التوقيع</Label>
              <Popover open={contractCalendarOpen} onOpenChange={setContractCalendarOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Input
                      id="contract-date"
                      type="text"
                      placeholder="----/--/--"
                      value={contractDate}
                      onChange={(e) => {
                        setContractDate(e.target.value);
                        const parsedDate = parseDateFromString(e.target.value);
                        setSelectedContractDate(parsedDate);
                      }}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedContractDate}
                    onSelect={handleContractDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setContractDialogOpen(false);
                setContractDate("");
                setSelectedContractDate(undefined);
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmContract}
              disabled={!contractDate.trim() || createContractMutation.isPending}
            >
              {createContractMutation.isPending ? "جاري الحفظ..." : "تأكيد"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
