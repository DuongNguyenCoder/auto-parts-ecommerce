"use client";

import Image from "next/image";
import { X, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatFileSize } from "@/lib/upload/file.utils";

type UploadPreviewProps = {
  file: File;
  previewUrl: string;
  onRemove: () => void;
};

export function UploadPreview({
  file,
  previewUrl,
  onRemove,
}: UploadPreviewProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border shadow-sm">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image src={previewUrl} alt={file.name} fill className="object-cover" />

        <Button
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 rounded-full shadow-md"
          onClick={onRemove}
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3 p-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-muted">
          <ImageIcon className="size-5 text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{file.name}</p>

          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>
    </Card>
  );
}
