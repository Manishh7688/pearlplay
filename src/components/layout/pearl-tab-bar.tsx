import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useThemeMode } from '@/hooks/use-theme';
import { Radius, Shadows } from '@/theme';

type TabRoute = { key: string; name: string; params?: object };

type PearlTabBarProps = {
  state: { index: number; key: string; routes: TabRoute[] };
  descriptors: Record<
    string,
    { options: { title?: string; href?: string | null; tabBarPosition?: 'bottom' | 'left' | 'right' | 'top' } }
  >;
  navigation: {
    emit: (event: {
      type: 'tabPress';
      target?: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string, params?: object) => void;
  };
  insets: { top: number; bottom: number; left: number; right: number };
};

const ITEMS: Record<
  string,
  {
    label: string;
    on: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    off: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  }
> = {
  index: { label: 'Dashboard', on: 'view-dashboard', off: 'view-dashboard-outline' },
  products: { label: 'Projects', on: 'sprout', off: 'sprout-outline' },
  team: { label: 'Partners', on: 'account-group', off: 'account-group-outline' },
  profile: { label: 'Account', on: 'account-circle', off: 'account-circle-outline' },
};

export function PearlTabBar({ state, descriptors, navigation, insets }: PearlTabBarProps) {
  const theme = useTheme();
  const router = useRouter();
  const { mode, toggleTheme } = useThemeMode();
  const desktop = descriptors[state.routes[state.index].key]?.options.tabBarPosition === 'left';

  const go = (index: number) => {
    const route = state.routes[index];
    const focused = state.index === index;
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!focused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const tabs = state.routes.filter((route) => descriptors[route.key]?.options.href !== null);

  if (desktop) {
    return (
      <View
        style={[
          styles.sidebar,
          {
            backgroundColor: theme.surface,
            borderRightColor: theme.border,
            paddingTop: Math.max(insets.top, 24),
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}>
        <View>
          {/* Clickable Brand Mark on Web navigating to Home/Root */}
          <Pressable
            onPress={() => router.replace('/')}
            style={({ pressed }) => [styles.brand, pressed && { opacity: 0.75 }]}>
            <View style={[styles.brandMark, { backgroundColor: theme.primary }]}>
              <MaterialCommunityIcons name="sprout" size={22} color="#FFFFFF" />
            </View>
            <View>
              <View style={styles.brandTitleRow}>
                <Text style={[styles.brandName, { color: theme.text }]}>Pearl</Text>
                <MaterialCommunityIcons name="check-decagram" size={15} color={theme.primary} />
              </View>
              <Text style={[styles.brandSub, { color: theme.textSecondary }]}>
                Smart Agro-Finance
              </Text>
            </View>
          </Pressable>

          <Text style={[styles.navGroupTitle, { color: theme.textMuted }]}>NAVIGATION</Text>

          <View style={styles.sideList}>
            {tabs.map((route) => {
              const index = state.routes.indexOf(route);
              const focused = state.index === index;
              const item = ITEMS[route.name] ?? {
                label: descriptors[route.key]?.options.title ?? route.name,
                on: 'circle' as const,
                off: 'circle-outline' as const,
              };
              const color = focused ? theme.primary : theme.textSecondary;
              return (
                <Pressable
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={focused ? { selected: true } : {}}
                  onPress={() => go(index)}
                  style={({ pressed }) => [
                    styles.sideItem,
                    focused && {
                      backgroundColor: theme.primarySurface,
                      borderColor: theme.primaryBorder,
                      borderWidth: 1,
                    },
                    pressed && { opacity: 0.82 },
                  ]}>
                  <MaterialCommunityIcons
                    name={focused ? item.on : item.off}
                    size={21}
                    color={color}
                  />
                  <Text
                    style={[
                      styles.sideLabel,
                      { color: focused ? theme.text : theme.textSecondary },
                    ]}>
                    {item.label}
                  </Text>
                  {focused ? (
                    <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.sidebarFooter, { borderTopColor: theme.border }]}>
          <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => [
              styles.themeToggleBtn,
              {
                backgroundColor: theme.surfaceSubtle,
                borderColor: theme.border,
              },
              pressed && { opacity: 0.8 },
            ]}>
            <MaterialCommunityIcons
              name={mode === 'dark' ? 'weather-sunny' : 'weather-night'}
              size={18}
              color={mode === 'dark' ? theme.warning : theme.primary}
            />
            <Text style={[styles.themeToggleText, { color: theme.text }]}>
              {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.phoneWrap,
        {
          backgroundColor: theme.background,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}>
      <View
        style={[
          styles.pill,
          { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          Shadows.md,
        ]}>
        {tabs.map((route) => {
          const index = state.routes.indexOf(route);
          const focused = state.index === index;
          const item = ITEMS[route.name] ?? {
            label: descriptors[route.key]?.options.title ?? route.name,
            on: 'circle' as const,
            off: 'circle-outline' as const,
          };
          const color = focused ? theme.primary : theme.textMuted;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              onPress={() => go(index)}
              style={({ pressed }) => [
                styles.tab,
                focused && { backgroundColor: theme.primarySurface },
                pressed && { opacity: 0.82 },
              ]}>
              <MaterialCommunityIcons name={focused ? item.on : item.off} size={22} color={color} />
              <Text numberOfLines={1} style={[styles.tabLabel, { color }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 248,
    flexShrink: 0,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    borderRightWidth: 1,
    paddingHorizontal: 16,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 6,
    paddingBottom: 24,
  },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  brandName: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  brandSub: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  navGroupTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  sideList: {
    gap: 6,
  },
  sideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sideLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sidebarFooter: {
    borderTopWidth: 1,
    paddingTop: 16,
  },
  themeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  themeToggleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  phoneWrap: {
    paddingTop: 6,
    paddingHorizontal: 16,
  },
  pill: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 520,
    borderRadius: 28,
    borderWidth: 1,
    padding: 6,
    gap: 4,
  },
  tab: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
