/**
 * Theme hook and interactive Light/Dark mode provider for Pearl App
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, ThemeColors } from '@/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ColorMode = 'light' | 'dark';

interface ThemeModeContextValue {
  mode: ColorMode;
  toggleTheme: () => void;
  setMode: (mode: ColorMode) => void;
}

const THEME_STORAGE_KEY = '@pearl_theme_mode_v1';

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const initialMode: ColorMode = systemScheme === 'dark' ? 'dark' : 'light';
  const [mode, setModeState] = useState<ColorMode>(initialMode);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') {
          setModeState(saved);
        }
      })
      .catch(() => {});
  }, []);

  const setMode = useCallback((nextMode: ColorMode) => {
    setModeState(nextMode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode).catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  return React.createElement(
    ThemeModeContext.Provider,
    { value: { mode, toggleTheme, setMode } },
    children
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  const systemScheme = useColorScheme();
  if (!ctx) {
    return {
      mode: systemScheme === 'dark' ? 'dark' : 'light',
      toggleTheme: () => {},
      setMode: () => {},
    };
  }
  return ctx;
}

export function useTheme(): ThemeColors {
  const { mode } = useThemeMode();
  return Colors[mode];
}
