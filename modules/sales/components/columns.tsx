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
      <div className="flex items-center gap-3">
        <MoreVertical className="size-4 cursor-pointer" />
        <Folder className="size-4 cursor-pointer" />
        <Menu className="size-4 cursor-pointer" />
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
    header: "المساحة الكلية للمشروع",
  },
  {
    key: "actions",
    header: "",
    render: () => <MoreVertical className="size-4 cursor-pointer" />,
  },
];
