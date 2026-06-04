import { v2 as cloudinary } from "cloudinary";
// import { getEnvClient } from "@/config/env.config";
// import { getEnvServer } from "@/config/env.server";

export function getCloudinary() {
  // const envClient = getEnvClient();
  // const envServer = getEnvServer();
  console.log(
    "process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME => ",
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  );
  console.log(
    "process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY => ",
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  );
  console.log(
    "process.env.CLOUDINARY_API_SECRET => ",
    process.env.CLOUDINARY_API_SECRET,
  );

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  return cloudinary;
}
