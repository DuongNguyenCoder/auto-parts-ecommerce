"use client";

import { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { UploadDropzone } from "./upload-dropzone";

import { UploadPreview } from "./upload-preview";

import { UploadProgress } from "./upload-progress";

import { useCloudinaryUpload } from "../hooks/use-cloudinary-upload";

import type {
  CloudinaryUploadResult,
  UploadImageDialogProps,
} from "../types/upload.types";

export function UploadImageDialog({
  open = false,
  onOpenChange,

  title = "Tải ảnh lên",

  description = "Chọn ảnh chất lượng cao để tải lên",

  folder,

  maxSizeMB,

  onSuccess,
}: UploadImageDialogProps) {
  const [file, setFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { upload, isUploading, progress } = useCloudinaryUpload({
    folder,
  });

  const resetState = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(null);

    setPreviewUrl(null);
  }, [previewUrl]);

  const handleClose = useCallback(() => {
    if (isUploading) return;

    resetState();

    onOpenChange?.(false);
  }, [isUploading, resetState, onOpenChange]);

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const objectUrl = URL.createObjectURL(selectedFile);

      setFile(selectedFile);

      setPreviewUrl(objectUrl);
    },
    [previewUrl],
  );

  const handleRemove = useCallback(() => {
    resetState();
  }, [resetState]);

  const handleUpload = useCallback(async () => {
    if (!file) return;

    try {
      const result = await upload(file);

      toast.success("Tải ảnh thành công");

      onSuccess?.(result as CloudinaryUploadResult);

      resetState();

      onOpenChange?.(false);
    } catch {
      toast.error("Upload thất bại");
    }
  }, [file, upload, resetState, onSuccess, onOpenChange]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl rounded-[2rem] p-0 overflow-hidden">
        <DialogHeader className="space-y-2 border-b p-6">
          <DialogTitle className="text-xl">{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 p-6">
          {!file ? (
            <UploadDropzone
              disabled={isUploading}
              maxSizeMB={maxSizeMB}
              onFileSelect={handleFileSelect}
              onError={(message) => toast.error(message)}
            />
          ) : (
            <UploadPreview
              file={file}
              previewUrl={previewUrl!}
              onRemove={handleRemove}
            />
          )}

          {isUploading && <UploadProgress progress={progress} />}
        </div>

        <DialogFooter className="border-t bg-muted/20 px-6 py-5">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Hủy
          </Button>

          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Đang tải...
              </>
            ) : (
              "Xác nhận"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
