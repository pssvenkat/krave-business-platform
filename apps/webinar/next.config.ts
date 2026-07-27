import type { NextConfig } from "next";

/**
 * Security Headers for the Webinar App
 *
 * Applied to all responses via Next.js headers() config.
 * These headers significantly improve security posture.
 */
const securityHeaders = [
  // Prevent MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Prevent iframe embedding (clickjacking)
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // XSS protection (legacy browsers)
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Referrer Policy
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Permissions Policy (disable sensitive APIs)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS (force HTTPS for 1 year)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Allow YouTube embeds
      "frame-src https://www.youtube.com https://youtube.com",
      // Inline scripts for Next.js hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
      // Styles
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images
      "img-src 'self' data: blob: https:",
      // API connections
      [
        "connect-src 'self'",
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        "https://us.i.posthog.com",
        "https://eu.i.posthog.com",
        "https://challenges.cloudflare.com",
      ].join(" "),
      // Media (YouTube)
      "media-src 'self' https:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Experimental features for performance
  experimental: {
    // Enable partial prerendering for better performance
    ppr: false, // Enable when stable in your Next.js version
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Transpile workspace packages
  transpilePackages: [
    "@krave/ui",
    "@krave/analytics",
    "@krave/utils",
    "@krave/types",
    "@krave/database",
    "@krave/validation",
    "@krave/emails",
  ],
};

export default nextConfig;
