"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useForms,
  useCreateContract,
  useCreateQuotation,
  useSections,
  useForm,
  useUpdateFormBasicInfo,
  useUpdateFormMeasurements,
  useRejectForm,
} from "@/services/sales/sales-hooks";
import {
  UpdateFormBasicInfoRequest,
  UpdateFormMeasurementsRequest,
} from "@/services/sales/sales-services";
import { TablePagination } from "@/components/table";
import { FormCard } from "@/components/shared/form-card";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { RejectDialog } from "../_components/dialogs/reject-dialog";
import { QuotationDialog } from "../_components/dialogs/quotation-dialog";
import { ContractDialog } from "../_components/dialogs/contract-dialog";
import { FormDetailsSheet } from "../_components/dialogs/form-details-sheet";
import { EditBasicInfoSheet } from "../_components/dialogs/edit-basic-info-sheet";
import { EditMeasurementsSheet } from "../_components/dialogs/edit-measurements-sheet";
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
  const updateFormBasicInfoMutation = useUpdateFormBasicInfo();
  const updateFormMeasurementsMutation = useUpdateFormMeasurements();
  const rejectFormMutation = useRejectForm();
  const queryClient = useQueryClient();
  const { data: sectionsData } = useSections();

  // Dialog states
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [quotationDialogOpen, setQuotationDialogOpen] = useState(false);
  const [showSheetOpen, setShowSheetOpen] = useState(false);
  const [editBasicInfoSheetOpen, setEditBasicInfoSheetOpen] = useState(false);
  const [editMeasurementsSheetOpen, setEditMeasurementsSheetOpen] =
    useState(false);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );
  const [hoveredPopoverIndex, setHoveredPopoverIndex] = useState<number | null>(
    null
  );

  // Fetch form details when selectedFormId is set (for show or edit)
  const shouldFetchFormDetails =
    selectedFormId &&
    (showSheetOpen || editBasicInfoSheetOpen || editMeasurementsSheetOpen);
  const { data: formDetails, isLoading: isLoadingFormDetails } = useForm(
    shouldFetchFormDetails ? selectedFormId : null
  );

  const { convertDateToAPIFormat, formatDate } = useDateConverter();
  const { copyToClipboard } = useCopyToClipboard();
  const handleReject = (index: number) => {
    setSelectedItemIndex(index);
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = async (reason: string) => {
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
      await rejectFormMutation.mutateAsync({
        id: Number(formId),
        data: { reason },
      });
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      toast.success("تم رفض النموذج بنجاح");
      setRejectDialogOpen(false);
      setSelectedItemIndex(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "حدث خطأ أثناء رفض النموذج";
      toast.error(errorMessage);
      console.error(error);
    }
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
        form_id: Number(formId),
        contract_date: convertDateToAPIFormat(date),
      };
      await createContractMutation.mutateAsync(requestBody);
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["form", formId] });
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

  const handleConfirmQuotation = async (
    sectionPrices: Record<number, number>
  ) => {
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
        section_id: Number(sectionId),
        price_per_meter: Number(price),
      }));

    if (sectionsWithPrices.length === 0) {
      toast.error("يرجى إدخال سعر لقطاع واحد على الأقل");
      return;
    }

    try {
      const requestBody = {
        form_id: Number(formId),
        confirmed: true,
        sections_prices: sectionsWithPrices,
      };

      await createQuotationMutation.mutateAsync(requestBody);
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["form", formId] });

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
    const formId = filteredData[index]?.id;
    if (!formId) {
      toast.error("خطأ: لم يتم العثور على معرف النموذج");
      return;
    }

    setSelectedFormId(formId);

    if (section === "basic") {
      setEditBasicInfoSheetOpen(true);
    } else if (section === "measurements") {
      setEditMeasurementsSheetOpen(true);
    }
  };

  const handleConfirmEditBasicInfo = async (
    data: UpdateFormBasicInfoRequest
  ) => {
    if (!selectedFormId) {
      toast.error("خطأ: لم يتم تحديد النموذج");
      return;
    }

    try {
      await updateFormBasicInfoMutation.mutateAsync({
        id: selectedFormId,
        data,
      });
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["form", selectedFormId] });
      toast.success("تم تعديل المعلومات الأساسية بنجاح");
      setEditBasicInfoSheetOpen(false);
      setSelectedFormId(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "حدث خطأ أثناء تعديل المعلومات الأساسية";
      toast.error(errorMessage);
      console.error(error);
      throw error;
    }
  };

  const handleConfirmEditMeasurements = async (
    data: UpdateFormMeasurementsRequest
  ) => {
    if (!selectedFormId) {
      toast.error("خطأ: لم يتم تحديد النموذج");
      return;
    }

    try {
      await updateFormMeasurementsMutation.mutateAsync({
        id: selectedFormId,
        data,
      });
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["form", selectedFormId] });
      toast.success("تم تعديل القياسات بنجاح");
      setEditMeasurementsSheetOpen(false);
      setSelectedFormId(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "حدث خطأ أثناء تعديل القياسات";
      toast.error(errorMessage);
      console.error(error);
      throw error;
    }
  };

  const handleShow = (index: number) => {
    const formId = filteredData[index]?.id;
    if (!formId) {
      toast.error("خطأ: لم يتم العثور على معرف النموذج");
      return;
    }
    setSelectedFormId(formId);
    setShowSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setShowSheetOpen(false);
    setSelectedFormId(null);
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
  }, [formsData, formatDate]);

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
              onCopySerial={(serialNumber) =>
                copyToClipboard(serialNumber, "تم نسخ الرقم التسلسلي")
              }
              onEdit={handleEdit}
              onReject={handleReject}
              onCreatePriceOffer={handleCreatePriceOffer}
              onContractSigned={handleContractSigned}
              onShow={handleShow}
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
        isPending={rejectFormMutation.isPending}
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

      {/* Form Details Sheet */}
      <FormDetailsSheet
        open={showSheetOpen}
        onOpenChange={handleCloseSheet}
        formDetails={formDetails}
        isLoading={isLoadingFormDetails}
      />

      {/* Edit Basic Info Sheet */}
      <EditBasicInfoSheet
        open={editBasicInfoSheetOpen}
        onOpenChange={(open) => {
          setEditBasicInfoSheetOpen(open);
          if (!open) setSelectedFormId(null);
        }}
        formData={formDetails?.data || null}
        onConfirm={handleConfirmEditBasicInfo}
        isPending={updateFormBasicInfoMutation.isPending}
      />

      {/* Edit Measurements Sheet */}
      <EditMeasurementsSheet
        open={editMeasurementsSheetOpen}
        onOpenChange={(open) => {
          setEditMeasurementsSheetOpen(open);
          if (!open) setSelectedFormId(null);
        }}
        formId={selectedFormId}
        formData={formDetails?.data || null}
        onConfirm={handleConfirmEditMeasurements}
        isPending={updateFormMeasurementsMutation.isPending}
        isLoading={isLoadingFormDetails}
      />
    </div>
  );
}
