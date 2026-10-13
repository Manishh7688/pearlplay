import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { PearlTabBar } from '@/components/layout/pearl-tab-bar';
import { Layout } from '@/theme';

export default function TabLayout() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const desktop = width >= Layout.desktop;

  return (
    <Tabs
      tabBar={(props) => <PearlTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarPosition: desktop ? 'left' : 'bottom',
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        sceneStyle: { backgroundColor: theme.background },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="products" options={{ title: 'Products' }} />
      <Tabs.Screen name="team" options={{ title: 'Promotion' }} />
      <Tabs.Screen name="profile" options={{ title: 'Account' }} />
    </Tabs>
  );
}
