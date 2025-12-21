"use client";

import { useState } from "react";
import StepOne, { BasicInfoFormData } from "./(steps)/step-one";
import StepTwo from "./(steps)/step-two";
import StepThree, { MeasurementRow } from "./(steps)/step-three";

export default function AddNewFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [notes, setNotes] = useState("");

  const [measurementRows, setMeasurementRows] = useState<MeasurementRow[]>([
    {
      id: 1,
      floor: "GF",
      location: "صالة على منور وسطي",
      width: "262.15",
      length: "262.15",
      count: "1",
      areaCm2: "121,600.0",
      areaM2: "12.160",
      pricePerMeter: "245,000 د.ع",
      total: "2,245,000 د.ع",
      checked: true,
    },
  ]);

  const handleBasicInfoChange = (field: keyof BasicInfoFormData, value: string) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddRow = () => {
    const newRow: MeasurementRow = {
      id: measurementRows.length + 1,
      floor: "",
      location: "",
      width: "",
      length: "",
      count: "",
      areaCm2: "",
      areaM2: "",
      pricePerMeter: "",
      total: "",
      checked: false,
    };
    setMeasurementRows([...measurementRows, newRow]);
  };

  const handleRowChange = (id: number, field: keyof MeasurementRow, value: string | boolean) => {
    setMeasurementRows(
      measurementRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    handleRowChange(id, "checked", checked);
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

  const handleSubmit = () => {
    // Handle form submission
    console.log("Basic Info:", basicInfo);
    console.log("Notes:", notes);
    console.log("Measurements:", measurementRows);
  };

  return (
    <div className="space-y-4">
      {/* Steps Indicator */}
      <div className="bg-white rounded-xl p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div className="h-1 w-20 bg-gray-200">
              <div
                className={`h-full transition-all ${
                  currentStep >= 2 ? "bg-primary" : "bg-gray-200"
                }`}
                style={{ width: currentStep >= 2 ? "100%" : "0%" }}
              />
            </div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <div className="h-1 w-20 bg-gray-200">
              <div
                className={`h-full transition-all ${
                  currentStep >= 3 ? "bg-primary" : "bg-gray-200"
                }`}
                style={{ width: currentStep >= 3 ? "100%" : "0%" }}
              />
            </div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 3 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              3
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8 text-sm">
          <span className={currentStep === 1 ? "font-semibold text-primary" : "text-gray-600"}>
            المعلومات الاساسية
          </span>
          <span className={currentStep === 2 ? "font-semibold text-primary" : "text-gray-600"}>
            الملاحظات
          </span>
          <span className={currentStep === 3 ? "font-semibold text-primary" : "text-gray-600"}>
            جدول القياس
          </span>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <StepOne
          formData={basicInfo}
          onInputChange={handleBasicInfoChange}
          onNext={nextStep}
        />
      )}

      {/* Step 2: Notes */}
      {currentStep === 2 && (
        <StepTwo
          notes={notes}
          onNotesChange={setNotes}
          onNext={nextStep}
          onPrev={prevStep}
        />
      )}

      {/* Step 3: Measurements Table */}
      {currentStep === 3 && (
        <StepThree
          measurementRows={measurementRows}
          onRowChange={handleRowChange}
          onCheckboxChange={handleCheckboxChange}
          onAddRow={handleAddRow}
          onPrev={prevStep}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

