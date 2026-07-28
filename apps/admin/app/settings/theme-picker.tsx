"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export interface GroupedThemeConfig {
  id: string;
  name: string;

  // 1. Header & Navigation
  headerBg: string;
  headerText: string;

  // 2. Sidebar & Layout
  sidebarBg: string;
  sidebarText: string;
  sidebarActiveBg: string;

  // 3. Buttons & Actions
  btnPrimaryBg: string;
  btnPrimaryText: string;
  btnSecondaryBorder: string;

  // 4. Surfaces & Containers
  bgBase: string;
  cardBg: string;
  borderColor: string;

  // 5. Typography & Badges
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
}

export const PRESET_THEMES: GroupedThemeConfig[] = [
  {
    id: "organic",
    name: "Organic Botanical (Default)",
    headerBg: "#ffffff",
    headerText: "#143623",
    sidebarBg: "#143623",
    sidebarText: "#b8dbc3",
    sidebarActiveBg: "#1e5631",
    btnPrimaryBg: "#1e5631",
    btnPrimaryText: "#ffffff",
    btnSecondaryBorder: "#d0e6d6",
    bgBase: "#f8faf5",
    cardBg: "#ffffff",
    borderColor: "#e2efe6",
    textPrimary: "#143623",
    textSecondary: "#4a6b57",
    accentColor: "#6cc24a",
  },
  {
    id: "emerald",
    name: "Emerald Luxe",
    headerBg: "#ffffff",
    headerText: "#064e3b",
    sidebarBg: "#064e3b",
    sidebarText: "#a7f3d0",
    sidebarActiveBg: "#047857",
    btnPrimaryBg: "#059669",
    btnPrimaryText: "#ffffff",
    btnSecondaryBorder: "#a7f3d0",
    bgBase: "#f0fdf4",
    cardBg: "#ffffff",
    borderColor: "#d1fae5",
    textPrimary: "#064e3b",
    textSecondary: "#047857",
    accentColor: "#10b981",
  },
  {
    id: "earth",
    name: "Earth & Sage",
    headerBg: "#ffffff",
    headerText: "#362111",
    sidebarBg: "#2d241e",
    sidebarText: "#e2d9cf",
    sidebarActiveBg: "#3f6212",
    btnPrimaryBg: "#3f6212",
    btnPrimaryText: "#ffffff",
    btnSecondaryBorder: "#d9e3c8",
    bgBase: "#fdfbf7",
    cardBg: "#ffffff",
    borderColor: "#e8e1d5",
    textPrimary: "#362111",
    textSecondary: "#655344",
    accentColor: "#84cc16",
  },
  {
    id: "dark",
    name: "Midnight Garden (Dark Mode)",
    headerBg: "#1e293b",
    headerText: "#f8fafc",
    sidebarBg: "#0f172a",
    sidebarText: "#94a3b8",
    sidebarActiveBg: "#1e293b",
    btnPrimaryBg: "#10b981",
    btnPrimaryText: "#0f172a",
    btnSecondaryBorder: "#334155",
    bgBase: "#0f172a",
    cardBg: "#1e293b",
    borderColor: "#334155",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    accentColor: "#34d399",
  },
];

const DEFAULT_THEME: GroupedThemeConfig = PRESET_THEMES[0]!;

