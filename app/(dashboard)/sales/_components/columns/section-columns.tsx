import { Column } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export interface SectionRowData {
  id: number;
  sectionName: string;
  status: "active" | "inactive";
}

interface CreateSectionColumnsParams {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function createSectionColumns({
  onEdit,
  onDelete,
}: CreateSectionColumnsParams): Column<SectionRowData>[] {
  return [
    {
      key: "sectionName",
      header: "اسم المقطع",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.sectionName}</span>
        </div>
      ),
    },
    {
      key: "options",
      header: "الخيارات",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onEdit(row.id)}
            variant="outline"
            size="icon"
            title="تعديل"
            className="bg-white hover:bg-[#3675AF]/10"
          >
            <Edit className="size-4 text-[#3675AF] hover:text-[#3675AF]/80 cursor-pointer" />
          </Button>
          <Button
            onClick={() => onDelete(row.id)}
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
  ];
}

