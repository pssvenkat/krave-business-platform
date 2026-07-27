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

export const PRESET_THEMES: ThemeConfig[] = [
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
  const [customColors, setCustomColors] = useState<{
    primary: string;
    background: string;
    foreground: string;
    accent: string;
  }>({
    primary: "#1e5631",
    background: "#f8faf5",
    foreground: "#143623",
    accent: "#6cc24a",
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    // Load active theme preference
    const savedId = localStorage.getItem("krave_website_theme");
    const savedColors = localStorage.getItem("krave_custom_theme_colors");

    if (savedId) setSelectedThemeId(savedId);
    if (savedColors) {
      try {
        setCustomColors(JSON.parse(savedColors));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSelectPreset = (preset: ThemeConfig) => {
    setSelectedThemeId(preset.id);
    setCustomColors({
      primary: preset.primary,
      background: preset.background,
      foreground: preset.foreground,
      accent: preset.accent,
    });
  };

  const handleSaveTheme = async () => {
    setSaving(true);
    setSuccessMsg(null);

    const activeConfig: ThemeConfig = {
      id: selectedThemeId,
      name:
        selectedThemeId === "custom"
          ? "Custom Brand Theme"
          : PRESET_THEMES.find((t) => t.id === selectedThemeId)?.name || "Custom Theme",
      primary: customColors.primary,
      background: customColors.background,
      foreground: customColors.foreground,
      accent: customColors.accent,
      description: "Custom brand color codes configured in Admin Settings.",
    };

    // Save locally
    localStorage.setItem("krave_website_theme", selectedThemeId);
    localStorage.setItem("krave_custom_theme_colors", JSON.stringify(customColors));

    // Save to Supabase setting row
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      await supabase.from("site_settings").upsert(
        {
          key: "color_theme",
          value: activeConfig,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );
    } catch {
      // Ignore if table not present
    }

    setSaving(false);
    setSuccessMsg("Website color codes saved successfully!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[#e2efe6] pb-4">
        <div>
          <h2 className="text-[#143623] font-bold text-lg">Website Color Theme & HEX Codes</h2>
          <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
            Customize exact hex color codes or choose a preset for your website.
          </p>
        </div>
        <span className="text-[#1e5631] text-xs font-bold bg-[#edf6f0] px-3 py-1 rounded-full border border-[#d0e6d6]">
          Live Branding
        </span>
      </div>

      {/* Preset Cards */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#143623] mb-3">
          1. Choose a Preset Theme
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRESET_THEMES.map((t) => {
            const isSelected = selectedThemeId === t.id;
            return (
              <div
                key={t.id}
                onClick={() => handleSelectPreset(t)}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-[#1e5631] bg-[#f0f7f2] shadow-sm"
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
      </div>

      {/* Custom HEX Color Code Pickers */}
      <div className="border border-[#d0e6d6] rounded-2xl p-5 bg-[#f8faf5]">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#143623]">
            2. Customize Exact HEX Color Codes
          </label>
          {selectedThemeId !== "custom" && (
            <button
              onClick={() => setSelectedThemeId("custom")}
              className="text-[#1e5631] text-xs font-bold hover:underline"
            >
              Set as Custom Theme
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Primary */}
          <div>
            <label className="block text-xs font-bold text-[#143623] mb-1.5">
              Primary Brand Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColors.primary}
                onChange={(e) => {
                  setSelectedThemeId("custom");
                  setCustomColors({ ...customColors, primary: e.target.value });
                }}
                className="w-10 h-10 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={customColors.primary}
                onChange={(e) => {
                  setSelectedThemeId("custom");
                  setCustomColors({ ...customColors, primary: e.target.value });
                }}
                placeholder="#1e5631"
                className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] text-xs font-mono font-bold focus:outline-none focus:border-[#1e5631]"
              />
            </div>
          </div>

          {/* Background */}
          <div>
            <label className="block text-xs font-bold text-[#143623] mb-1.5">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColors.background}
                onChange={(e) => {
                  setSelectedThemeId("custom");
                  setCustomColors({ ...customColors, background: e.target.value });
                }}
                className="w-10 h-10 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={customColors.background}
                onChange={(e) => {
                  setSelectedThemeId("custom");
                  setCustomColors({ ...customColors, background: e.target.value });
                }}
                placeholder="#f8faf5"
                className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] text-xs font-mono font-bold focus:outline-none focus:border-[#1e5631]"
              />
            </div>
          </div>

          {/* Foreground / Text */}
          <div>
            <label className="block text-xs font-bold text-[#143623] mb-1.5">
              Text / Typography Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColors.foreground}
                onChange={(e) => {
                  setSelectedThemeId("custom");
                  setCustomColors({ ...customColors, foreground: e.target.value });
                }}
                className="w-10 h-10 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={customColors.foreground}
                onChange={(e) => {
                  setSelectedThemeId("custom");
                  setCustomColors({ ...customColors, foreground: e.target.value });
                }}
                placeholder="#143623"
                className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] text-xs font-mono font-bold focus:outline-none focus:border-[#1e5631]"
              />
            </div>
          </div>

          {/* Accent */}
          <div>
            <label className="block text-xs font-bold text-[#143623] mb-1.5">
              Sprout Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColors.accent}
                onChange={(e) => {
                  setSelectedThemeId("custom");
                  setCustomColors({ ...customColors, accent: e.target.value });
                }}
                className="w-10 h-10 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={customColors.accent}
                onChange={(e) => {
                  setSelectedThemeId("custom");
                  setCustomColors({ ...customColors, accent: e.target.value });
                }}
                placeholder="#6cc24a"
                className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] text-xs font-mono font-bold focus:outline-none focus:border-[#1e5631]"
              />
            </div>
          </div>
        </div>

        {/* Live Swatch Preview */}
        <div
          className="rounded-xl p-5 border shadow-sm transition-all"
          style={{
            backgroundColor: customColors.background,
            borderColor: customColors.primary + "40",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4
              className="text-base font-black"
              style={{ color: customColors.foreground }}
            >
              Live Theme Preview
            </h4>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                backgroundColor: customColors.primary + "20",
                color: customColors.primary,
              }}
            >
              {customColors.primary}
            </span>
          </div>
          <p
            className="text-xs font-medium mb-4"
            style={{ color: customColors.foreground + "bb" }}
          >
            How buttons, background contrast, and typography will look on your website.
          </p>
          <button
            type="button"
            className="text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            style={{ backgroundColor: customColors.primary }}
          >
            Sample Button Action →
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-xs font-bold p-3 rounded-xl transition-all">
          ✓ {successMsg}
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={handleSaveTheme}
          disabled={saving}
          className="w-full sm:w-auto bg-[#1e5631] hover:bg-[#2d7d46] disabled:bg-gray-400 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          {saving ? "Saving Color Codes…" : "🎨 Save Theme & HEX Codes →"}
        </button>
      </div>
    </div>
  );
}
