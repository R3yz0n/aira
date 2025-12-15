import { getDb } from "../../../../lib/mongodb";
import { hashPassword } from "../../../../lib/hash";

/**
 * POST /api/admin/setup
 *
 * One-time endpoint to create the single admin user. This route enforces that
 * the provided `email` matches the `ADMIN_EMAIL` env value to prevent
 * accidental creation of other accounts.
 *
 * Request JSON shape:
 * {
 *   email: string,           // must equal ADMIN_EMAIL
 *   password: string,        // min length 8
 *   setupSecret?: string     // optional, must match ADMIN_SETUP_SECRET when set
 * }
 *
 * Responses:
 * - 201: created
 * - 400: invalid request (password too short)
 * - 403: forbidden (email mismatch or bad secret)
 * - 409: admin already exists
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, setupSecret } = body;

    const allowedEmail = process.env.ADMIN_EMAIL;
    if (!allowedEmail) return new Response("ADMIN_EMAIL not configured", { status: 500 });
    if (email !== allowedEmail) return new Response("Forbidden", { status: 403 });

    const configuredSecret = process.env.ADMIN_SETUP_SECRET;
    if (configuredSecret && setupSecret !== configuredSecret) {
      return new Response("Forbidden", { status: 403 });
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return new Response("Password must be at least 8 characters", { status: 400 });
    }

    const db = await getDb();
    const existing = await db.collection("admins").findOne({ email: allowedEmail });
    if (existing) return new Response("Admin already exists", { status: 409 });

    const passwordHash = await hashPassword(password);
    await db
      .collection("admins")
      .insertOne({ email: allowedEmail, passwordHash, createdAt: new Date() });

    return new Response(JSON.stringify({ ok: true }), { status: 201 });
  } catch (err: any) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
}
