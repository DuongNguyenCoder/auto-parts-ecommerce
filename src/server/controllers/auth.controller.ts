import type { NextRequest } from "next/server";
import { authService } from "@/src/server/services/auth.service";
import {
  clearAccessTokenCookie,
  getAccessTokenCookie,
  setAccessTokenCookie,
} from "@/src/server/auth/cookies";
import {
  emptySuccessResponse,
  handleApiError,
  successResponse,
} from "@/src/server/http/api-response";
import { loginSchema, registerSchema } from "@/src/validations/auth.schema";

export const authController = {
  register: async (request: NextRequest) => {
    try {
      const payload = registerSchema.parse(await request.json());
      const result = await authService.register(payload);
      const response = successResponse(
        "Registration completed successfully.",
        result.session,
        201,
      );

      return setAccessTokenCookie(response, result.accessToken);
    } catch (error) {
      return handleApiError(error);
    }
  },

  login: async (request: NextRequest) => {
    try {
      const payload = loginSchema.parse(await request.json());
      const result = await authService.login(payload);
      const response = successResponse(
        "Login completed successfully.",
        result.session,
      );

      return setAccessTokenCookie(response, result.accessToken);
    } catch (error) {
      return handleApiError(error);
    }
  },

  logout: async () => {
    const response = emptySuccessResponse("Logout completed successfully.");

    return clearAccessTokenCookie(response);
  },

  me: async (request: NextRequest) => {
    try {
      const session = await authService.getSession(getAccessTokenCookie(request));

      return successResponse("Authenticated user retrieved.", session);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
