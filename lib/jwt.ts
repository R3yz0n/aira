import jwt from "jsonwebtoken";

/**
 * JWT helpers
 *
 * Requires `JWT_SECRET` env var to sign and verify tokens. Tokens are used by
 * the admin API to authenticate requests. Keep the secret secure.
 */
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is required");

/**
 * Sign a JWT with a payload. By default the token expires in 2 hours.
 *
 * Payload should be a small object containing identifying claims (e.g. `sub`, `email`).
 */
export function signToken(payload: object, expiresIn = "2h") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a JWT. Throws if invalid or expired.
 */
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
