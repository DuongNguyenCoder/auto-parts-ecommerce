import { categoryController } from "@/server/controllers/categories.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return categoryController.getById(request, await params);
}
