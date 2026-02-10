import type { NextRequest } from "next/server";
import type { AdminAuthClaims } from "@/lib/middleware/with-admin-auth";
import { errorResponse } from "@/lib/api/response-handler";

/**
 * Check if user role is allowed to perform the HTTP method.
 * - Admin: all methods (GET, POST, PUT, DELETE, etc.)
 * - Guest: Safe read-only methods (GET, HEAD, OPTIONS)
 */
export function checkRolePermission(req: NextRequest, claims: AdminAuthClaims): Response | null {
  const method = req.method.toUpperCase();

  // Admin can do anything
  if (claims.role === "admin") {
    return null;
  }

  // Guest can only do safe read-only methods
  const allowedGuestMethods = ["GET", "HEAD", "OPTIONS"];
  if (claims.role === "guest" && allowedGuestMethods.includes(method)) {
    return null;
  }

  // Guest trying to write
  return errorResponse("FORBIDDEN", "Guest users cannot perform this operations", 403);
}
