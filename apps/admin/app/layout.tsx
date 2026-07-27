import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PostHogProvider } from "@krave/analytics/provider";

import "@krave/ui/styles";

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
    index: false,  // Admin is not publicly indexed
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
