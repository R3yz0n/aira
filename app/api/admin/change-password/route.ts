import { getDb } from "../../../../lib/mongodb";
import { verifyPassword, hashPassword } from "../../../../lib/hash";
import { verifyToken } from "../../../../lib/jwt";
import { ObjectId } from "mongodb";

/**
 * Extract bearer token from Authorization header.
 */
function getBearerToken(req: Request) {
  const h = req.headers.get("authorization");
  if (!h) return null;
  const parts = h.split(" ");
  if (parts.length !== 2) return null;
  return parts[1];
}

/**
 * POST /api/admin/change-password
 *
 * Protected endpoint that allows the admin to change their password. Requires
 * an `Authorization: Bearer <token>` header with a valid JWT issued by the
 * login endpoint.
 *
 * Request JSON:
 * { oldPassword: string, newPassword: string }
 *
 * Errors:
 * - 400: missing fields or new password too short
 * - 401: unauthorized (missing/invalid token or wrong old password)
 * - 404: admin not found
 */
export async function POST(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token) return new Response("Unauthorized", { status: 401 });

    let payload: any;
    try {
      payload = verifyToken(token);
    } catch (e) {
      return new Response("Invalid token", { status: 401 });
    }

    const adminId = payload?.sub;
    if (!adminId) return new Response("Invalid token payload", { status: 401 });

    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) return new Response("Missing passwords", { status: 400 });
    if (typeof newPassword !== "string" || newPassword.length < 8)
      return new Response("New password too short", { status: 400 });

    const db = await getDb();
    const admin = await db.collection("admins").findOne({ _id: new ObjectId(adminId) });
    if (!admin) return new Response("Admin not found", { status: 404 });

    const ok = await verifyPassword(oldPassword, admin.passwordHash);
    if (!ok) return new Response("Old password incorrect", { status: 401 });

    const newHash = await hashPassword(newPassword);
    await db
      .collection("admins")
      .updateOne({ _id: admin._id }, { $set: { passwordHash: newHash, updatedAt: new Date() } });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
}
