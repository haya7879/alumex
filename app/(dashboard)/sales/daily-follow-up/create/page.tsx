"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import StepOne, { BasicInfoFormData } from "./(steps)/step-one";
import StepTwo, { NoteRow } from "./(steps)/step-two";
import StepThree, { Section } from "./(steps)/step-three";
import StepsIndicator from "@/components/shared/steps-indicator";
import { toast } from "sonner";

export default function AddNewFormPage() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formId, setFormId] = useState<number | null>(null);
  const [basicInfo, setBasicInfo] = useState<BasicInfoFormData>({
    approvedCompany: "",
    followUpEngineer: "",
    delegate: "",
    projectName: "",
    phoneNumber: "",
    phoneNumber2: "",
    projectCategory: "",
    projectStage: "",
    date: "",
    address: "",
  });
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  // Read form_id and step from URL
  useEffect(() => {
    const formIdParam = searchParams.get("form_id");
    const stepParam = searchParams.get("step");
    
    if (formIdParam) {
      const id = parseInt(formIdParam, 10);
      if (!isNaN(id)) {
        setFormId(id);
      }
    }
    
    if (stepParam) {
      const step = parseInt(stepParam, 10);
      if (!isNaN(step) && step >= 1 && step <= 3) {
        setCurrentStep(step);
      }
    }
  }, [searchParams]);

  const handleBasicInfoChange = (
    field: keyof BasicInfoFormData,
    value: string | number | boolean
  ) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveForm = async (formData: BasicInfoFormData): Promise<number> => {
    // Dummy API call - replace with actual API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Simulate API response with form ID
    const newFormId = Math.floor(Math.random() * 10000);
    setFormId(newFormId);
    
    // In real implementation:
    // const response = await fetch('/api/daily-follow-up', {
    //   method: 'POST',
    //   body: JSON.stringify(formData)
    // });
    // const data = await response.json();
    // return data.id;
    
    toast.success("تم حفظ النموذج بنجاح");
    return newFormId;
  };

  const handleSaveNotes = async () => {
    if (!formId) {
      toast.error("خطأ: لم يتم حفظ النموذج");
      return;
    }

    // Dummy API call - replace with actual API
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // In real implementation:
    // await fetch(`/api/daily-follow-up/${formId}/notes`, {
    //   method: 'POST',
    //   body: JSON.stringify(notes)
    // });
    
    toast.success("تم حفظ الملاحظات بنجاح");
  };

  const handleSaveMeasurements = async () => {
    if (!formId) {
      toast.error("خطأ: لم يتم حفظ النموذج");
      return;
    }

    // Dummy API call - replace with actual API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In real implementation:
    // await fetch(`/api/daily-follow-up/${formId}/measurements`, {
    //   method: 'POST',
    //   body: JSON.stringify(sections)
    // });
    
    toast.success("تم حفظ جميع القياسات بنجاح");
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { label: "المعلومات" },
    { label: "الملاحظات" },
    { label: "جدول القياس" },
  ];

  return (
    <div className="space-y-2">
      <StepsIndicator steps={steps} currentStep={currentStep} />

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <StepOne
          formData={basicInfo}
          onInputChange={handleBasicInfoChange}
          onSave={handleSaveForm}
          onFormIdChange={setFormId}
          onNext={nextStep}
        />
      )}

      {/* Step 2: Notes */}
      {currentStep === 2 && formId && (
        <StepTwo
          formId={formId}
          notes={notes}
          onNotesChange={setNotes}
          onSave={handleSaveNotes}
          onNext={nextStep}
          onPrev={prevStep}
        />
      )}

      {/* Step 3: Measurements Table */}
      {currentStep === 3 && formId && (
        <StepThree
          formId={formId}
          sections={sections}
          onSectionsChange={setSections}
          onSave={handleSaveMeasurements}
          onPrev={prevStep}
        />
      )}
    </div>
  );
}

