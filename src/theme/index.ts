import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#059669',
    primaryDark: '#047857',
    primaryLight: '#10B981',
    primarySurface: '#ECFDF5',
    primaryBorder: '#A7F3D0',

    vip: '#D97706',
    vipLight: '#FFFBEB',
    vipDark: '#92400E',
    vipBorder: '#FDE68A',

    accent: '#0284C7',
    accentLight: '#E0F2FE',

    background: '#F4F7F6',
    backgroundElement: '#E6EFEA',
    backgroundSelected: '#D1FAE5',

    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceSubtle: '#F8FAFC',

    border: '#E2E8F0',
    borderSubtle: '#F1F5F9',
    cardBorder: '#E2E8F0',

    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    textInverse: '#FFFFFF',

    hero: '#062E22',
    heroMuted: '#A7F3D0',
    heroAccent: '#FBBF24',

    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
  },
  dark: {
    primary: '#10B981',
    primaryDark: '#059669',
    primaryLight: '#34D399',
    primarySurface: '#0D281E',
    primaryBorder: '#154634',

    vip: '#F59E0B',
    vipLight: '#2A1F0D',
    vipDark: '#FDE68A',
    vipBorder: '#5C4013',

    accent: '#38BDF8',
    accentLight: '#0C2536',

    background: '#0A110E',
    backgroundElement: '#13201A',
    backgroundSelected: '#123124',

    surface: '#111C17',
    surfaceElevated: '#172620',
    surfaceSubtle: '#0D1612',

    border: '#1E3028',
    borderSubtle: '#16241E',
    cardBorder: '#1E3028',

    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#062016',

    hero: '#07231A',
    heroMuted: '#A7F3D0',
    heroAccent: '#FBBF24',

    success: '#34D399',
    successLight: '#0D281E',
    warning: '#FBBF24',
    warningLight: '#2A1F0D',
    danger: '#F87171',
    dangerLight: '#311515',
  },
} as const;

export type ThemeColors = {
  [K in keyof typeof Colors.light]: string;
};
export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
} as const;

export const Radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  full: 9999,
} as const;

export const Shadows = {
  sm: Platform.select({
    web: { boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.03)' },
    default: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
  }),
  md: Platform.select({
    web: { boxShadow: '0 8px 24px rgba(15, 23, 42, 0.07), 0 2px 6px rgba(15, 23, 42, 0.04)' },
    default: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
  }),
  lg: Platform.select({
    web: { boxShadow: '0 16px 36px rgba(15, 23, 42, 0.11), 0 4px 12px rgba(15, 23, 42, 0.05)' },
    default: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 8,
    },
  }),
  glow: Platform.select({
    web: { boxShadow: '0 8px 28px rgba(5, 150, 105, 0.25)' },
    default: {
      shadowColor: '#059669',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.28,
      shadowRadius: 14,
      elevation: 6,
    },
  }),
};

export const BottomTabInset = Platform.select({ ios: 56, android: 64, web: 72 }) ?? 64;
export const MaxContentWidth = 720;

/** Wide web layout switches the bottom bar into a left sidebar. */
export const Layout = {
  desktop: 960,
  grid: 840,
  feedMax: 1180,
  formMax: 680,
} as const;

export const feedColumn = {
  width: '100%' as const,
  maxWidth: Layout.feedMax,
  alignSelf: 'center' as const,
};

export const formColumn = {
  width: '100%' as const,
  maxWidth: Layout.formMax,
  alignSelf: 'center' as const,
};
