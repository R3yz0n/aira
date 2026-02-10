import { NextRequest } from "next/server";
import { adminLoginSchema, IAuthToken } from "@/domain/admin";
import {
  AdminAuthService,
  IAuthServiceResult,
  InvalidCredentialsError,
} from "@/services/admin/auth-service";
import { MongoAdminRepository } from "@/repositories/admin-repository";
import { successResponse, errorResponse } from "@/lib/api/response-handler";

const authService = new AdminAuthService(new MongoAdminRepository());

/**
 * POST /api/admin/login
 *
 * Authenticate the single admin user. Returns a JSON Web Token on success.
 *
 * Request body:
 * { "email": "admin@example.com", "password": "SuperSecret123" }
 *
 * Success 200:
 * { "success": true, "data": { "token": "<jwt>", "role": "<role>" } }
 *
 * Errors:
 * 400 { "success": false, "error": { "code": "INVALID_INpUT", "message": "Invalid input", "details": <zod issues> } }
 * 500 { "success": false, "error": { "code": "INTERNAL_ERROR", "message": "Internal server error" } }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("INVALID_INPUT", "Invalid input", 400, parsed.error.flatten());
    }

    const { token, role }: IAuthServiceResult = await authService.login(parsed.data);
    return successResponse<IAuthToken>({ token, role }, 200);
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid credentials", 401, {
        reason: "The email or password provided is incorrect",
      });
    }

    console.error(err);
    return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
  }
}
