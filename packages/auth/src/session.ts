/**
 * Session Utilities
 *
 * Server-side helpers for getting the current user and admin role.
 * Use in Server Components and Route Handlers.
 *
 * @module auth/session
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@krave/database/types";
import type { UserRole } from "@krave/types";

/**
 * Gets the currently authenticated user from Supabase Auth.
 * Returns null if not authenticated.
 *
 * Uses getUser() which validates against the Supabase Auth server – safe for security.
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
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
            // Server Component – handled by middleware
          }
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return user;
}

/**
 * Gets the admin role for the currently authenticated user.
 * Returns null if the user is not an admin.
 */
export async function getAdminRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
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
            // Server Component – handled by middleware
          }
        },
      },
    }
  );

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  return (adminUser?.role as UserRole) ?? null;
}

/**
 * Asserts that the current request is authenticated.
 * Throws a Response (401) if not authenticated.
 * Use in Route Handlers.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Response(
      JSON.stringify({ success: false, error: "Authentication required" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  return user;
}

/**
 * Asserts that the current request has an admin role.
 * Throws a Response (401/403) if not authorized.
 * Use in Route Handlers.
 *
 * @param minimumRole - Minimum role required (default: "viewer")
 */
export async function requireAdminRole(minimumRole: UserRole = "viewer") {
  const user = await requireAuth();
  const role = await getAdminRole();

  if (!role) {
    throw new Response(
      JSON.stringify({ success: false, error: "Admin access required" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const hierarchy: Record<UserRole, number> = {
    super_admin: 3,
    admin: 2,
    viewer: 1,
  };

  if (hierarchy[role] < hierarchy[minimumRole]) {
    throw new Response(
      JSON.stringify({
        success: false,
        error: "Insufficient permissions",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  return { user, role };
}
