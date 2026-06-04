import { cloudinary } from "@/config/cloudinary.config";
import { getEnvServer } from "@/config/env.server";

export async function POST(request: Request) {
  const envServer = getEnvServer();
  const body = await request.json();
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    envServer.CLOUDINARY_API_SECRET!,
  );

  return Response.json({ signature });
}
