import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicConfig } from "./public-env";

let cachedAdminClient: SupabaseClient | undefined;

function getSupabaseServerSecret(): string {
  const secret =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret) {
    throw new Error(
      "Supabase server secret is missing. Set SUPABASE_SECRET_KEY (preferred) or SUPABASE_SERVICE_ROLE_KEY (legacy) only in the server environment.",
    );
  }

  return secret;
}

export function createSupabaseAdminClient(): SupabaseClient {
  if (cachedAdminClient) {
    return cachedAdminClient;
  }

  const { url } = getSupabasePublicConfig();

  cachedAdminClient = createClient(url, getSupabaseServerSecret(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return cachedAdminClient;
}
