import { Folder, Menu, MoreVertical } from "lucide-react";
import { Column } from "@/components/table/data-table";

export interface TableRowData {
  customerName: string;
  phone: string;
  lastOfferDate: string;
  lastOfferPrice: string;
  receivedOffer: string;
  response: string;
  followUp: {
    origin: "blue" | "green";
    branch: string;
  };
}

export const columns: Column<TableRowData>[] = [
  {
    key: "customerName",
    header: "اسم الزبون",
  },
  {
    key: "phone",
    header: "رقم الهاتف",
  },
  {
    key: "lastOfferDate",
    header: "اخر عرض سعر",
  },
  {
    key: "lastOfferPrice",
    header: "سعر اخر عرض",
    render: (row: TableRowData) => row.lastOfferPrice || "-",
  },
  {
    key: "receivedOffer",
    header: "هل استلم العرض",
  },
  {
    key: "response",
    header: "الرد",
    render: (row: TableRowData) => row.response || "-",
  },
  {
    key: "followUp",
    header: "المتابعة أصل / فرع",
    render: (row: TableRowData) => (
      <div className="flex items-center gap-2">
        <MoreVertical className="size-4 cursor-pointer" />
        <Folder
          className={`size-4 cursor-pointer ${
            row.followUp.origin === "green"
              ? "text-green-500"
              : "text-blue-500"
          }`}
        />
        <Menu className="size-4 text-blue-500 cursor-pointer" />
      </div>
    ),
  },
];

export interface SignedContractRowData {
  customerName: string;
  location: string;
  representativeName: string;
  contractSigningDate: string;
  totalContractValue: string;
  totalProjectArea: string;
}

export const signedContractsColumns: Column<SignedContractRowData>[] = [
  {
    key: "customerName",
    header: "اسم الزبون",
  },
  {
    key: "location",
    header: "الموقع",
  },
  {
    key: "representativeName",
    header: "اسم المندوب",
  },
  {
    key: "contractSigningDate",
    header: "تاريخ توقيع العقد",
  },
  {
    key: "totalContractValue",
    header: "القيمة الكلية للعقد",
  },
  {
    key: "totalProjectArea",
    header: "المساحة الكلية للمشرع",
  },
  {
    key: "actions",
    header: "",
    className: "w-12",
    render: () => (
      <MoreVertical className="size-4 cursor-pointer text-gray-500 hover:text-gray-700" />
    ),
  },
];

