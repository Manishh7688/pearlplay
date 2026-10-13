import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Shadows, Spacing } from '@/theme';

export function QuickActions() {
  const theme = useTheme();
  const router = useRouter();

  const actions = [
    {
      id: 'checkin',
      title: 'Daily CheckIn',
      icon: 'calendar' as const,
      color: '#059669',
      bgColor: '#ECFDF5',
      route: '/checkin' as const,
    },
    {
      id: 'invite',
      title: 'Invite Friends',
      icon: 'gift' as const,
      color: '#D97706',
      bgColor: '#FEF3C7',
      route: '/team' as const,
    },
    {
      id: 'recharge',
      title: 'Recharge',
      icon: 'wallet' as const,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      route: '/recharge' as const,
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: 'shield-checkmark' as const,
      color: '#10B981',
      bgColor: '#E6FFFA',
      route: '/withdraw' as const,
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((act) => (
        <TouchableOpacity
          key={act.id}
          activeOpacity={0.8}
          onPress={() => router.push(act.route as any)}
          style={[
            styles.actionCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}>
          <View style={[styles.iconCircle, { backgroundColor: act.bgColor }]}>
            <Ionicons name={act.icon} size={22} color={act.color} />
          </View>
          <Text style={[styles.actionTitle, { color: theme.text }]}>{act.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Spacing.three,
    gap: Spacing.two,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.lg,
    borderWidth: 1,
    ...Shadows.sm,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
});
