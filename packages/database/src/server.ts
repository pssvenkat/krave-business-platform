/**
 * Supabase Server Client
 *
 * Use in Server Components, Server Actions, and Route Handlers.
 * Reads/writes session cookies via Next.js cookies() API.
 *
 * IMPORTANT: Always use supabase.auth.getUser() for authentication checks.
 * Never use getSession() for security decisions – it only decodes the JWT locally.
 *
 * @module database/server
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "./types";

/**
 * Creates a Supabase server client with cookie-based session management.
 *
 * Must be called inside a Server Component, Server Action, or Route Handler
 * where Next.js cookies() is available.
 *
 * @returns Typed Supabase client for server use
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component – safe to ignore.
            // Session refresh is handled by middleware.
          }
        },
      },
    }
  );
}

/**
 * Creates a Supabase server client with the service role key.
 * ONLY use for privileged server-side operations (e.g., admin user creation).
 * NEVER expose this client to the browser.
 *
 * @returns Typed Supabase admin client
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore – called from Server Component
          }
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
