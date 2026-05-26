"use client";

import { Loader2 } from "lucide-react";

import { Progress } from "@/components/ui/progress";

type UploadProgressProps = {
  progress?: number;
};

export function UploadProgress({ progress = 70 }: UploadProgressProps) {
  return (
    <div className="space-y-3 rounded-2xl border bg-muted/30 p-4">
      <div className="flex items-center gap-2">
        <Loader2 className="size-4 animate-spin" />

        <span className="text-sm font-medium">Đang tải ảnh lên...</span>
      </div>

      <Progress value={progress} />

      <p className="text-xs text-muted-foreground">{progress}%</p>
    </div>
  );
}
