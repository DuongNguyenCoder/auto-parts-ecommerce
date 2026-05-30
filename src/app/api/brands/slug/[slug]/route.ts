import { brandController } from "@/server/controllers/brands.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  return brandController.getBySlug(request, await params);
}
