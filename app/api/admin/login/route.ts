import { NextRequest, NextResponse } from "next/server";
import { adminLoginSchema } from "@/domain/admin";
import { AdminAuthService, InvalidCredentialsError } from "@/services/admin/auth-service";
import { MongoAdminRepository } from "@/repositories/admin-repository";

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
 * { "success": true, "data": { "token": "<jwt>" } }
 *
 * Errors:
 * 400 { "success": false, "error": { "code": "INVALID_INPUT", "message": "Invalid input", "details": <zod issues> } }
 * 401 { "success": false, "error": { "code": "INVALID_CREDENTIALS", "message": "Invalid credentials" } }
 * 500 { "success": false, "error": { "code": "INTERNAL_ERROR", "message": "Internal server error" } }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Invalid input",
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { token } = await authService.login(parsed.data);
    return NextResponse.json({ success: true, data: { token } }, { status: 200 });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" },
        },
        { status: 401 }
      );
    }

    console.error(err);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Internal server error" },
      },
      { status: 500 }
    );
  }
}
