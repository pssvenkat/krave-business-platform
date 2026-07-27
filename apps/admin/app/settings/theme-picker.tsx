"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export interface ThemeConfig {
  id: string;
  name: string;
  primary: string;
  background: string;
  foreground: string;
  accent: string;
  description: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: "organic",
    name: "Organic Botanical (Default)",
    primary: "#1e5631",
    background: "#f8faf5",
    foreground: "#143623",
    accent: "#6cc24a",
    description: "Light botanical green with dark forest typography and fresh sprout accents.",
  },
  {
    id: "emerald",
    name: "Emerald Luxe",
    primary: "#059669",
    background: "#f0fdf4",
    foreground: "#064e3b",
    accent: "#10b981",
    description: "Vivid mint background with deep emerald accents and clean contrast.",
  },
  {
    id: "earth",
    name: "Earth & Sage",
    primary: "#3f6212",
    background: "#fdfbf7",
    foreground: "#362111",
    accent: "#84cc16",
    description: "Warm parchment background with natural sage green and earthy tones.",
  },
  {
    id: "dark",
    name: "Midnight Garden (Dark Mode)",
    primary: "#10b981",
    background: "#0f172a",
    foreground: "#f8fafc",
    accent: "#34d399",
    description: "Sleek dark slate background with glowing neon emerald highlights.",
  },
];

export function ThemePicker() {
  const [selectedThemeId, setSelectedThemeId] = useState<string>("organic");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    // Load active theme preference
    const saved = localStorage.getItem("krave_website_theme");
    if (saved) {
      setSelectedThemeId(saved);
    }
  }, []);

  const handleSaveTheme = async (themeId: string) => {
    setSelectedThemeId(themeId);
    setSaving(true);
    setSuccessMsg(null);

    // Save locally
    localStorage.setItem("krave_website_theme", themeId);

    const themeObj = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
    if (!themeObj) {
      setSaving(false);
      return;
    }

    // Save to Supabase setting row
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      await supabase.from("site_settings").upsert(
        {
          key: "color_theme",
          value: themeObj,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );
    } catch {
      // Ignore if table not present
    }

    setSaving(false);
    setSuccessMsg(`Website theme set to "${themeObj.name}"!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[#143623] font-bold text-lg">Website Color Theme</h2>
        <span className="text-[#1e5631] text-xs font-bold bg-[#edf6f0] px-3 py-1 rounded-full border border-[#d0e6d6]">
          Live Branding
        </span>
      </div>
      <p className="text-[#4a6b57] text-sm mb-6 font-medium">
        Select the visual theme for your public webinar landing pages and registration screens.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {THEMES.map((t) => {
          const isSelected = selectedThemeId === t.id;
          return (
            <div
              key={t.id}
              onClick={() => handleSaveTheme(t.id)}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 ${
                isSelected
                  ? "border-[#1e5631] bg-[#f0f7f2] shadow-md"
                  : "border-[#e2efe6] bg-white hover:border-[#b8dbc3] hover:bg-[#f8faf5]"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#143623] font-extrabold text-sm flex items-center gap-2">
                  {isSelected && <span className="text-[#1e5631]">✓</span>}
                  {t.name}
                </span>

                {/* Color swatches */}
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg border border-gray-200">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: t.background }}
                    title={`Background: ${t.background}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: t.primary }}
                    title={`Primary: ${t.primary}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: t.foreground }}
                    title={`Foreground: ${t.foreground}`}
                  />
                </div>
              </div>

              <p className="text-[#4a6b57] text-xs font-medium leading-relaxed">
                {t.description}
              </p>
            </div>
          );
        })}
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-xs font-bold p-3 rounded-xl transition-all">
          ✓ {successMsg}
        </div>
      )}
    </div>
  );
}
