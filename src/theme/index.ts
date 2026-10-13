import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#1B7A4E',
    primaryDark: '#0E3D28',
    primaryLight: '#3DAB74',
    primarySurface: '#E7F6EE',
    primaryBorder: '#B7E4C9',

    vip: '#C4812A',
    vipLight: '#FFF4E0',
    vipDark: '#7A4E10',
    vipBorder: '#F3D7A1',

    accent: '#3D6B8C',
    accentLight: '#E7F1F6',

    background: '#F4F1EA',
    backgroundElement: '#E7E1D6',
    backgroundSelected: '#DCEFE4',

    surface: '#FFFCF8',
    surfaceElevated: '#FFFFFF',
    surfaceSubtle: '#F7F4EE',

    border: '#E4DDD0',
    borderSubtle: '#EFEAE1',
    cardBorder: '#E7E0D4',

    text: '#1C241F',
    textSecondary: '#5C675F',
    textMuted: '#8B938C',
    textInverse: '#FFFFFF',

    hero: '#12392A',
    heroMuted: '#D5EBDF',
    heroAccent: '#E8B86A',

    success: '#1F9D68',
    successLight: '#DDF6EA',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    danger: '#DC4C4C',
    dangerLight: '#FDECEC',
  },
  dark: {
    primary: '#3DAB74',
    primaryDark: '#166B45',
    primaryLight: '#6FCB9A',
    primarySurface: '#143226',
    primaryBorder: '#1E5340',

    vip: '#E8B86A',
    vipLight: '#3A2C14',
    vipDark: '#F3D7A1',
    vipBorder: '#6A4E22',

    accent: '#7BA7C4',
    accentLight: '#1A2C38',

    background: '#101612',
    backgroundElement: '#1C2822',
    backgroundSelected: '#1E3A2C',

    surface: '#18211C',
    surfaceElevated: '#212C26',
    surfaceSubtle: '#141C18',

    border: '#2A3A32',
    borderSubtle: '#1E2B25',
    cardBorder: '#31443A',

    text: '#F6F3EC',
    textSecondary: '#C5CDC6',
    textMuted: '#8E9A92',
    textInverse: '#102018',

    hero: '#0E2A1E',
    heroMuted: '#D5EBDF',
    heroAccent: '#E8B86A',

    success: '#4ADE80',
    successLight: '#143226',
    warning: '#FBBF24',
    warningLight: '#3A2C14',
    danger: '#F87171',
    dangerLight: '#3F1D1D',
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
    web: { boxShadow: '0 0 20px rgba(27, 122, 78, 0.22)' },
    default: {
      shadowColor: '#1B7A4E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 6,
    },
  }),
};

export const BottomTabInset = Platform.select({ ios: 56, android: 64, web: 72 }) ?? 64;
export const MaxContentWidth = 720;

/** Wide web layout switches the bottom bar into a left sidebar. */
export const Layout = {
  desktop: 960,
  grid: 1080,
  feedMax: 1080,
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
