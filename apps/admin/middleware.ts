/**
 * Admin App Middleware
 *
 * Enforces authentication on all admin routes.
 * Unauthenticated users are redirected to /login.
 * Authenticated users visiting /login are redirected to /dashboard.
 */
import type { NextRequest } from "next/server";
import { updateSession } from "@krave/auth/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request, {
    protectedPaths: ["/dashboard", "/webinars", "/registrations", "/crm", "/analytics", "/settings"],
    loginPath: "/login",
    dashboardPath: "/dashboard",
    authPaths: ["/login"],
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
