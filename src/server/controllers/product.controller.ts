import { NextRequest } from "next/server";

export const productController = {
    create: async (request: NextRequest) => {
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
}