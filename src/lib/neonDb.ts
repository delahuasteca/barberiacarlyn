import { neon, NeonQueryFunction } from "@neondatabase/serverless";

let cachedSql: NeonQueryFunction<false, false> | null = null;
let cachedKey = "";

function getDatabaseUrl(): string | null {
  const url = (process.env.DATABASE_URL || "").trim();
  if (
    !url ||
    (!url.startsWith("postgres://") && !url.startsWith("postgresql://")) ||
    url.includes("your_")
  ) {
    return null;
  }
  return url;
}

/**
 * Returns true when DATABASE_URL is validly configured for Neon PostgreSQL.
 */
export function isNeonConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

/**
 * Returns a server-only Neon HTTP SQL client, or null if DATABASE_URL is not set.
 * Never simulates a connection or exposes connection strings.
 */
export function getNeonSql(): NeonQueryFunction<false, false> | null {
  const url = getDatabaseUrl();
  if (!url) return null;

  const key = `${url.length}:${url.slice(0, 20)}`;
  if (cachedSql && cachedKey === key) {
    return cachedSql;
  }

  cachedSql = neon(url);
  cachedKey = key;
  return cachedSql;
}
