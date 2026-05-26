import { UploadImageDialog } from "@/features/upload/components";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

type FormSectionProps = {
  imageUrl?: string;
  folder?: string;
  onUploadSuccess?: (url: string) => void;
  error?: string;
};

export default function BuilderUploadImage({
  imageUrl,
  folder,
  onUploadSuccess,
  error,
}: FormSectionProps) {
  const [openUpload, setOpenUpload] = useState(false);

  return (
    <div className="space-y-4">
      {imageUrl ? (
        /* Uploaded state */
        <div className="group relative overflow-hidden rounded-2xl border border-sky-100 bg-slate-50">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={imageUrl}
              alt="Product preview"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>

          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-900/30 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setOpenUpload(true)}
              className="rounded-xl border border-white/30 bg-white/20 px-4 py-2 text-[12.5px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              Replace image
            </button>
          </div>
        </div>
      ) : (
        /* Empty state */
        <button
          type="button"
          onClick={() => setOpenUpload(true)}
          className={cn(
            "flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-sky-200",
            "bg-sky-50/50 px-6 py-10 transition-all duration-200",
            "hover:border-sky-400 hover:bg-sky-50",

            error && "border-rose-300 bg-rose-50/50",
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-500">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V8m0 0l-3 3m3-3l3 3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 16.5V18a2 2 0 002 2h14a2 2 0 002-2v-1.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="text-center">
            <p className="text-[13.5px] font-semibold text-slate-700">
              Upload product image
            </p>

            <p className="mt-0.5 text-[12px] text-slate-400">
              PNG · JPG · WebP
            </p>
          </div>

          <span className="rounded-xl bg-blue-600 px-5 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
            Upload Image
          </span>
        </button>
      )}

      <UploadImageDialog
        open={openUpload}
        onOpenChange={setOpenUpload}
        folder={folder}
        maxSizeMB={5}
        onSuccess={(result) => {
          onUploadSuccess?.(result.secure_url);
        }}
      />
    </div>
  );
}
