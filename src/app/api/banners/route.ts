import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import { bannerController } from "@/server/controllers/banners.controller";
import { handleApiError } from "@/server/http/api-response";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  if (url.searchParams.get("active") === "true") {
    return bannerController.getActive(request);
  }
  return bannerController.list(request);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await requireAdmin();

    return bannerController.create(request);
  } catch (error) {
    return handleApiError(error);
  }
}
