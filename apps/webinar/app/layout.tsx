import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PostHogProvider } from "@krave/analytics/provider";
import { getSiteTheme } from "./lib/get-site-theme";
import { DynamicThemeProvider } from "./components/dynamic-theme-provider";

import "@krave/ui/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1a0f" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://webinar.kravemicrogreens.in"
  ),
  title: {
    default: "Krave Microgreens Webinar | Learn to Grow Microgreens",
    template: "%s | Krave Microgreens Webinar",
  },
  description:
    "Join our live webinar to discover how to grow profitable microgreens at home. Expert guidance from Krave Microgreens. Register for free today.",
  keywords: [
    "microgreens",
    "webinar",
    "grow microgreens",
    "krave microgreens",
    "microgreens farming",
    "free webinar",
    "online training",
  ],
  authors: [{ name: "Krave Microgreens", url: "https://kravemicrogreens.in" }],
  creator: "Krave Microgreens",
  publisher: "Krave Microgreens",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://webinar.kravemicrogreens.in",
    siteName: "Krave Microgreens Webinar",
    title: "Krave Microgreens Webinar | Learn to Grow Microgreens",
    description:
      "Join our live webinar to discover how to grow profitable microgreens at home. Expert guidance from Krave Microgreens.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Krave Microgreens Webinar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krave Microgreens Webinar | Learn to Grow Microgreens",
    description:
      "Join our live webinar to discover how to grow profitable microgreens at home.",
    images: ["/og-image.png"],
    creator: "@kravemicrogreens",
  },
  alternates: {
    canonical: "https://webinar.kravemicrogreens.in",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialTheme = await getSiteTheme();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <DynamicThemeProvider initialTheme={initialTheme} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
