import { v2 as cloudinary } from "cloudinary";
import { envClient as env } from "@/config/env.config";
import { envServer } from "@/config/env.server";

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: envServer.CLOUDINARY_API_SECRET,
});

export { cloudinary };
