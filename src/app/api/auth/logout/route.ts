import { authController } from "@/src/server/controllers/auth.controller";

export const runtime = "nodejs";

export const POST = () => authController.logout();
