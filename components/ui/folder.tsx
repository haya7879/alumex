import * as React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { X } from "lucide-react";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./button";

const BgTab = () => {
  return (
    <div className="absolute z-[-1] left-1/2 -translate-x-1/2">
      <svg
        width="167"
        height="40"
        viewBox="0 0 167 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25.7685 0C22.0578 0 18.8342 2.55164 17.9822 6.16319L10 40L12 31.5C12 31.5 11 35.6821 7 38.1368C4 40 0 40 0 40H10H26.0003V0H25.7685Z"
          fill="white"
        />
        <rect x="26.0002" width="114.999" height="40" fill="white" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M141.231 0C144.942 0 148.166 2.55164 149.018 6.16319L157 40L155 31.5C155 31.5 156 35.6821 160 38.1368C163 40 167 40 167 40H157H141V0H141.231Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

export const Stepper = ({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) => {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <span
            className={cn(
              "px-4 py-1 rounded-[8px] bg-transparent text-[#98A2B3] text-sm font-normal inline-flex items-center gap-2",
              currentStep === index &&
                "bg-[#F5F9EA] text-gray-600 font-medium mx-2",
              index < currentStep && "bg-transparent text-green-600 font-medium"
            )}
            aria-label={`Go to ${step.label}`}
          >
            {index < currentStep && (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-success-600 text-white">
                <CheckIcon className="w-[10px] h-[10px]" />
              </span>
            )}
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div
              className={cn(
                index < currentStep
                  ? "h-[2px] w-8 bg-success-600 rounded-full"
                  : "flex items-center gap-[2px]"
              )}
            >
              {index >= currentStep && (
                <>
                  <div className="h-[2px] w-[6.5px] bg-gray-800 rounded-full"></div>
                  <div className="h-[2px] w-[6.5px] bg-gray-800 rounded-full"></div>
                  <div className="h-[2px] w-[6.5px] bg-gray-800 rounded-full"></div>
                  <div className="h-[2px] w-[6.5px] bg-gray-800 rounded-full"></div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export interface FolderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Folder = ({ className, ...props }: FolderProps) => {
  return <div className={cn("min-h-full h-fit flex flex-col", className)} {...props} />;
};

export interface Step {
  id: string;
  label: string;
  component: React.ReactNode;
  isCompleted: boolean;
}

export interface FolderHeaderProps {
  steps: Step[];
  currentStepIndex: number;
}

const FolderHeaderStepper = ({
  steps,
  currentStepIndex,
}: FolderHeaderProps) => {
  const navigate = useRouter();

  return (
    <div className="flex items-center">
      <div className="px-6 py-4 rounded-se-3xl w-full relative bg-background">
        <div className="flex items-center">
          <div className="inline-flex items-center">
            <span className="font-medium text-gray-600 leading-[0px]">
              New Course
            </span>
            <ChevronRightIcon className="w-4 h-4 mt-1 ml-2" />
          </div>
          <Stepper steps={steps} currentStep={currentStepIndex} />
        </div>
        
      </div>
      <div className="flex justify-center items-center gap-2 px-3 py-2">
        <Button
          onClick={() => navigate.push("/products/courses/my-courses")}
          size="icon"
          variant="outline"
          className="rounded-full"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export { Folder, BgTab, FolderHeaderStepper };
