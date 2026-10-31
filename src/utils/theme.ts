export type ThemeId = 'cobalt' | 'emerald' | 'terracotta' | 'nordic' | 'charcoal';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  badge: string;
  primaryColor: string;
  hoverColor: string;
  lightBg: string;
  borderColor: string;
  darkColor: string;
  gradientTo: string;
  ringColor: string;
  swatch: {
    primary: string;
    accent: string;
    dark: string;
  };
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'cobalt',
    name: 'Electric Cobalt',
    tagline: 'Modern vibrancy with bold cobalt & deep charcoal',
    badge: 'Selected',
    primaryColor: '#2563eb', // Blue 600
    hoverColor: '#1d4ed8',   // Blue 700
    lightBg: '#eff6ff',      // Blue 50
    borderColor: '#bfdbfe',  // Blue 200
    darkColor: '#0f172a',    // Slate 900
    gradientTo: '#1e40af',   // Blue 800
    ringColor: 'rgba(37, 99, 235, 0.35)',
    swatch: {
      primary: '#2563eb',
      accent: '#60a5fa',
      dark: '#0f172a',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald & Pine',
    tagline: 'Lush evergreen & Ontario harvest orchard tones',
    badge: 'Nature',
    primaryColor: '#059669', // Emerald 600
    hoverColor: '#047857',   // Emerald 700
    lightBg: '#ecfdf5',      // Emerald 50
    borderColor: '#a7f3d0',  // Emerald 200
    darkColor: '#064e3b',    // Emerald 900
    gradientTo: '#047857',
    ringColor: 'rgba(5, 150, 105, 0.35)',
    swatch: {
      primary: '#059669',
      accent: '#34d399',
      dark: '#064e3b',
    },
  },
  {
    id: 'terracotta',
    name: 'Terracotta & Rust',
    tagline: 'Warm artisanal pottery and autumn canyon warmth',
    badge: 'Warmth',
    primaryColor: '#ea580c', // Orange 600
    hoverColor: '#c2410c',   // Orange 700
    lightBg: '#fff7ed',      // Orange 50
    borderColor: '#fed7aa',  // Orange 200
    darkColor: '#431407',    // Orange 950
    gradientTo: '#9a3412',
    ringColor: 'rgba(234, 88, 12, 0.35)',
    swatch: {
      primary: '#ea580c',
      accent: '#fb923c',
      dark: '#431407',
    },
  },
  {
    id: 'nordic',
    name: 'Nordic Indigo',
    tagline: 'Deep Scandinavian dusk twilight and crisp slate',
    badge: 'Classic',
    primaryColor: '#4f46e5', // Indigo 600
    hoverColor: '#4338ca',   // Indigo 700
    lightBg: '#eef2ff',      // Indigo 50
    borderColor: '#c7d2fe',  // Indigo 200
    darkColor: '#1e1b4b',    // Indigo 950
    gradientTo: '#3730a3',
    ringColor: 'rgba(79, 70, 229, 0.35)',
    swatch: {
      primary: '#4f46e5',
      accent: '#818cf8',
      dark: '#1e1b4b',
    },
  },
  {
    id: 'charcoal',
    name: 'Charcoal Minimalist',
    tagline: 'Monochrome precision with high-contrast slate & titanium',
    badge: 'Monochrome',
    primaryColor: '#334155', // Slate 700
    hoverColor: '#1e293b',   // Slate 800
    lightBg: '#f8fafc',      // Slate 50
    borderColor: '#cbd5e1',  // Slate 300
    darkColor: '#020617',    // Slate 950
    gradientTo: '#0f172a',
    ringColor: 'rgba(51, 65, 85, 0.35)',
    swatch: {
      primary: '#334155',
      accent: '#94a3b8',
      dark: '#020617',
    },
  },
];

// Curated Background Atmospheres
export type BackgroundThemeId = 'warm-linen' | 'crisp-slate' | 'midnight-navy' | 'soft-sage' | 'alabaster';

export interface BackgroundThemeConfig {
  id: BackgroundThemeId;
  name: string;
  tagline: string;
  canvasBg: string;
  surfaceBg: string;
  subtleBg: string;
  borderColor: string;
  textColor: string;
  textMutedColor: string;
  headerBg: string;
  isDark: boolean;
  swatchPreview: {
    canvas: string;
    card: string;
    accent: string;
  };
  recommended?: boolean;
}

