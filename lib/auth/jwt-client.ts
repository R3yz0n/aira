/**
 * Lightweight JWT payload decoder for client-side use.
 * Does NOT verify signature; only decodes payload to read `exp`.
 */

type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

function base64UrlDecode(input: string): string {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const normalized = b64 + pad;
  if (typeof window === "undefined") {
    // Node.js fallback
    return Buffer.from(normalized, "base64").toString("utf-8");
  }
  // Browser
  try {
    return atob(normalized);
  } catch {
    // Some environments may not have atob; fallback to Buffer if available
    const g: any = globalThis as any;
    if (g?.Buffer) {
      return g.Buffer.from(normalized, "base64").toString("utf-8");
    }
    throw new Error("Unable to decode base64url string");
  }
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson) as JwtPayload;
  } catch {
    return null;
  }
}

export function getTokenExpiry(token: string): number | null {
  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;
  return typeof exp === "number" ? exp : null;
}

/**
 * Returns true if the token is expired compared to current time.
 * Optional `skewSeconds` allows small clock skew tolerance.
 */
export function isTokenExpired(token: string, skewSeconds = 5): boolean {
  const exp = getTokenExpiry(token);
  if (!exp) return true; // treat missing exp as expired/invalid
  const now = Math.floor(Date.now() / 1000);
  return now + skewSeconds >= exp;
}
