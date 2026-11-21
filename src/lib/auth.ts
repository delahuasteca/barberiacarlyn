import { NextRequest } from "next/server";
import crypto from "crypto";

export const OWNER_SESSION_COOKIE = "carlyn_owner_session";
const DEFAULT_SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Returns the configured owner password or a fallback for local secure authentication.
 * Can be overridden via OWNER_DASHBOARD_PASSWORD in environment variables.
 */
export function getOwnerPassword(): string {
  return process.env.OWNER_DASHBOARD_PASSWORD || "Carlyn@Huejutla2026";
}

/**
 * Derives a secure session token hash from the owner secret and a salt.
 */
export function generateSessionToken(): string {
  const secret = process.env.OWNER_AUTH_SECRET || getOwnerPassword();
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}:${random}`)
    .digest("hex");
  return `${timestamp}.${random}.${hash}`;
}

/**
 * Verifies if a given session token is valid and not expired.
 */
export function verifySessionToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [timestamp, random, hash] = parts;
  const createdTime = parseInt(timestamp, 10);
  if (isNaN(createdTime)) return false;

  // Max validity 7 days
  if (Date.now() - createdTime > DEFAULT_SESSION_DURATION * 1000) {
    return false;
  }

  const secret = process.env.OWNER_AUTH_SECRET || getOwnerPassword();
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
  const token = request.cookies.get(OWNER_SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}
