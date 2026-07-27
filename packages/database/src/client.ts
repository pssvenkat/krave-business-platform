/**
 * Supabase Browser Client
 *
 * Use in Client Components ('use client') and browser-side code.
 * Creates a singleton browser client using the public anon key.
 *
 * @module database/client
 */
import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./types";

/**
 * Creates a Supabase browser client.
 * Safe to call multiple times – Supabase SDK handles singleton internally.
 *
 * @returns Typed Supabase client for browser use
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
