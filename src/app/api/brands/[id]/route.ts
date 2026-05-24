import { brandController } from "@/server/controllers/brands.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return brandController.getById(request, await params);
}
