"use client";

import { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { UploadDropzone } from "./upload-dropzone";
import { UploadPreview } from "./upload-preview";
import { UploadProgress } from "./upload-progress";

import { useCloudinaryUpload } from "../hooks/use-cloudinary-upload";

import type {
  CloudinaryUploadResult,
  UploadImageDialogProps,
} from "../types/upload.types";
import { Modal } from "@/components/ui/modal";

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

  /**
   * cleanup state
   */
  const resetState = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  /**
   * close dialog
   */
  const handleClose = useCallback(() => {
    if (isUploading) return;

    resetState();

    onOpenChange?.(false);
  }, [isUploading, resetState, onOpenChange]);

  /**
   * choose file
   */
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

  /**
   * remove selected file
   */
  const handleRemove = useCallback(() => {
    resetState();
  }, [resetState]);

  /**
   * upload
   */
  const handleUpload = useCallback(async () => {
    if (!file) return;

    try {
      const result = await upload(file);

      toast.success("Tải ảnh thành công");

      onSuccess?.(result as CloudinaryUploadResult);

      resetState();

      onOpenChange?.(false);
    } catch (error) {
      console.error(error);
      toast.error("Upload thất bại");
    }
  }, [file, upload, resetState, onSuccess, onOpenChange]);

  /**
   * cleanup preview url
   */
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={title}
      description={description}
      maxWidth="xl"
      loading={isUploading}
      preventClose={isUploading}
      badge="Media Upload"
      actions={
        <>
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
        </>
      }
    >
      <div className="space-y-5">
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
    </Modal>
  );
}
