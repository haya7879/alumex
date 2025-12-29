"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface StepTwoProps {
  notes: string;
  onNotesChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function StepTwo({ notes, onNotesChange, onNext, onPrev }: StepTwoProps) {
  return (
    <div className="bg-white rounded-xl p-4 border">
      <h2 className="text-xl font-semibold mb-6">الملاحظات</h2>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-800">
          سوف يتم ادراج الملاحظة باسمك بشكل تلقائي مع تاريخ الادخال
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">الملاحظات</Label>
        <Textarea
          id="notes"
          placeholder="تحرير من خلال المقر مرتين"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={8}
          className="min-h-[200px]"
        />
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button onClick={onPrev} variant="outline" className="min-w-[100px]">
          <ChevronLeft className="size-4 ml-2" /> السابق
        </Button>
        <Button onClick={onNext} className="bg-primary hover:bg-primary/80 min-w-[100px]">
          التالي <ChevronRight className="size-4 mr-2" />
        </Button>
      </div>
    </div>
  );
}

