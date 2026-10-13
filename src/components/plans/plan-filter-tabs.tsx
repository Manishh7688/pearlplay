import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme';

export type PlanFilterCategory = 'all' | 'regular' | 'vip';

interface PlanFilterTabsProps {
  selected: PlanFilterCategory;
  onSelect: (category: PlanFilterCategory) => void;
  counts?: { all: number; regular: number; vip: number };
}

export function PlanFilterTabs({
  selected,
  onSelect,
  counts = { all: 9, regular: 6, vip: 3 },
}: PlanFilterTabsProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const compact = width < 420;

  const tabs: { id: PlanFilterCategory; label: string; count: number; icon: string }[] = [
    { id: 'all', label: compact ? 'All' : 'All Plans', count: counts.all, icon: 'view-dashboard-outline' },
    { id: 'regular', label: compact ? 'Daily' : 'Daily Plans', count: counts.regular, icon: 'sprout' },
    { id: 'vip', label: 'VIP', count: counts.vip, icon: 'crown-outline' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.cardBorder,
        },
      ]}>
      {tabs.map((tab) => {
        const isSelected = selected === tab.id;
        const isVip = tab.id === 'vip';

        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.8}
            onPress={() => onSelect(tab.id)}
            style={[
              styles.tabBtn,
              isSelected && {
                backgroundColor: isVip ? theme.vip : theme.primary,
              },
            ]}>
            <Icon
              name={tab.icon}
              size={15}
              color={isSelected ? '#FFFFFF' : theme.textSecondary}
            />
            <Text
              numberOfLines={1}
              style={[
                styles.tabLabel,
                { color: isSelected ? '#FFFFFF' : theme.textSecondary },
              ]}>
              {tab.label}
            </Text>
            {compact ? null : (
              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: isSelected
                      ? 'rgba(255, 255, 255, 0.25)'
                      : theme.backgroundElement,
                  },
                ]}>
                <Text
                  style={[
                    styles.countText,
                    { color: isSelected ? '#FFFFFF' : theme.textMuted },
                  ]}>
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.one,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.four,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: Radius.md,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  countBadge: {
    marginLeft: 6,
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: Radius.full,
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
