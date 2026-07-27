import { createClient } from "@supabase/supabase-js";

export interface SiteTheme {
  primary: string;
  background: string;
  foreground: string;
  accent: string;
}

export const DEFAULT_THEME: SiteTheme = {
  primary: "#1e5631",
  background: "#f8faf5",
  foreground: "#143623",
  accent: "#6cc24a",
};

export async function getSiteTheme(): Promise<SiteTheme> {
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
        .eq("key", "color_theme")
        .single();

      if (data?.value) {
        const val = data.value as Record<string, string>;
        if (val.primary && val.background && val.foreground) {
          return {
            primary: val.primary,
            background: val.background,
            foreground: val.foreground,
            accent: val.accent || "#6cc24a",
          };
        }
      }
    } catch {
      // ignore
    }
  }

  return DEFAULT_THEME;
}

export function generateThemeCss(theme: SiteTheme): string {
  return `
    :root {
      --krave-primary: ${theme.primary};
      --krave-bg: ${theme.background};
      --krave-fg: ${theme.foreground};
      --krave-accent: ${theme.accent};
    }

    body {
      background-color: ${theme.background} !important;
      color: ${theme.foreground} !important;
    }

    /* Primary buttons & highlights */
    .bg-\\[\\#1e5631\\], .bg-primary {
      background-color: ${theme.primary} !important;
    }
    .hover\\:bg-\\[\\#2d7d46\\]:hover, .hover\\:bg-\\[\\#1e5631\\]:hover {
      background-color: ${theme.primary} !important;
      filter: brightness(1.1);
    }
    .border-\\[\\#1e5631\\], .border-primary {
      border-color: ${theme.primary} !important;
    }
    .text-\\[\\#1e5631\\], .text-\\[\\#2d7d46\\], .text-primary {
      color: ${theme.primary} !important;
    }

    /* Headings & typography */
    h1, h2, h3, h4, h5, h6, .text-\\[\\#143623\\] {
      color: ${theme.foreground} !important;
    }

    /* Light card & section backgrounds */
    .bg-\\[\\#f8faf5\\], .bg-\\[\\#f4f9f5\\], .bg-\\[\\#edf6f0\\] {
      background-color: ${theme.background} !important;
    }
  `;
}
