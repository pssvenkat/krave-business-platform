/**
 * Webinar App Middleware
 *
 * Refreshes Supabase auth sessions on every request.
 * The webinar app is public – no route protection needed here.
 * Session refresh is still needed for server-side auth utilities.
 */
import type { NextRequest } from "next/server";
import { updateSession } from "@krave/auth/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request, {
    protectedPaths: [], // Webinar app is fully public
    loginPath: "/",
    dashboardPath: "/",
    authPaths: [],
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Public assets (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
