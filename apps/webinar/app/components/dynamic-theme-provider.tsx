"use client";

import { useEffect, useState } from "react";
import { SiteTheme, DEFAULT_THEME, generateThemeCss } from "../lib/get-site-theme";

export function DynamicThemeProvider({ initialTheme }: { initialTheme: SiteTheme }) {
  const [theme, setTheme] = useState<SiteTheme>(initialTheme);

  useEffect(() => {
    // Check if client local storage has an active custom theme
    const savedColors = localStorage.getItem("krave_custom_theme_colors");
    if (savedColors) {
      try {
        const parsed = JSON.parse(savedColors);
        if (parsed.primary && parsed.background && parsed.foreground) {
          setTheme({
            primary: parsed.primary,
            background: parsed.background,
            foreground: parsed.foreground,
            accent: parsed.accent || "#6cc24a",
          });
        }
      } catch {
        // ignore
      }
    }

    // Listen for real-time theme updates across browser tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "krave_custom_theme_colors" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setTheme({
            primary: parsed.primary,
            background: parsed.background,
            foreground: parsed.foreground,
            accent: parsed.accent || "#6cc24a",
          });
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <style
      id="dynamic-krave-theme"
      dangerouslySetInnerHTML={{ __html: generateThemeCss(theme) }}
    />
  );
}
