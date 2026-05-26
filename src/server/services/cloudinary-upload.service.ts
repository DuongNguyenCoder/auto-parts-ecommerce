import { envClient } from "@/config/env.config";

type UploadToCloudinaryParams = {
  file: File;
  signature: string;
  timestamp: number;
  folder?: string;
};

export async function uploadToCloudinary({
  file,
  signature,
  timestamp,
  folder,
}: UploadToCloudinaryParams) {
  const formData = new FormData();

  formData.append("file", file);

  formData.append("api_key", envClient.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

  formData.append("timestamp", timestamp.toString());

  formData.append("signature", signature);

  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${envClient.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Upload image failed");
  }

  return response.json();
}
