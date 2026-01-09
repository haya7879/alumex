"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle2,
  MoreVerticalIcon,
  Copy,
  Eye,
} from "lucide-react";
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

export interface FollowUpNote {
  note: string;
  user: string;
  date: string;
}

export interface FormData {
  status?: "new" | "quoted" | "contracted" | "rejected" | string;
  follow_ups?: FollowUpNote[];
}

export interface FormCardItem {
  id?: number;
  customerName: string;
  serialNumber: string;
  entry_date: string;
  followUp: {
    origin: "blue" | "green";
    branch: string;
  };
  formData?: FormData;
}

export interface FormCardProps {
  item: FormCardItem;
  index: number;
  formatDate: (dateString: string) => string;
  hoveredPopoverIndex: number | null;
  setHoveredPopoverIndex: (index: number | null) => void;
  onCopySerial: (serialNumber: string) => void;
  onEdit: (
    section: "basic" | "followup" | "measurements",
    index: number
  ) => void;
  onReject: (index: number) => void;
  onCreatePriceOffer: (index: number) => void;
  onContractSigned: (index: number) => void;
  onShow: (index: number) => void;
}

export function FormCard({
  item,
  index,
  formatDate,
  hoveredPopoverIndex,
  setHoveredPopoverIndex,
  onCopySerial,
  onEdit,
  onReject,
  onCreatePriceOffer,
  onContractSigned,
  onShow,
}: FormCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-2.5">
        <div className="flex flex-col gap-3">
          {/* Customer Name */}
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold">{item.customerName}</h3>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  ({item.serialNumber})
                </span>
                <button
                  onClick={() => onCopySerial(item.serialNumber)}
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
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>تعديل</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => onEdit("basic", index)}>
                        المعلومات الأساسية
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem
                        onClick={() => onEdit("followup", index)}
                      >
                        برنامج المتابعة
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        onClick={() => onEdit("measurements", index)}
                      >
                        القياسات
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem onClick={() => onShow(index)}>
                    عرض التفاصيل
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onReject(index)}
                    variant="destructive"
                  >
                    رفض
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCreatePriceOffer(index)}>
                    إنشاء عرض سعر
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onContractSigned(index)}>
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
              <p className="text-xs text-muted-foreground mb-2">التاريخ</p>
              <p className="text-sm font-medium">{item.entry_date}</p>
            </div>

            {/* الحالة */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">الحالة</p>
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
              <p className="text-xs text-muted-foreground mb-2">أصل / فرع</p>
              <div
                className="flex items-center gap-1"
                title={
                  item.followUp.origin === "blue" ? "نسخة أصلية" : "نسخة مكررة"
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
              <p className="text-xs text-muted-foreground mb-2">المتابعة</p>
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
                    <h4 className="font-semibold text-sm">ملاحظات المتابعة</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {item.formData?.follow_ups &&
                      item.formData.follow_ups.length > 0 ? (
                        item.formData.follow_ups.map(
                          (note: FollowUpNote, noteIndex: number) => (
                            <div
                              key={noteIndex}
                              className="border-b pb-2 last:border-0"
                            >
                              <p className="text-sm mb-3">{note.note}</p>
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
  );
}
