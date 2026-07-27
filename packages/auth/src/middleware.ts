/**
 * Supabase Auth Middleware Helper
 *
 * Refreshes user sessions and enforces authentication on protected routes.
 * Import and call this from each app's middleware.ts.
 *
 * @module auth/middleware
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@krave/database/types";

export interface MiddlewareConfig {
  /** Routes that require authentication. Prefix match. */
  protectedPaths?: string[];
  /** Route to redirect to when unauthenticated. Default: /login */
  loginPath?: string;
  /** Route to redirect to when authenticated (e.g., from login page). Default: /dashboard */
  dashboardPath?: string;
  /** Routes that should redirect authenticated users away (e.g., /login). */
  authPaths?: string[];
}

const DEFAULT_CONFIG: Required<MiddlewareConfig> = {
  protectedPaths: ["/dashboard", "/api/admin"],
  loginPath: "/login",
  dashboardPath: "/dashboard",
  authPaths: ["/login"],
};

/**
 * Updates the user session and enforces route protection.
 *
 * IMPORTANT: Must be called in every app's middleware.ts to keep sessions fresh.
 * The Supabase session refresh MUST happen in middleware – not in Server Components.
 *
 * @param request - Incoming Next.js request
 * @param config - Route protection configuration
 */
export async function updateSession(
  request: NextRequest,
  config: MiddlewareConfig = {}
): Promise<NextResponse> {
  const resolvedConfig = { ...DEFAULT_CONFIG, ...config };

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Always use getUser() – validates against Supabase Auth server
  // getSession() only decodes JWT locally and is NOT safe for auth decisions
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Redirect unauthenticated users away from protected routes
  const isProtected = resolvedConfig.protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  if (isProtected && !user) {
    const loginUrl = new URL(resolvedConfig.loginPath, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  const isAuthPage = resolvedConfig.authPaths.some((path) =>
    pathname.startsWith(path)
  );
  if (isAuthPage && user) {
    return NextResponse.redirect(
      new URL(resolvedConfig.dashboardPath, request.url)
    );
  }

  return supabaseResponse;
}
