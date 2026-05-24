import { postController } from "@/server/controllers/posts.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  return postController.getBySlug(request, await params);
}
