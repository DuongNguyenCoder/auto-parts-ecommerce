import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { isAppError } from "./app-error";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

export const successResponse = <T>(
  message: string,
  data: T,
  status = 200,
) =>
  NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    { status },
  );

export const emptySuccessResponse = (message: string, status = 200) =>
  NextResponse.json<ApiResponse<null>>(
    {
      success: true,
      message,
      data: null,
    },
    { status },
  );

export const errorResponse = (message: string, status = 400) =>
  NextResponse.json<ApiResponse<null>>(
    {
      success: false,
      message,
      data: null,
    },
    { status },
  );

export const handleApiError = (error: unknown) => {
  if (error instanceof ZodError) {
    return errorResponse(error.issues[0]?.message ?? "Invalid request.", 422);
  }

  if (isAppError(error)) {
    return errorResponse(error.message, error.statusCode);
  }

  return errorResponse("Something went wrong.", 500);
};
