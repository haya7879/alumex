"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface Step {
  label: string;
  number?: number;
}

export interface StepsIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  connectorWidth?: string;
  showNumbers?: boolean;
}

export default function StepsIndicator({
  steps,
  currentStep,
  className,
  connectorWidth = "w-16",
  showNumbers = true,
}: StepsIndicatorProps) {
  return (
    <div className={cn("bg-white rounded-xl p-3", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const stepNumber = step.number ?? index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={index}>
                {/* Step */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full text-xs mb-1",
                      isActive || isCompleted
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {showNumbers ? stepNumber : null}
                  </div>
                  <span
                    className={cn(
                      "text-xs",
                      isActive
                        ? "font-semibold text-primary"
                        : "text-gray-600"
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector */}
                {!isLast && (
                  <div className={cn("h-0.5 bg-gray-200 -mt-4", connectorWidth)}>
                    <div
                      className={cn(
                        "h-full transition-all",
                        isCompleted ? "bg-primary" : "bg-gray-200"
                      )}
                      style={{ width: isCompleted ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

