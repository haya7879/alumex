"use client";

import { useState, useMemo, useEffect } from "react";
import { DataTable } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { EditSectionDialog } from "../_components/dialogs/edit-section-dialog";
import { DeleteConfirmationDialog } from "../_components/dialogs/delete-confirmation-dialog";
import { createSectionColumns } from "../_components/columns/section-columns";
import { useSections, useSection, useUpdateSection, useDeleteSection } from "@/services/sales/sales-hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Data interface
export interface SectionRowData {
  id: number;
  sectionName: string;
  status: "active" | "inactive";
}

export default function SectionOptionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    sectionName: "",
    status: "",
  });
  
  const queryClient = useQueryClient();
  const { data: sectionsData, isLoading, error } = useSections();
  const { data: sectionData, isLoading: isLoadingSection } = useSection(selectedSectionId);
  const updateSectionMutation = useUpdateSection();
  const deleteSectionMutation = useDeleteSection();
  
  useEffect(() => {
    if (sectionData) {
      setFormData({
        sectionName: sectionData.name,
        status: "active",
      });
    }
  }, [sectionData]);

  const tableData = useMemo(() => {
    if (!sectionsData) return [];
    return sectionsData.map((section) => ({
      id: section.id,
      sectionName: section.name,
      status: "active" as const,
    }));
  }, [sectionsData]);

  // Calculate pagination
  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = tableData.slice(startIndex, endIndex);

  // Handle edit button click
  const handleEdit = (sectionId: number) => {
    setSelectedSectionId(sectionId);
    setEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (sectionId: number) => {
    setSelectedSectionId(sectionId);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!selectedSectionId) return;

    try {
      await deleteSectionMutation.mutateAsync(selectedSectionId);
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success("تم حذف المقطع بنجاح");
      setSelectedSectionId(null);
    } catch (error) {
      console.error("Failed to delete section:", error);
      toast.error("فشل حذف المقطع. يرجى المحاولة مرة أخرى");
    }
  };

  // Get selected section data for delete dialog
  const selectedSection = useMemo(() => {
    if (!selectedSectionId) return null;
    return tableData.find((section) => section.id === selectedSectionId);
  }, [selectedSectionId, tableData]);

  // Handle dialog close
  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedSectionId(null);
    setFormData({
      sectionName: "",
      status: "",
    });
  };

  // Handle form input change
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submit
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSectionId) return;
    if (!formData.sectionName.trim()) {
      toast.error("يرجى إدخال اسم المقطع");
      return;
    }

    try {
      await updateSectionMutation.mutateAsync({
        id: selectedSectionId,
        data: {
          name: formData.sectionName.trim(),
        },
      });

      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["section", selectedSectionId] });
      toast.success("تم تحديث المقطع بنجاح");
      
      handleDialogClose();
    } catch (error) {
      console.error("Failed to update section:", error);
      toast.error("فشل تحديث المقطع. يرجى المحاولة مرة أخرى");
    }
  };

  // Table columns
  const columns = useMemo(
    () =>
      createSectionColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    []
  );

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

      {/* Edit Dialog */}
      <EditSectionDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        sectionName={formData.sectionName}
        onSectionNameChange={(value) => handleInputChange("sectionName", value)}
        onSubmit={handleUpdateSubmit}
        onCancel={handleDialogClose}
        isLoading={isLoadingSection}
        isPending={updateSectionMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      {selectedSection && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
            if (!open) {
              setSelectedSectionId(null);
            }
          }}
          items={[selectedSection]}
          onConfirm={handleConfirmDelete}
          description="هل أنت متأكد من حذف هذا المقطع؟ لا يمكن التراجع عن هذا الإجراء."
          itemLabel="مقطع"
          renderItem={(section) => (
            <div>اسم المقطع: {section.sectionName}</div>
          )}
          confirmLabel={
            deleteSectionMutation.isPending ? "جاري الحذف..." : "حذف"
          }
          isPending={deleteSectionMutation.isPending}
        />
      )}
    </div>
  );
}
