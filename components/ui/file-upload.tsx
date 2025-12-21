"use client"
import { ChangeEvent, DragEvent, useState } from "react";
import { Text } from "@/components/kadnya";
import { cn } from "@/lib/utils";
import { Cloud } from "lucide-react";

interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  onRemove: () => void;
  supportedFormats?: string;
  maxSize?: string;
}

export function FileUpload({
  value,
  onChange,
  onRemove,
  supportedFormats = "mp4, mp3, mkv",
  maxSize = "5gb",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onChange(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      onChange(files[0]);
    }
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors",
        isDragging
          ? "border-brand-primary bg-brand-primary/5"
          : "border-neutral-200 hover:border-brand-primary/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept={supportedFormats
          .split(", ")
          .map((format) => `.${format}`)
          .join(",")}
      />

      <div className="flex flex-col items-center gap-2 pointer-events-none">
        <div className="p-4 rounded-full border-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 4.16675C7.38333 4.16675 5.22999 6.18758 5.0179 8.75008H4.79167C2.83875 8.75008 1.25 10.3388 1.25 12.2917C1.25 14.2447 2.83875 15.8334 4.79167 15.8334H8.54167V14.5834H4.79167C3.52792 14.5834 2.5 13.5555 2.5 12.2917C2.5 11.028 3.52792 10.0001 4.79167 10.0001H5.625C5.97042 10.0001 6.25 9.7205 6.25 9.37508V9.16675C6.25 7.09925 7.9325 5.41675 10 5.41675C12.0675 5.41675 13.75 7.09925 13.75 9.16675V9.37508C13.75 9.7205 14.0296 10.0001 14.375 10.0001H15.2083C16.4721 10.0001 17.5 11.028 17.5 12.2917C17.5 13.5555 16.4721 14.5834 15.2083 14.5834H11.4583V15.8334H15.2083C17.1612 15.8334 18.75 14.2447 18.75 12.2917C18.75 10.3388 17.1612 8.75008 15.2083 8.75008H14.9821C14.77 6.18758 12.6167 4.16675 10 4.16675ZM9.99023 9.99113C9.89514 9.99269 9.80165 10.0159 9.71689 10.0591C9.63214 10.1022 9.55834 10.1642 9.50114 10.2402L7.68311 12.0582C7.62312 12.1158 7.57524 12.1848 7.54225 12.2611C7.50926 12.3374 7.49183 12.4196 7.49098 12.5027C7.49014 12.5859 7.50589 12.6683 7.53732 12.7453C7.56875 12.8223 7.61523 12.8923 7.67403 12.9511C7.73283 13.0099 7.80277 13.0563 7.87975 13.0878C7.95674 13.1192 8.03922 13.1349 8.12237 13.1341C8.20552 13.1333 8.28766 13.1158 8.36399 13.0828C8.44032 13.0498 8.5093 13.002 8.56689 12.942L9.375 12.1339V16.8751C9.37383 16.9579 9.38913 17.0401 9.42001 17.117C9.4509 17.1938 9.49675 17.2638 9.5549 17.3228C9.61305 17.3818 9.68235 17.4286 9.75876 17.4606C9.83517 17.4925 9.91717 17.509 10 17.509C10.0828 17.509 10.1648 17.4925 10.2412 17.4606C10.3177 17.4286 10.3869 17.3818 10.4451 17.3228C10.5033 17.2638 10.5491 17.1938 10.58 17.117C10.6109 17.0401 10.6262 16.9579 10.625 16.8751V12.1339L11.4331 12.942C11.4907 13.002 11.5597 13.0498 11.636 13.0828C11.7123 13.1158 11.7945 13.1333 11.8776 13.1341C11.9608 13.1349 12.0433 13.1192 12.1202 13.0878C12.1972 13.0563 12.2672 13.0099 12.326 12.9511C12.3848 12.8923 12.4312 12.8223 12.4627 12.7453C12.4941 12.6683 12.5099 12.5859 12.509 12.5027C12.5082 12.4196 12.4907 12.3374 12.4578 12.2611C12.4248 12.1848 12.3769 12.1158 12.3169 12.0582L10.4956 10.2369C10.4364 10.1593 10.3599 10.0967 10.2721 10.054C10.1843 10.0113 10.0878 9.9898 9.99023 9.99113Z"
              fill="#344054"
            />
          </svg>
        </div>

        {value ? (
          <>
            <Text variant="neutral-black" size="sm" weight="medium">
              {value.name}
            </Text>
            <Text
              variant="neutral-gray"
              size="sm"
              className="cursor-pointer pointer-events-auto hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              Remove file
            </Text>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <Text variant="neutral-black" size="sm" weight="medium">
                Click to upload
              </Text>
              <Text variant="neutral-gray" size="sm">
                or drag and drop
              </Text>
            </div>
            <Text variant="neutral-gray" size="sm">
              Supported Formats : {supportedFormats} (Max Size : {maxSize})
            </Text>
          </>
        )}
      </div>
    </div>
  );
}
