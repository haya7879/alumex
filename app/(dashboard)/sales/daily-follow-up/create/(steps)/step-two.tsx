"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, Column } from "@/components/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight, Plus, Trash2, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export interface NoteRow {
  id: number;
  note: string;
  createdBy: string;
  createdAt: string;
  checked: boolean;
}

interface StepTwoProps {
  formId: number;
  notes: NoteRow[];
  onNotesChange: (notes: NoteRow[]) => void;
  onSave: () => Promise<void>;
  onNext: () => void;
  onPrev: () => void;
}

export default function StepTwo({
  formId,
  notes,
  onNotesChange,
  onSave,
  onNext,
  onPrev,
}: StepTwoProps) {
  const [newNote, setNewNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showMeasurementsDialog, setShowMeasurementsDialog] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("يرجى إدخال ملاحظة");
      return;
    }

    const noteRow: NoteRow = {
      id: notes.length + 1,
      note: newNote.trim(),
      createdBy: "المستخدم الحالي", // In real app, get from auth context
      createdAt: new Date().toLocaleString("ar-IQ"),
      checked: false,
    };

    onNotesChange([...notes, noteRow]);
    setNewNote("");
    toast.success("تم إضافة الملاحظة");
  };

  const handleDeleteSelected = () => {
    const selected = notes.filter((n) => n.checked);
    if (selected.length === 0) {
      toast.error("يرجى تحديد ملاحظة للحذف");
      return;
    }
    onNotesChange(notes.filter((n) => !n.checked));
    toast.success("تم حذف الملاحظات المحددة");
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    onNotesChange(
      notes.map((note) => (note.id === id ? { ...note, checked } : note))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Dummy API call - send notes and formId
      await new Promise((resolve) => setTimeout(resolve, 500));
      await onSave();
      setShowMeasurementsDialog(true);
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الملاحظات");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMeasurementsDialogResponse = (addMeasurements: boolean) => {
    setShowMeasurementsDialog(false);
    if (addMeasurements) {
      onNext();
    } else {
      // Return to step one (reset form)
      window.location.reload();
    }
  };

  const columns: Column<NoteRow>[] = [
    {
      key: "checkbox",
      header: "",
      className: "w-12",
      render: (row) => (
        <Checkbox
          checked={row.checked}
          onCheckedChange={(checked) => handleCheckboxChange(row.id, checked as boolean)}
        />
      ),
    },
    {
      key: "id",
      header: "الرقم",
      className: "w-16",
    },
    {
      key: "note",
      header: "الملاحظة",
      render: (row) => (
        <Input
          value={row.note}
          onChange={(e) => {
            onNotesChange(
              notes.map((n) =>
                n.id === row.id ? { ...n, note: e.target.value } : n
              )
            );
          }}
          className="w-full"
        />
      ),
    },
    {
      key: "createdAt",
      header: "التوقيت",
      className: "w-40",
    },
  ];

  return (
    <div className="mt-6">
      {/* Header Banner */}
      <div className="py-3">
        <p className="text-sm text-right">
          سوف يتم ادراج الملاحظة باسمك بشكل تلقائي مع تاريخ الادخال
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="أدخل الملاحظة واضغط Enter"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddNote();
              }
            }}
            className="flex-1"
          />
          <Button variant="outline" onClick={handleAddNote}>
            <Plus className="size-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={!notes.some((n) => n.checked)}
          >
            <Trash2 className="size-4 ml-2" />
            حذف المحدد
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <DataTable
            data={notes}
            columns={columns}
            emptyMessage="لا توجد ملاحظات"
          />
        </div>
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button onClick={onPrev} variant="outline" className="min-w-[100px]">
          <ChevronRight className="size-4 ml-2" /> السابق
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-[100px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ"
          )}
        </Button>
      </div>

      {/* Measurements Dialog */}
      <Dialog open={showMeasurementsDialog} onOpenChange={setShowMeasurementsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تم حفظ الملاحظات بنجاح</DialogTitle>
            <DialogDescription>
              هل سوف تدخل القياسات؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="w-11! h-11"
              onClick={() => handleMeasurementsDialogResponse(false)}
            >
              لا
            </Button>
            <Button className="w-11 h-11" onClick={() => handleMeasurementsDialogResponse(true)}>
              نعم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
