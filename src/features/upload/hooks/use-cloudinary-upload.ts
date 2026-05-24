"use client";

import { useCallback } from "react";

type UseCloudinaryUploadOptions = {
  folder?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
};

export function useCloudinaryUpload(options?: UseCloudinaryUploadOptions) {
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

      return data.signature;
    },
    [options?.folder],
  );

  return {
    generateSignature,
  };
}
