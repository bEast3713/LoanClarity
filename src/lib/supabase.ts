import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

export function createSupabaseAdmin() {
  const url = env("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = env("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  const key = serviceRoleKey ?? anonKey;
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

