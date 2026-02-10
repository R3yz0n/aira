import type { NextRequest } from "next/server";
import type { JwtPayload } from "jsonwebtoken";

import { errorResponse } from "@/lib/api/response-handler";
import { verifyToken } from "@/lib/auth/jwt";
import { checkRolePermission } from "@/lib/utils/role-check";

interface DefaultRouteContext {
  // Next.js may pass `params` as a plain object or as a Promise of an object
  params?: Record<string, string | string[]> | Promise<Record<string, string | string[]>>;
}

export interface AdminAuthClaims extends JwtPayload {
  sub: string;
  email: string;
  role: "admin" | "guest";
}

export type AdminRouteHandler<TContext = DefaultRouteContext> = (
  req: NextRequest,
  context: TContext,
  admin: AdminAuthClaims,
) => Promise<Response> | Response;

export type NextRouteHandler<TContext = DefaultRouteContext> = (
  req: NextRequest,
  context: TContext,
) => Promise<Response> | Response;

/**
 * Wraps a route handler with admin-auth enforcement. Any request without a
 * valid JWT that was signed by the server is immediately rejected.
 */
export function withAdminAuth<TContext = DefaultRouteContext>(
  handler: AdminRouteHandler<TContext>,
): NextRouteHandler<TContext> {
  return async (req: NextRequest, context: TContext) => {
    const token = extractToken(req);
    if (!token) {
      return errorResponse("UNAUTHORIZED", "Missing authorization token", 401);
    }

    try {
      const decoded = verifyToken(token);
      if (typeof decoded === "string") {
        return errorResponse("UNAUTHORIZED", "Invalid authorization token", 401);
      }

      return handler(req, context, decoded as AdminAuthClaims);
    } catch (error) {
      console.error("Admin auth middleware error", error);
      return errorResponse("UNAUTHORIZED", "Invalid or expired authorization token", 401);
    }
  };
}

/**
 * Wraps a route handler with admin-auth enforcement AND role-based permission checking.
 * - Admin role: All methods allowed (GET, POST, PUT, DELETE)
 * - Guest role: GET only (read-only), POST/PUT/DELETE return 403 Forbidden
 */
export function withAdminAuthAndRoleCheck<TContext = DefaultRouteContext>(
  handler: AdminRouteHandler<TContext>,
): NextRouteHandler<TContext> {
  return withAdminAuth<TContext>((req, context, admin) => {
    // Check role-based permissions
    const permissionError = checkRolePermission(req, admin);
    if (permissionError) {
      return permissionError;
    }

    return handler(req, context, admin);
  });
}

function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    const [scheme, ...valueParts] = authHeader.split(" ");
    if (scheme?.toLowerCase() === "bearer") {
      const token = valueParts.join(" ").trim();
      if (token) return token;
    }
  }
  return null;
}
