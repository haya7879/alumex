"use client";

import { useState, useMemo } from "react";
import { useForms, useCreateContract, useCreateQuotation, useSections } from "@/services/sales/sales-hooks";
import { TablePagination } from "@/components/table";
import { FormCard } from "@/components/shared/form-card";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { RejectDialog } from "../_components/dialogs/reject-dialog";
import { QuotationDialog } from "../_components/dialogs/quotation-dialog";
import { ContractDialog } from "../_components/dialogs/contract-dialog";
import { useDateConverter } from "@/hooks/use-date-converter";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export default function DailyFollowUpPage() {
  const [currentPage, setCurrentPage] = useState(1);
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
  const { data: sectionsData } = useSections();

  // Dialog states
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [quotationDialogOpen, setQuotationDialogOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );
  const [hoveredPopoverIndex, setHoveredPopoverIndex] = useState<number | null>(
    null
  );

  const { convertDateToAPIFormat, formatDate } = useDateConverter();
  const { copyToClipboard } = useCopyToClipboard();
  const handleReject = (index: number) => {
    setSelectedItemIndex(index);
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = (reason: string) => {
    setRejectDialogOpen(false);
    setSelectedItemIndex(null);
  };

  const handleContractSigned = (index: number) => {
    setSelectedItemIndex(index);
    setContractDialogOpen(true);
  };

  const handleConfirmContract = async (date: string) => {
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
        contract_date: convertDateToAPIFormat(date),
      };
      await createContractMutation.mutateAsync(requestBody);
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      toast.success("تم إنشاء العقد بنجاح");
      setContractDialogOpen(false);
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
    setQuotationDialogOpen(true);
  };

  const handleConfirmQuotation = async (sectionPrices: Record<number, number>) => {
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
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      
      toast.success("تم إنشاء عرض السعر بنجاح");
      setQuotationDialogOpen(false);
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

  const handleEdit = (
    section: "basic" | "followup" | "measurements",
    index: number
  ) => {
    console.log("Edit", section, "for item:", index);
  };

  // Convert API data to TableRowData format
  const tableData = useMemo(() => {
    if (!formsData?.data) return [];
    return formsData.data.map((form) => {
      const isOriginal = form.serials.parent === null;
      return {
        id: form.id,
        customerName: form.form_name,
        serialNumber: form.serials.current,
        entry_date: formatDate(form.entry_date),
        followUp: {
          origin: isOriginal ? ("blue" as const) : ("green" as const),
          branch: "blue",
        },
        formData: form,
      };
    });
  }, [formsData]);

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
            <FormCard
              key={index}
              item={item}
              index={index}
              formatDate={formatDate}
              hoveredPopoverIndex={hoveredPopoverIndex}
              setHoveredPopoverIndex={setHoveredPopoverIndex}
              onCopySerial={(serialNumber) => copyToClipboard(serialNumber, "تم نسخ الرقم التسلسلي")}
              onEdit={handleEdit}
              onReject={handleReject}
              onCreatePriceOffer={handleCreatePriceOffer}
              onContractSigned={handleContractSigned}
            />
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
      <RejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={handleConfirmReject}
      />

      {/* Create Quotation Dialog */}
      <QuotationDialog
        open={quotationDialogOpen}
        onOpenChange={setQuotationDialogOpen}
        sectionsData={sectionsData}
        onConfirm={handleConfirmQuotation}
        isPending={createQuotationMutation.isPending}
      />

      {/* Contract Signed Dialog */}
      <ContractDialog
        open={contractDialogOpen}
        onOpenChange={setContractDialogOpen}
        onConfirm={handleConfirmContract}
        isPending={createContractMutation.isPending}
      />
    </div>
  );
}
