"use client";

/**
 * PostHog Analytics Provider
 *
 * Wrap your root layout's <body> with this provider.
 * Also includes automatic pageview tracking for Next.js App Router.
 *
 * @module analytics/provider
 */
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

// ─── Pageview Tracker ─────────────────────────────────────────────────────

/**
 * Tracks pageviews manually for Next.js App Router SPA navigation.
 * Must be wrapped in <Suspense> to avoid static rendering issues.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (pathname && ph) {
      ph.capture("$pageview", {
        $current_url: window.location.href,
      });
    }
  }, [pathname, searchParams, ph]);

  return null;
}

// ─── PostHog Provider ─────────────────────────────────────────────────────

interface PostHogProviderProps {
  children: React.ReactNode;
}

/**
 * PostHog analytics provider.
 * Initializes PostHog on mount and provides context to all child components.
 *
 * Required env vars:
 * - NEXT_PUBLIC_POSTHOG_KEY
 * - NEXT_PUBLIC_POSTHOG_HOST
 */
export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!key) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[PostHog] NEXT_PUBLIC_POSTHOG_KEY is not set");
      }
      return;
    }

    posthog.init(key, {
      api_host: host ?? "https://us.i.posthog.com",
      // Only create profiles for identified users (reduces cost)
      person_profiles: "identified_only",
      // Disable automatic pageview – we track manually for SPA
      capture_pageview: false,
      capture_pageleave: true,
      // Disable in development unless explicitly enabled
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") {
          ph.debug();
        }
      },
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      {/* Wrap in Suspense to prevent static rendering bailout */}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
