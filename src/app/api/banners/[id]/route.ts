import { bannerController } from "@/server/controllers/banners.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return bannerController.getById(request, await params);
}
