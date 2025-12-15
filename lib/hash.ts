import bcrypt from "bcryptjs";

/**
 * Hash a plaintext password.
 *
 * Uses bcrypt with a salt rounds of 10. This function is async and returns
 * the hashed password string suitable for storage in the DB.
 */
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

/**
 * Compare a plaintext password with a stored bcrypt hash.
 *
 * Returns `true` when the password matches the hash.
 */
export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
