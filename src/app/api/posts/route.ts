import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import { postController } from "@/server/controllers/posts.controller";
import { handleApiError } from "@/server/http/api-response";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return postController.list(request);
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    await requireAdmin();
    return postController.create(request, { authorId: session.user.id });
  } catch (error) {
    return handleApiError(error);
  }
}
