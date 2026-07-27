/**
 * @krave/analytics
 * Public API for the analytics package.
 *
 * Note: Provider is exported separately to avoid SSR issues:
 * import { PostHogProvider } from "@krave/analytics/provider"
 */

// Server-side analytics
export {
  createServerAnalytics,
  trackServerEvent,
  trackRegistration,
  trackAttendance,
  trackAdminLogin,
} from "./server";

// Provider (re-exported for convenience, but also importable from ./provider)
export { PostHogProvider } from "./provider";
