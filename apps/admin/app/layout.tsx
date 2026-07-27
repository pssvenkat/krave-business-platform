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
  themeColor: "#1a3c2e",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://admin.kravemicrogreens.in"
  ),
  title: {
    default: "Krave Admin",
    template: "%s | Krave Admin",
  },
  description: "Krave Microgreens Admin Dashboard",
  robots: {
    index: false,
    follow: false,
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
