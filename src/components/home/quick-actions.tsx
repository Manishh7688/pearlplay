import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { Icon } from '@/components/ui/icon';
import { Radius, Shadows, Spacing } from '@/theme';

export function QuickActions() {
  const theme = useTheme();
  const router = useRouter();

  const actions = [
    {
      id: 'checkin',
      title: 'Check-In',
      subtitle: 'Daily Bonus',
      icon: 'calendar-check',
      color: theme.primary,
      bgColor: theme.primarySurface,
      borderColor: theme.primaryBorder,
      route: '/checkin' as const,
    },
    {
      id: 'invite',
      title: 'Invite',
      subtitle: '15% Rebate',
      icon: 'account-multiple-plus',
      color: theme.vip,
      bgColor: theme.vipLight,
      borderColor: theme.vipBorder,
      route: '/team' as const,
    },
    {
      id: 'recharge',
      title: 'Recharge',
      subtitle: 'Instant UPI',
      icon: 'wallet-plus',
      color: theme.accent,
      bgColor: theme.accentLight,
      borderColor: theme.border,
      route: '/recharge' as const,
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      subtitle: '0% Tax Fee',
      icon: 'bank-transfer-out',
      color: theme.success,
      bgColor: theme.successLight,
      borderColor: theme.primaryBorder,
      route: '/withdraw' as const,
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((act) => (
        <TouchableOpacity
          key={act.id}
          activeOpacity={0.82}
          onPress={() => router.push(act.route as any)}
          style={[
            styles.actionCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: act.bgColor,
                borderColor: act.borderColor,
              },
            ]}>
            <Icon name={act.icon} size={22} color={act.color} />
          </View>
          <Text style={[styles.actionTitle, { color: theme.text }]} numberOfLines={1}>
            {act.title}
          </Text>
          <Text style={[styles.actionSub, { color: theme.textMuted }]} numberOfLines={1}>
            {act.subtitle}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two + 2,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: Radius.lg,
    borderWidth: 1,
    ...Shadows.sm,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  actionSub: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
});
