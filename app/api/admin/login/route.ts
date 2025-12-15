import { getDb } from "../../../../lib/mongodb";
import { verifyPassword } from "../../../../lib/hash";
import { signToken } from "../../../../lib/jwt";

/**
 * POST /api/admin/login
 *
 * Authenticate the single admin user. Returns a JSON Web Token on success.
 *
 * Request JSON shape:
 * { email: string, password: string }
 *
 * Response:
 * { token: string }
 *
 * Errors:
 * - 400: missing fields
 * - 401: invalid credentials
 */
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return new Response("Missing credentials", { status: 400 });

    const db = await getDb();
    const admin = await db.collection("admins").findOne({ email });
    if (!admin) return new Response("Invalid credentials", { status: 401 });

    const match = await verifyPassword(password, admin.passwordHash);
    if (!match) return new Response("Invalid credentials", { status: 401 });

    const token = signToken({ sub: String(admin._id), email });
    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (err: any) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
}
