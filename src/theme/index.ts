import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#059669',
    primaryDark: '#064E3B',
    primaryLight: '#10B981',
    primarySurface: '#ECFDF5',
    primaryBorder: '#A7F3D0',

    vip: '#D97706',
    vipLight: '#FEF3C7',
    vipDark: '#78350F',
    vipBorder: '#FDE68A',

    accent: '#2563EB',
    accentLight: '#EFF6FF',

    background: '#F4F7F5',
    backgroundElement: '#E7EFEA',
    backgroundSelected: '#D1FAE5',

    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceSubtle: '#F8FAF9',

    border: '#E2E8F0',
    borderSubtle: '#F1F5F9',
    cardBorder: '#E5ECE8',

    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',

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
    primarySurface: '#062E1F',
    primaryBorder: '#0F5132',

    vip: '#F59E0B',
    vipLight: '#78350F',
    vipDark: '#B45309',
    vipBorder: '#92400E',

    accent: '#3B82F6',
    accentLight: '#1E3A8A',

    background: '#08140E',
    backgroundElement: '#10231A',
    backgroundSelected: '#18382A',

    surface: '#0F261C',
    surfaceElevated: '#173628',
    surfaceSubtle: '#0B1C14',

    border: '#1F3F2E',
    borderSubtle: '#142E21',
    cardBorder: '#234734',

    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0F172A',

    success: '#34D399',
    successLight: '#064E3B',
    warning: '#FBBF24',
    warningLight: '#78350F',
    danger: '#F87171',
    dangerLight: '#7F1D1D',
  },
} as const;

export type ThemeColors = typeof Colors.light;
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
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
} as const;

export const Shadows = {
  sm: Platform.select({
    web: { boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
  }),
  md: Platform.select({
    web: { boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
  }),
  lg: Platform.select({
    web: { boxShadow: '0 12px 24px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.05)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
      elevation: 8,
    },
  }),
  glow: Platform.select({
    web: { boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)' },
    default: {
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 6,
    },
  }),
};

export const BottomTabInset = Platform.select({ ios: 60, android: 70 }) ?? 60;
export const MaxContentWidth = 720;
