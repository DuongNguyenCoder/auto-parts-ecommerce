import { carModelController } from "@/server/controllers/car-models.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  return carModelController.getBySlug(request, await params);
}
