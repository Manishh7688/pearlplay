import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
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

const ITEMS: Record<string, { label: string; on: React.ComponentProps<typeof MaterialCommunityIcons>['name']; off: React.ComponentProps<typeof MaterialCommunityIcons>['name'] }> = {
  index: { label: 'Home', on: 'home-variant', off: 'home-variant-outline' },
  products: { label: 'Products', on: 'sprout', off: 'sprout-outline' },
  team: { label: 'Team', on: 'account-group', off: 'account-group-outline' },
  profile: { label: 'Account', on: 'account-circle', off: 'account-circle-outline' },
};

export function PearlTabBar({ state, descriptors, navigation, insets }: PearlTabBarProps) {
  const theme = useTheme();
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
            paddingTop: Math.max(insets.top, 20),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}>
        <View style={styles.brand}>
          <View style={[styles.brandMark, { backgroundColor: theme.primary }]}>
            <MaterialCommunityIcons name="sprout" size={22} color={theme.textInverse} />
          </View>
          <View>
            <Text style={[styles.brandName, { color: theme.text }]}>Pearl</Text>
            <Text style={[styles.brandSub, { color: theme.textSecondary }]}>AgriTech</Text>
          </View>
        </View>

        <View style={styles.sideList}>
          {tabs.map((route) => {
            const index = state.routes.indexOf(route);
            const focused = state.index === index;
            const item = ITEMS[route.name] ?? {
              label: descriptors[route.key]?.options.title ?? route.name,
              on: 'circle' as const,
              off: 'circle-outline' as const,
            };
            const color = focused ? theme.primaryDark : theme.textSecondary;
            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                onPress={() => go(index)}
                style={({ pressed }) => [
                  styles.sideItem,
                  focused && { backgroundColor: theme.primarySurface },
                  pressed && { opacity: 0.8 },
                ]}>
                <MaterialCommunityIcons name={focused ? item.on : item.off} size={22} color={color} />
                <Text style={[styles.sideLabel, { color }]}>{item.label}</Text>
              </Pressable>
            );
          })}
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
    width: 236,
    flexShrink: 0,
    alignSelf: 'stretch',
    borderRightWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
    paddingBottom: 22,
  },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  brandSub: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: -1,
  },
  sideList: {
    gap: 4,
  },
  sideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
  },
  sideLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  phoneWrap: {
    paddingTop: 8,
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
