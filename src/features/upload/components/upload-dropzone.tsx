"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ACCEPT_IMAGE_TYPES,
  DEFAULT_MAX_SIZE_MB,
  MAX_FILE_COUNT,
} from "../constants/upload.constants";
import { Card, CardContent } from "@/components/ui/card";

type UploadDropzoneProps = {
  onFileSelect: (file: File) => void;

  onError?: (message: string) => void;

  maxSizeMB?: number;

  disabled?: boolean;
};

export function UploadDropzone({
  onFileSelect,
  onError,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  disabled = false,
}: UploadDropzoneProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) return;

      onFileSelect(file);
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,

    disabled,

    multiple: false,

    maxFiles: MAX_FILE_COUNT,

    accept: ACCEPT_IMAGE_TYPES,

    maxSize: maxSizeMB * 1024 * 1024,

    onDropRejected(fileRejections) {
      const firstError = fileRejections[0]?.errors?.[0];

      if (!firstError) return;

      switch (firstError.code) {
        case "file-too-large":
          onError?.(`Ảnh vượt quá ${maxSizeMB}MB`);
          break;

        case "file-invalid-type":
          onError?.("Chỉ hỗ trợ PNG, JPG, WEBP");
          break;

        case "too-many-files":
          onError?.("Chỉ được chọn 1 ảnh");
          break;

        default:
          onError?.("Tệp không hợp lệ");
      }
    },
  });

  return (
    <Card
      className={cn(
        "border-2 border-dashed transition-all duration-200",
        "rounded-3xl cursor-pointer",
        "hover:border-primary hover:bg-muted/40",

        isDragActive && "border-primary bg-primary/5 ring-2 ring-primary/20",

        disabled && "pointer-events-none opacity-60",
      )}
    >
      <CardContent
        {...getRootProps()}
        className="flex min-h-[280px] flex-col items-center justify-center gap-4 p-10 text-center"
      >
        <input {...getInputProps()} />

        <div
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full border bg-muted transition-all",

            isDragActive && "scale-110 bg-primary/10",
          )}
        >
          {isDragActive ? (
            <Upload className="size-10" />
          ) : (
            <ImagePlus className="size-10" />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            {isDragActive ? "Thả ảnh vào đây" : "Tải ảnh lên"}
          </h3>

          <p className="text-sm text-muted-foreground">
            Kéo thả ảnh hoặc click để chọn
          </p>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <p>PNG, JPG, WEBP</p>

          <p>Tối đa {maxSizeMB}MB</p>
        </div>
      </CardContent>
    </Card>
  );
}
