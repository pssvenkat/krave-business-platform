/**
 * PostHog Server-Side Analytics Client
 *
 * Use in Server Components, Server Actions, and Route Handlers.
 * Always call shutdown() before the function terminates in serverless.
 *
 * @module analytics/server
 */
import { PostHog } from "posthog-node";

/**
 * Creates a PostHog server-side client.
 * Configured for serverless (immediate flush, no batching).
 */
export function createServerAnalytics(): PostHog {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  if (!key) {
    throw new Error(
      "[PostHog] NEXT_PUBLIC_POSTHOG_KEY is required for server-side analytics"
    );
  }

  return new PostHog(key, {
    host,
    flushAt: 1,       // Send immediately (don't batch)
    flushInterval: 0, // No interval batching in serverless
  });
}

/**
 * Tracks a server-side event safely (no-op if PostHog is not configured).
 * Automatically handles shutdown for serverless environments.
 *
 * @param distinctId - User ID or anonymous ID
 * @param event - Event name
 * @param properties - Additional event properties
 */
export async function trackServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return; // Gracefully skip if not configured

  const ph = createServerAnalytics();

  try {
    ph.capture({ distinctId, event, properties });
    await ph.shutdown();
  } catch (error) {
    // Never throw analytics errors – they should not break business logic
    if (process.env.NODE_ENV === "development") {
      console.error("[PostHog] Failed to track event:", error);
    }
  }
}

// ─── Krave-specific event helpers ─────────────────────────────────────────

/**
 * Tracks a webinar registration event.
 */
export async function trackRegistration(
  registrationId: string,
  webinarId: string,
  properties?: Record<string, unknown>
): Promise<void> {
  await trackServerEvent(registrationId, "webinar_registration", {
    webinar_id: webinarId,
    ...properties,
  });
}

/**
 * Tracks a webinar attendance event.
 */
export async function trackAttendance(
  registrationId: string,
  webinarId: string
): Promise<void> {
  await trackServerEvent(registrationId, "webinar_attended", {
    webinar_id: webinarId,
  });
}

/**
 * Tracks an admin login event.
 */
export async function trackAdminLogin(userId: string): Promise<void> {
  await trackServerEvent(userId, "admin_login");
}
