import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = "";

function getSupabaseUrl(): string | null {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  if (
    !url ||
    !url.startsWith("https://") ||
    url.includes("your_supabase_project_url_here")
  ) {
    return null;
  }
  return url;
}

function getSupabaseServiceRoleKey(): string | null {
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!key || key.includes("your_supabase")) {
    return null;
  }
  return key;
}

/**
 * Returns true only when both SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
 * and SUPABASE_SERVICE_ROLE_KEY are validly configured for server-side access.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

/**
 * Returns a server-only Supabase admin client authenticated with the Service Role key.
 * Returns null if credentials are not configured (never simulates a connection).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const serviceKey = getSupabaseServiceRoleKey();
  if (!url || !serviceKey) return null;

  const configKey = `${url}:${serviceKey.length}`;
  if (cachedClient && cachedConfigKey === configKey) {
    return cachedClient;
  }

  cachedClient = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  cachedConfigKey = configKey;
  return cachedClient;
}