export const BACKGROUND_THEMES: BackgroundThemeConfig[] = [
  {
    id: 'warm-linen',
    name: 'Warm Sand & Linen Cream',
    tagline: 'Organic field guide warmth with cozy parchment undertones',
    canvasBg: '#FAF7F0',
    surfaceBg: '#FFFFFF',
    subtleBg: '#F3ECE0',
    borderColor: '#E8DFC8',
    textColor: '#1C1917',
    textMutedColor: '#78716C',
    headerBg: 'rgba(255, 255, 255, 0.95)',
    isDark: false,
    recommended: true,
    swatchPreview: {
      canvas: '#FAF7F0',
      card: '#FFFFFF',
      accent: '#E8DFC8',
    },
  },
  {
    id: 'crisp-slate',
    name: 'Crisp Mist & Slate Gray',
    tagline: 'Clean modern clarity with ultra-crisp contrast',
    canvasBg: '#F1F5F9',
    surfaceBg: '#FFFFFF',
    subtleBg: '#E2E8F0',
    borderColor: '#CBD5E1',
    textColor: '#0F172A',
    textMutedColor: '#64748B',
    headerBg: 'rgba(255, 255, 255, 0.95)',
    isDark: false,
    swatchPreview: {
      canvas: '#F1F5F9',
      card: '#FFFFFF',
      accent: '#CBD5E1',
    },
  },
  {
    id: 'midnight-navy',
    name: 'Deep Midnight Navy',
    tagline: 'Atmospheric night mode making vivid quest imagery glow',
    canvasBg: '#0B0F19',
    surfaceBg: '#131B2E',
    subtleBg: '#1E293B',
    borderColor: '#2D3B55',
    textColor: '#F8FAFC',
    textMutedColor: '#94A3B8',
    headerBg: 'rgba(19, 27, 46, 0.95)',
    isDark: true,
    swatchPreview: {
      canvas: '#0B0F19',
      card: '#131B2E',
      accent: '#3B82F6',
    },
  },
  {
    id: 'soft-sage',
    name: 'Organic Soft Sage & Stone',
    tagline: 'Calming botanical wash inspired by Ontario pine & cedar trails',
    canvasBg: '#EFF5EF',
    surfaceBg: '#FFFFFF',
    subtleBg: '#E1EDE2',
    borderColor: '#CBE0CE',
    textColor: '#142017',
    textMutedColor: '#5C7461',
    headerBg: 'rgba(255, 255, 255, 0.95)',
    isDark: false,
    swatchPreview: {
      canvas: '#EFF5EF',
      card: '#FFFFFF',
      accent: '#CBE0CE',
    },
  },
  {
    id: 'alabaster',
    name: 'Pure Alabaster Light',
    tagline: 'Gallery minimalist monochrome with pure white & soft zinc',
    canvasBg: '#FAFAFA',
    surfaceBg: '#FFFFFF',
    subtleBg: '#F4F4F5',
    borderColor: '#E4E4E7',
    textColor: '#18181B',
    textMutedColor: '#71717A',
    headerBg: 'rgba(255, 255, 255, 0.95)',
    isDark: false,
    swatchPreview: {
      canvas: '#FAFAFA',
      card: '#FFFFFF',
      accent: '#E4E4E7',
    },
  },
];

const STORAGE_KEY = 'localsquest_theme';
const BG_STORAGE_KEY = 'localsquest_bg_theme';

export function getStoredTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (saved && THEMES.some((t) => t.id === saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'cobalt'; // Default theme per user selection
}

export function getStoredBackgroundTheme(): BackgroundThemeId {
  try {
    const saved = localStorage.getItem(BG_STORAGE_KEY) as BackgroundThemeId | null;
    if (saved && BACKGROUND_THEMES.some((b) => b.id === saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'warm-linen'; // Default per user request: Warm Sand and Linen Cream
}

export function applyTheme(themeId: ThemeId, bgThemeId?: BackgroundThemeId): void {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const bgTheme =
    BACKGROUND_THEMES.find((b) => b.id === (bgThemeId || getStoredBackgroundTheme())) ||
    BACKGROUND_THEMES[0];
  const root = document.documentElement;

  // Set accent theme attributes and CSS variables
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-bg-theme', bgTheme.id);
  if (bgTheme.isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  root.style.setProperty('--theme-primary', theme.primaryColor);
  root.style.setProperty('--theme-primary-hover', theme.hoverColor);
  root.style.setProperty('--theme-light', theme.lightBg);
  root.style.setProperty('--theme-border', theme.borderColor);
  root.style.setProperty('--theme-dark', theme.darkColor);
  root.style.setProperty('--theme-gradient-to', theme.gradientTo);
  root.style.setProperty('--theme-ring', theme.ringColor);

  // Set background atmosphere CSS variables
  root.style.setProperty('--bg-canvas', bgTheme.canvasBg);
  root.style.setProperty('--bg-surface', bgTheme.surfaceBg);
  root.style.setProperty('--bg-subtle', bgTheme.subtleBg);
  root.style.setProperty('--border-theme-custom', bgTheme.borderColor);
  root.style.setProperty('--text-heading-custom', bgTheme.textColor);
  root.style.setProperty('--text-muted-custom', bgTheme.textMutedColor);
  root.style.setProperty('--header-bg-custom', bgTheme.headerBg);

  try {
    localStorage.setItem(STORAGE_KEY, theme.id);
    if (bgThemeId) {
      localStorage.setItem(BG_STORAGE_KEY, bgTheme.id);
    }
  } catch {
    // ignore
  }
}

export function applyBackgroundTheme(bgThemeId: BackgroundThemeId): void {
  const currentAccent = getStoredTheme();
  applyTheme(currentAccent, bgThemeId);
}
