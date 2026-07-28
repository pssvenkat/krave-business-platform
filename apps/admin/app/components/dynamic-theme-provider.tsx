"use client";

import { useEffect, useState } from "react";
import { GroupedSiteTheme, generateThemeCss, DEFAULT_GROUPED_THEME } from "../lib/get-site-theme";

export function DynamicThemeProvider({ initialTheme }: { initialTheme: GroupedSiteTheme }) {
  const [theme, setTheme] = useState<GroupedSiteTheme>(initialTheme);

  useEffect(() => {
    // Check local storage for custom grouped theme
    const savedColors = localStorage.getItem("krave_grouped_theme_colors");
    if (savedColors) {
      try {
        const parsed = JSON.parse(savedColors);
        setTheme((prev) => ({
          ...prev,
          ...parsed,
        }));
      } catch {
        // ignore
      }
    }

    // Listen for real-time theme updates across browser tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "krave_grouped_theme_colors" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setTheme((prev) => ({
            ...prev,
            ...parsed,
          }));
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
