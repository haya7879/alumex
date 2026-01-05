import { Column } from "@/components/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface MeasurementRow {
  id: number;
  number: number;
  floor: string;
  location: string;
  width: string;
  length: string;
  count: string;
  areaCm2: string;
  areaM2: string;
  pricePerMeter: string;
  total: string;
  checked: boolean;
}

interface CreateMeasurementColumnsParams {
  selectedSectionId: number | null;
  handleCheckboxChange: (sectionId: number, rowId: number, checked: boolean) => void;
  handleRowChange: (
    sectionId: number,
    rowId: number,
    field: keyof MeasurementRow,
    value: string | boolean
  ) => void;
  floors: string[];
}

export function createMeasurementColumns({
  selectedSectionId,
  handleCheckboxChange,
  handleRowChange,
  floors,
}: CreateMeasurementColumnsParams): Column<MeasurementRow>[] {
  return [
    {
      key: "checkbox",
      header: "",
      className: "w-12",
      render: (row) => (
        <Checkbox
          checked={row.checked}
          onCheckedChange={(checked) =>
            handleCheckboxChange(
              selectedSectionId!,
              row.id,
              checked as boolean
            )
          }
        />
      ),
    },
    {
      key: "number",
      header: "الرقم",
      className: "w-16",
      render: (row) => <span>{row.number}</span>,
    },
    {
      key: "floor",
      header: "الطابق",
      className: "w-24",
      render: (row) => (
        <Select
          value={row.floor}
          onValueChange={(value) =>
            handleRowChange(selectedSectionId!, row.id, "floor", value)
          }
        >
          <SelectTrigger className="h-8 w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {floors.map((floor) => (
              <SelectItem key={floor} value={floor}>
                {floor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "location",
      header: "الموقع",
      className: "w-48",
      render: (row) => (
        <Input
          value={row.location}
          onChange={(e) =>
            handleRowChange(
              selectedSectionId!,
              row.id,
              "location",
              e.target.value
            )
          }
          className="h-8 text-xs"
        />
      ),
    },
    {
      key: "width",
      header: "العرض",
      className: "w-24",
      render: (row) => (
        <Input
          value={row.width}
          onChange={(e) =>
            handleRowChange(selectedSectionId!, row.id, "width", e.target.value)
          }
          className="h-8 text-xs"
        />
      ),
    },
    {
      key: "length",
      header: "الطول",
      className: "w-24",
      render: (row) => (
        <Input
          value={row.length}
          onChange={(e) =>
            handleRowChange(
              selectedSectionId!,
              row.id,
              "length",
              e.target.value
            )
          }
          className="h-8 text-xs"
        />
      ),
    },
    {
      key: "count",
      header: "العدد",
      className: "w-16",
      render: (row) => (
        <Input
          value={row.count}
          onChange={(e) =>
            handleRowChange(selectedSectionId!, row.id, "count", e.target.value)
          }
          className="h-8 text-xs"
        />
      ),
    },
    {
      key: "areaCm2",
      header: "المساحة سم²",
      className: "w-28",
      render: (row) => (
        <Input value={row.areaCm2} readOnly className="h-8 text-xs" />
      ),
    },
    {
      key: "areaM2",
      header: "المساحة م²",
      className: "w-24",
      render: (row) => (
        <Input value={row.areaM2} readOnly className="h-8 text-xs" />
      ),
    },
    {
      key: "pricePerMeter",
      header: "سعر المتر",
      className: "w-32",
      render: (row) => (
        <Input
          value={row.pricePerMeter}
          onChange={(e) =>
            handleRowChange(
              selectedSectionId!,
              row.id,
              "pricePerMeter",
              e.target.value
            )
          }
          className="h-8 text-xs"
        />
      ),
    },
    {
      key: "total",
      header: "الإجمالي",
      className: "w-32",
      render: (row) => (
        <Input value={row.total} readOnly className="h-8 text-xs" />
      ),
    },
  ];
}
