import { createClient } from "@supabase/supabase-js";

export interface GroupedSiteTheme {
  // 1. Header
  headerBg: string;
  headerText: string;

  // 2. Sidebar
  sidebarBg: string;
  sidebarText: string;
  sidebarActiveBg: string;

  // 3. Buttons
  btnPrimaryBg: string;
  btnPrimaryText: string;
  btnSecondaryBorder: string;

  // 4. Surfaces & Containers
  bgBase: string;
  cardBg: string;
  borderColor: string;

  // 5. Typography & Accents
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
}

export const DEFAULT_GROUPED_THEME: GroupedSiteTheme = {
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
};

export async function getSiteTheme(): Promise<GroupedSiteTheme> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "grouped_color_theme")
        .maybeSingle();

      if (data?.value) {
        const val = data.value as Partial<GroupedSiteTheme>;
        return {
          ...DEFAULT_GROUPED_THEME,
          ...val,
        };
      }
    } catch {
      // ignore
    }
  }

  return DEFAULT_GROUPED_THEME;
}

export function generateThemeCss(t: GroupedSiteTheme): string {
  return `
    :root {
      --header-bg: ${t.headerBg};
      --header-text: ${t.headerText};
      --sidebar-bg: ${t.sidebarBg};
      --sidebar-text: ${t.sidebarText};
      --sidebar-active: ${t.sidebarActiveBg};
      --btn-primary-bg: ${t.btnPrimaryBg};
      --btn-primary-text: ${t.btnPrimaryText};
      --btn-secondary-border: ${t.btnSecondaryBorder};
      --bg-base: ${t.bgBase};
      --card-bg: ${t.cardBg};
      --border-color: ${t.borderColor};
      --text-primary: ${t.textPrimary};
      --text-secondary: ${t.textSecondary};
      --accent-color: ${t.accentColor};
    }

    body {
      background-color: ${t.bgBase} !important;
      color: ${t.textPrimary} !important;
    }

    /* Group 1: Header */
    .bg-white.border-b {
      background-color: ${t.headerBg} !important;
    }

    /* Group 2: Sidebar */
    aside, .bg-\\[\\#143623\\] {
      background-color: ${t.sidebarBg} !important;
    }

    /* Group 3: Primary buttons */
    button.bg-\\[\\#1e5631\\], .bg-\\[\\#1e5631\\] {
      background-color: ${t.btnPrimaryBg} !important;
      color: ${t.btnPrimaryText} !important;
    }

    .border-\\[\\#1e5631\\] {
      border-color: ${t.btnPrimaryBg} !important;
    }

    .text-\\[\\#1e5631\\] {
      color: ${t.btnPrimaryBg} !important;
    }

    /* Group 4: Cards & Borders */
    .bg-white {
      background-color: ${t.cardBg} !important;
    }

    .border-\\[\\#e2efe6\\], .border-\\[\\#d0e6d6\\] {
      border-color: ${t.borderColor} !important;
    }

    .bg-\\[\\#f8faf5\\] {
      background-color: ${t.bgBase} !important;
    }

    /* Group 5: Typography */
    .text-\\[\\#143623\\] {
      color: ${t.textPrimary} !important;
    }

    .text-\\[\\#4a6b57\\] {
      color: ${t.textSecondary} !important;
    }
  `;
}
