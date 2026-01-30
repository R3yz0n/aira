import jwt from "jsonwebtoken";

/**
 * JWT helpers
 *
 * Requires `JWT_SECRET` env var to sign and verify tokens. Tokens are used by
 * the admin API to authenticate requests. Keep the secret secure.
 */
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET environment variable is required");
const JWT_SECRET: jwt.Secret = secret;

/**
 * Sign a JWT with a payload. By default the token expires in 2 hours.
 *
 * Payload should be a small object containing identifying claims (e.g. `sub`, `email`).
 */

export function signToken(
  payload: string | object | Buffer,
  expiresIn: jwt.SignOptions["expiresIn"] = "1h",
) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT. Throws if invalid or expired.
 */
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
