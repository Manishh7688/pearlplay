import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { LIVE_WITHDRAWALS } from '@/services/mock-data';
import { Radius, Shadows, Spacing } from '@/theme';

export function LiveTicker() {
  const theme = useTheme();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();

      setIndex((prev) => (prev + 1) % LIVE_WITHDRAWALS.length);
    }, 3600);

    return () => clearInterval(timer);
  }, [fadeAnim]);

  const current = LIVE_WITHDRAWALS[index];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push('/withdraw')}
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.cardBorder,
        },
      ]}>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: theme.primarySurface,
            borderColor: theme.primaryBorder,
          },
        ]}>
        <View style={[styles.liveDot, { backgroundColor: theme.success }]} />
        <Text style={[styles.badgeText, { color: theme.primary }]}>PAYOUT FEED</Text>
      </View>

      <Animated.View style={[styles.contentRow, { opacity: fadeAnim }]}>
        <View style={styles.textGroup}>
          <Text style={[styles.userText, { color: theme.textSecondary }]} numberOfLines={1}>
            Member <Text style={{ fontWeight: '800', color: theme.text }}>{current.user}</Text>{' '}
            withdrew{' '}
            <Text style={{ fontWeight: '800', color: theme.primary }}>
              ₹{current.amount.toLocaleString('en-IN')}
            </Text>
          </Text>
        </View>
        <View style={styles.rightGroup}>
          <Text style={[styles.timeText, { color: theme.textMuted }]}>{current.time}</Text>
          <Icon name="chevron-right" size={15} color={theme.textMuted} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    ...Shadows.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginRight: Spacing.two + 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  textGroup: {
    flex: 1,
  },
  userText: {
    fontSize: 12,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
