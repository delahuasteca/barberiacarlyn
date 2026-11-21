import { NextRequest } from "next/server";
import crypto from "crypto";

export const OWNER_SESSION_COOKIE = "carlyn_owner_session";
const DEFAULT_SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Returns the configured owner password from environment variables, or null if missing.
 * Never falls back to a hardcoded password.
 */
export function getOwnerPassword(): string | null {
  const pwd = process.env.OWNER_DASHBOARD_PASSWORD;
  if (!pwd || pwd.trim().length === 0) return null;
  return pwd;
}

/**
 * Returns the configured HMAC signing secret from environment variables, or null if missing.
 * Never falls back to a hardcoded secret or to the password.
 */
export function getOwnerAuthSecret(): string | null {
  const secret = process.env.OWNER_AUTH_SECRET;
  if (!secret || secret.trim().length === 0) return null;
  return secret;
}

/**
 * Confirms both OWNER_DASHBOARD_PASSWORD and OWNER_AUTH_SECRET are configured.
 * If either is missing, authentication fails closed.
 */
export function isAuthConfigured(): boolean {
  return Boolean(getOwnerPassword() && getOwnerAuthSecret());
}

/**
 * Constant-time verification of the owner password using SHA-256 digests.
 */
export function verifyOwnerPassword(candidate: string): boolean {
  const expected = getOwnerPassword();
  const secret = getOwnerAuthSecret();
  if (!expected || !secret || !candidate) return false;

  const candidateDigest = crypto.createHash("sha256").update(candidate, "utf8").digest();
  const expectedDigest = crypto.createHash("sha256").update(expected, "utf8").digest();
  return crypto.timingSafeEqual(candidateDigest, expectedDigest);
}

/**
 * Derives a signed HMAC-SHA256 session token using OWNER_AUTH_SECRET.
 * Throws if required environment variables are not configured.
 */
export function generateSessionToken(): string {
  const secret = getOwnerAuthSecret();
  const password = getOwnerPassword();
  if (!secret || !password) {
    throw new Error("Owner authentication environment variables are not configured");
  }

  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}:${random}`)
    .digest("hex");
  return `${timestamp}.${random}.${hash}`;
}

/**
 * Verifies if a given session token is valid, properly signed, and not expired.
 * Fails closed if required environment variables are missing.
 */
export function verifySessionToken(token: string): boolean {
  if (!token) return false;

  const secret = getOwnerAuthSecret();
  const password = getOwnerPassword();
  if (!secret || !password) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [timestamp, random, hash] = parts;
  const createdTime = parseInt(timestamp, 10);
  if (isNaN(createdTime)) return false;

  // Reject future-dated or expired tokens (max validity 7 days)
  const ageMs = Date.now() - createdTime;
  if (ageMs < 0 || ageMs > DEFAULT_SESSION_DURATION * 1000) {
    return false;
  }

  const expectedHash = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}:${random}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(expectedHash, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Validates request cookies to ensure only the authenticated owner has access.
 */
export function isOwnerAuthenticated(request: NextRequest): boolean {
  if (!isAuthConfigured()) return false;
  const token = request.cookies.get(OWNER_SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}
