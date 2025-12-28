import { NextResponse } from "next/server";
import type { IApiSuccessResponse, IApiErrorResponse } from "@/lib/types/api";

export function successResponse<T>(data: T, status: number) {
  return NextResponse.json({ success: true, data, status } satisfies IApiSuccessResponse<T>, {
    status,
  });
}

export function errorResponse(code: string, message: string, status: number, details?: any) {
  return NextResponse.json(
    {
      success: false,
      status: status,
      error: {
        code,
        message,

        ...(details && { details }),
      },
    } satisfies IApiErrorResponse,
    { status }
  );
}
