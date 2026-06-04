// import { getEnvClient } from "@/config/env.config";

type UploadToCloudinaryParams = {
  file: File;
  signature: string;
  timestamp: number;
  folder?: string;
};
console.log("ENTER uploadToCloudinary");
export async function uploadToCloudinary({
  file,
  signature,
  timestamp,
  folder,
}: UploadToCloudinaryParams) {
  console.log("ENTER check 2 uploadToCloudinary");
  // const envClient = getEnvClient();

  const formData = new FormData();

  formData.append("file", file);
  console.log(
    "CHECK NEXT_PUBLIC_CLOUDINARY_API_KEY: ",
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  );
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

  formData.append("timestamp", timestamp.toString());

  formData.append("signature", signature);

  if (folder) {
    formData.append("folder", folder);
  }
  console.log(
    "CHECK NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME SERVICE: ",
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  );
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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