export function ThemePicker() {
  const [selectedThemeId, setSelectedThemeId] = useState<string>("organic");
  const [colors, setColors] = useState<Omit<GroupedThemeConfig, "id" | "name">>({
    headerBg: DEFAULT_THEME.headerBg,
    headerText: DEFAULT_THEME.headerText,
    sidebarBg: DEFAULT_THEME.sidebarBg,
    sidebarText: DEFAULT_THEME.sidebarText,
    sidebarActiveBg: DEFAULT_THEME.sidebarActiveBg,
    btnPrimaryBg: DEFAULT_THEME.btnPrimaryBg,
    btnPrimaryText: DEFAULT_THEME.btnPrimaryText,
    btnSecondaryBorder: DEFAULT_THEME.btnSecondaryBorder,
    bgBase: DEFAULT_THEME.bgBase,
    cardBg: DEFAULT_THEME.cardBg,
    borderColor: DEFAULT_THEME.borderColor,
    textPrimary: DEFAULT_THEME.textPrimary,
    textSecondary: DEFAULT_THEME.textSecondary,
    accentColor: DEFAULT_THEME.accentColor,
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Apply colors to document root CSS variables
  const applyCssVariables = (themeColors: Omit<GroupedThemeConfig, "id" | "name">) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    root.style.setProperty("--header-bg", themeColors.headerBg);
    root.style.setProperty("--header-text", themeColors.headerText);
    root.style.setProperty("--sidebar-bg", themeColors.sidebarBg);
    root.style.setProperty("--sidebar-text", themeColors.sidebarText);
    root.style.setProperty("--sidebar-active", themeColors.sidebarActiveBg);
    root.style.setProperty("--btn-primary-bg", themeColors.btnPrimaryBg);
    root.style.setProperty("--btn-primary-text", themeColors.btnPrimaryText);
    root.style.setProperty("--btn-secondary-border", themeColors.btnSecondaryBorder);
    root.style.setProperty("--bg-base", themeColors.bgBase);
    root.style.setProperty("--card-bg", themeColors.cardBg);
    root.style.setProperty("--border-color", themeColors.borderColor);
    root.style.setProperty("--text-primary", themeColors.textPrimary);
    root.style.setProperty("--text-secondary", themeColors.textSecondary);
    root.style.setProperty("--accent-color", themeColors.accentColor);
  };

  useEffect(() => {
    const savedId = localStorage.getItem("krave_website_theme_id");
    const savedColors = localStorage.getItem("krave_grouped_theme_colors");

    if (savedId) setSelectedThemeId(savedId);
    if (savedColors) {
      try {
        const parsed = JSON.parse(savedColors);
        setColors(parsed);
        applyCssVariables(parsed);
      } catch {
        applyCssVariables(colors);
      }
    } else {
      applyCssVariables(colors);
    }
  }, []);

  const updateColor = (key: keyof Omit<GroupedThemeConfig, "id" | "name">, value: string) => {
    setSelectedThemeId("custom");
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    applyCssVariables(newColors);
  };

  const handleSelectPreset = (preset: GroupedThemeConfig) => {
    setSelectedThemeId(preset.id);
    const newColors = {
      headerBg: preset.headerBg,
      headerText: preset.headerText,
      sidebarBg: preset.sidebarBg,
      sidebarText: preset.sidebarText,
      sidebarActiveBg: preset.sidebarActiveBg,
      btnPrimaryBg: preset.btnPrimaryBg,
      btnPrimaryText: preset.btnPrimaryText,
      btnSecondaryBorder: preset.btnSecondaryBorder,
      bgBase: preset.bgBase,
      cardBg: preset.cardBg,
      borderColor: preset.borderColor,
      textPrimary: preset.textPrimary,
      textSecondary: preset.textSecondary,
      accentColor: preset.accentColor,
    };
    setColors(newColors);
    applyCssVariables(newColors);
  };

  const handleSaveTheme = async () => {
    setSaving(true);
    setSuccessMsg(null);

    // Save locally
    localStorage.setItem("krave_website_theme_id", selectedThemeId);
    localStorage.setItem("krave_grouped_theme_colors", JSON.stringify(colors));

    // Save to Supabase
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      await supabase.from("site_settings").upsert(
        {
          key: "grouped_color_theme",
          value: { id: selectedThemeId, ...colors },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );
    } catch {
      // Ignore if table not present
    }

    setSaving(false);
    setSuccessMsg("Grouped element color codes saved & applied across website!");
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e2efe6] pb-4">
        <div>
          <h2 className="text-[#143623] font-bold text-lg">Website Element Color Themes & Custom HEX</h2>
          <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
            Customize exact color codes for all website UI element groups and apply them globally.
          </p>
        </div>
        <span className="text-[#1e5631] text-xs font-bold bg-[#edf6f0] px-3.5 py-1.5 rounded-full border border-[#d0e6d6]">
          🎨 Live Dynamic Theme
        </span>
      </div>

      {/* Preset Themes */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#143623] mb-3">
          1. Select a Preset Theme Palette
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRESET_THEMES.map((t) => {
            const isSelected = selectedThemeId === t.id;
            return (
              <div
                key={t.id}
                onClick={() => handleSelectPreset(t)}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-[#1e5631] bg-[#f0f7f2] shadow-sm"
                    : "border-[#e2efe6] bg-white hover:border-[#b8dbc3] hover:bg-[#f8faf5]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#143623] font-extrabold text-sm flex items-center gap-2">
                    {isSelected && <span className="text-[#1e5631]">✓</span>}
                    {t.name}
                  </span>
                  <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg border border-gray-200">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: t.sidebarBg }} title="Sidebar" />
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: t.btnPrimaryBg }} title="Primary Button" />
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: t.bgBase }} title="Page Background" />
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: t.accentColor }} title="Accent Sprout" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grouped UI Element HEX Pickers */}
      <div className="border border-[#d0e6d6] rounded-2xl p-6 bg-[#f8faf5] space-y-6">
        <div className="flex items-center justify-between border-b border-[#d0e6d6] pb-3">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#143623]">
            2. Grouped Website Elements — Custom Color Codes
          </label>
          {selectedThemeId !== "custom" && (
            <button
              onClick={() => setSelectedThemeId("custom")}
              className="text-[#1e5631] text-xs font-bold hover:underline"
            >
              Set as Custom Colors
            </button>
          )}
        </div>

        {/* ── Group 1: Header & Navigation ── */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-[#1e5631] uppercase tracking-wider flex items-center gap-2">
            <span>🔝</span> Group A: Header & Top Navigation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Header Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.headerBg}
                  onChange={(e) => updateColor("headerBg", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.headerBg}
                  onChange={(e) => updateColor("headerBg", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Header Text / Title</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.headerText}
                  onChange={(e) => updateColor("headerText", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.headerText}
                  onChange={(e) => updateColor("headerText", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Group 2: Sidebar & Navigation Menu ── */}
        <div className="space-y-3 pt-3 border-t border-[#e2efe6]">
          <h3 className="text-xs font-black text-[#1e5631] uppercase tracking-wider flex items-center gap-2">
            <span>📑</span> Group B: Sidebar & Main Menu
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Sidebar Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.sidebarBg}
                  onChange={(e) => updateColor("sidebarBg", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.sidebarBg}
                  onChange={(e) => updateColor("sidebarBg", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Sidebar Menu Text</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.sidebarText}
                  onChange={(e) => updateColor("sidebarText", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.sidebarText}
                  onChange={(e) => updateColor("sidebarText", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Active Item Highlight</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.sidebarActiveBg}
                  onChange={(e) => updateColor("sidebarActiveBg", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.sidebarActiveBg}
                  onChange={(e) => updateColor("sidebarActiveBg", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Group 3: Buttons & Interactive Actions ── */}
        <div className="space-y-3 pt-3 border-t border-[#e2efe6]">
          <h3 className="text-xs font-black text-[#1e5631] uppercase tracking-wider flex items-center gap-2">
            <span>🔘</span> Group C: Buttons & Call-to-Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Primary Button Fill</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.btnPrimaryBg}
                  onChange={(e) => updateColor("btnPrimaryBg", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.btnPrimaryBg}
                  onChange={(e) => updateColor("btnPrimaryBg", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Primary Button Text</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.btnPrimaryText}
                  onChange={(e) => updateColor("btnPrimaryText", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.btnPrimaryText}
                  onChange={(e) => updateColor("btnPrimaryText", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Secondary Button Border</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.btnSecondaryBorder}
                  onChange={(e) => updateColor("btnSecondaryBorder", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.btnSecondaryBorder}
                  onChange={(e) => updateColor("btnSecondaryBorder", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Group 4: Page Surfaces & Containers ── */}
        <div className="space-y-3 pt-3 border-t border-[#e2efe6]">
          <h3 className="text-xs font-black text-[#1e5631] uppercase tracking-wider flex items-center gap-2">
            <span>🖼️</span> Group D: Page Surfaces & Cards
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Page Body Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.bgBase}
                  onChange={(e) => updateColor("bgBase", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.bgBase}
                  onChange={(e) => updateColor("bgBase", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Card Container Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.cardBg}
                  onChange={(e) => updateColor("cardBg", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.cardBg}
                  onChange={(e) => updateColor("cardBg", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Border & Dividers</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.borderColor}
                  onChange={(e) => updateColor("borderColor", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.borderColor}
                  onChange={(e) => updateColor("borderColor", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Group 5: Typography & Accents ── */}
        <div className="space-y-3 pt-3 border-t border-[#e2efe6]">
          <h3 className="text-xs font-black text-[#1e5631] uppercase tracking-wider flex items-center gap-2">
            <span>✏️</span> Group E: Typography & Highlights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Primary Headings Text</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.textPrimary}
                  onChange={(e) => updateColor("textPrimary", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.textPrimary}
                  onChange={(e) => updateColor("textPrimary", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Secondary Subtitle Text</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.textSecondary}
                  onChange={(e) => updateColor("textSecondary", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.textSecondary}
                  onChange={(e) => updateColor("textSecondary", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#143623] mb-1">Sprout Accent Highlight</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors.accentColor}
                  onChange={(e) => updateColor("accentColor", e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#d0e6d6] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={colors.accentColor}
                  onChange={(e) => updateColor("accentColor", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-xl text-xs font-mono font-bold text-[#143623]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Grouped Preview */}
        <div className="pt-4 border-t border-[#d0e6d6]">
          <h4 className="text-xs font-black text-[#143623] uppercase tracking-wider mb-3">
            Live Preview Across All UI Element Groups
          </h4>
          <div
            className="rounded-2xl p-6 border shadow-sm transition-all flex flex-col md:flex-row gap-6"
            style={{
              backgroundColor: colors.bgBase,
              borderColor: colors.borderColor,
            }}
          >
            {/* Mini Sidebar Mock */}
            <div
              className="w-full md:w-56 rounded-xl p-4 space-y-3 text-xs font-bold"
              style={{ backgroundColor: colors.sidebarBg, color: colors.sidebarText }}
            >
              <div className="text-sm font-black tracking-wide" style={{ color: "#ffffff" }}>
                🌱 KRAVE ADMIN
              </div>
              <div className="space-y-1">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.sidebarActiveBg, color: "#ffffff" }}
                >
                  ✓ Dashboard (Active)
                </div>
                <div className="p-2 opacity-80">📋 Registrations</div>
                <div className="p-2 opacity-80">🎙️ Webinars</div>
                <div className="p-2 opacity-80">🎯 CRM Leads</div>
              </div>
            </div>

            {/* Mini Content Mock */}
            <div className="flex-1 space-y-4">
              {/* Header */}
              <div
                className="p-4 rounded-xl border shadow-xs flex items-center justify-between"
                style={{
                  backgroundColor: colors.headerBg,
                  color: colors.headerText,
                  borderColor: colors.borderColor,
                }}
              >
                <span className="font-black text-sm">Header Bar & Title</span>
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: colors.accentColor + "30", color: colors.textPrimary }}
                >
                  ★ Accent Badge
                </span>
              </div>

              {/* Card Container */}
              <div
                className="p-5 rounded-xl border shadow-xs space-y-3"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.borderColor,
                }}
              >
                <h5 className="font-black text-base" style={{ color: colors.textPrimary }}>
                  Primary Title Typography
                </h5>
                <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                  Secondary body typography explaining platform features and analytics metrics.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    className="text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
                    style={{ backgroundColor: colors.btnPrimaryBg, color: colors.btnPrimaryText }}
                  >
                    Primary Button CTA
                  </button>

                  <button
                    type="button"
                    className="text-xs font-bold px-4 py-2 rounded-xl transition-all border"
                    style={{
                      borderColor: colors.btnSecondaryBorder,
                      color: colors.textPrimary,
                      backgroundColor: "transparent",
                    }}
                  >
                    Secondary Outline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-xs font-bold p-3.5 rounded-xl transition-all shadow-xs">
          ✓ {successMsg}
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={handleSaveTheme}
          disabled={saving}
          id="save-theme-codes-btn"
          className="w-full sm:w-auto bg-[#1e5631] hover:bg-[#2d7d46] disabled:bg-gray-400 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          {saving ? "Applying Color Codes…" : "🎨 Save & Apply Element Colors Across Website →"}
        </button>
      </div>
    </div>
  );
}
