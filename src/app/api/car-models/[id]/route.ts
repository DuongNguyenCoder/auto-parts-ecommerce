import { carModelController } from "@/server/controllers/car-models.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return carModelController.getById(request, await params);
}
