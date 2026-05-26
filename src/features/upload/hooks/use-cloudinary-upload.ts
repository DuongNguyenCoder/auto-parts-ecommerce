"use client";

import { useCallback, useState } from "react";

import { uploadToCloudinary } from "@/server/services/cloudinary-upload.service";

type Options = {
  folder?: string;
};

export function useCloudinaryUpload(options?: Options) {
  const [isUploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateSignature = useCallback(
    async (paramsToSign: Record<string, string | number>) => {
      const response = await fetch("/api/sign-cloudinary-params", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paramsToSign: {
            ...paramsToSign,
            folder: options?.folder,
          },
        }),
      });

      const data = await response.json();
      setProgress(45);
      return data.signature;
    },
    [options?.folder],
  );

  const upload = useCallback(
    async (file: File) => {
      setProgress(70);
      try {
        setUploading(true);
        setProgress(15);

        const timestamp = Math.floor(Date.now() / 1000);

        const signature = await generateSignature({
          timestamp,
        });

        setProgress(100);
        return await uploadToCloudinary({
          file,
          timestamp,
          signature,
          folder: options?.folder,
        });
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [generateSignature, options?.folder],
  );

  return {
    upload,
    isUploading,
    progress,
  };
}
