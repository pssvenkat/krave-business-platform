/**
 * Webinar App Proxy (Next.js 16+)
 *
 * Milestone 1: Simple passthrough proxy.
 * Session refresh with Supabase will be added in Milestone 2
 * once @supabase/ssr is wired up directly in the app.
 *
 * The webinar app is fully public — no auth protection needed.
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
