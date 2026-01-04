"use client";

import { useState, useMemo, useEffect } from "react";
import { DataTable, Column } from "@/components/table/data-table";
import { TablePagination } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Edit, Trash2 } from "lucide-react";
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
  
  // Fetch sections from API
  const { data: sectionsData, isLoading, error } = useSections();
  
  // Fetch selected section data when dialog opens
  const { data: sectionData, isLoading: isLoadingSection } = useSection(selectedSectionId);
  
  // Update section mutation
  const updateSectionMutation = useUpdateSection();
  
  // Delete section mutation
  const deleteSectionMutation = useDeleteSection();
  
  // Load section data into form when sectionData is fetched
  useEffect(() => {
    if (sectionData) {
      setFormData({
        sectionName: sectionData.name,
        status: "active", // API doesn't provide status, defaulting to active
      });
    }
  }, [sectionData]);

  // Convert API data to TableRowData format
  const tableData = useMemo(() => {
    if (!sectionsData) return [];

    return sectionsData.map((section) => ({
      id: section.id,
      sectionName: section.name,
      status: "active" as const, // API doesn't provide status, defaulting to active
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

      // Invalidate sections query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["sections"] });

      toast.success("تم حذف المقطع بنجاح");
      
      // Close dialog
      setDeleteDialogOpen(false);
      setSelectedSectionId(null);
    } catch (error) {
      console.error("Failed to delete section:", error);
      toast.error("فشل حذف المقطع. يرجى المحاولة مرة أخرى");
    }
  };

  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedSectionId(null);
  };

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
    
    // Validate form
    if (!formData.sectionName.trim()) {
      toast.error("يرجى إدخال اسم المقطع");
      return;
    }

    try {
      // Send only name to API (as per API requirements)
      await updateSectionMutation.mutateAsync({
        id: selectedSectionId,
        data: {
          name: formData.sectionName.trim(),
        },
      });

      // Invalidate sections queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["section", selectedSectionId] });

      toast.success("تم تحديث المقطع بنجاح");
      
      // Close dialog
      handleDialogClose();
    } catch (error) {
      console.error("Failed to update section:", error);
      toast.error("فشل تحديث المقطع. يرجى المحاولة مرة أخرى");
    }
  };

  // Table columns (defined inside component to access handleEdit)
  const columns: Column<SectionRowData>[] = useMemo(() => [
    {
      key: "sectionName",
      header: "اسم المقطع",
      render: (row) => (
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-gray-500" />
          <span>{row.sectionName}</span>
        </div>
      ),
    },
    // {
    //   key: "status",
    //   header: "الحالة",
    //   render: (row) => {
    //     return row.status === "active" ? (
    //       <Badge variant="success" className="px-3 py-1">
    //         مفعل
    //       </Badge>
    //     ) : (
    //       <Badge variant="destructive" className="px-3 py-1">
    //         غير مفعل
    //       </Badge>
    //     );
    //   },
    // },
    {
      key: "options",
      header: "الخيارات",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleEdit(row.id)}
            variant="outline"
            size="icon"
            title="تعديل"
            className="bg-white hover:bg-[#3675AF]/10"
          >
            <Edit className="size-4 text-[#3675AF] hover:text-[#3675AF]/80 cursor-pointer" />
          </Button>
          <Button
            onClick={() => handleDelete(row.id)}
            variant="outline"
            size="icon"
            title="حذف"
            className="bg-white hover:bg-[#D32829]/10"
          >
            <Trash2 className="size-4 text-[#D32829] hover:text-[#D32829]/80 cursor-pointer" />
          </Button>
        </div>
      ),
    },
  ], []);

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
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {isLoadingSection ? (
            <div className="py-8 text-center text-muted-foreground">
              يرجى الانتظار...
            </div>
          ) : (
            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              {/* Section Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-sectionName">تعديل اسم المقطع</Label>
                <Input
                  id="edit-sectionName"
                  placeholder="ادخل اسم المقطع هنا"
                  value={formData.sectionName}
                  onChange={(e) => handleInputChange("sectionName", e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  disabled={updateSectionMutation.isPending}
                >
                  الغاء
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0A3158] text-white hover:bg-[#0A3158]/90"
                  disabled={updateSectionMutation.isPending}
                >
                  {updateSectionMutation.isPending ? "جاري الحفظ..." : "حفظ"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا المقطع؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleDeleteDialogClose}
              disabled={deleteSectionMutation.isPending}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteSectionMutation.isPending}
            >
              {deleteSectionMutation.isPending ? "جاري الحذف..." : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
