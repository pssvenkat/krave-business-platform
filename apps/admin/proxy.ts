/**
 * Admin App Proxy (Next.js 16+)
 *
 * Milestone 1: Simple passthrough proxy with basic route protection structure.
 * Full Supabase Auth integration will be wired in Milestone 2.
 *
 * For now, all routes pass through (login page handles its own state).
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // Milestone 2: Add Supabase session refresh + RBAC checks here
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
