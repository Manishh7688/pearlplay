import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { LIVE_WITHDRAWALS } from '@/services/mock-data';
import { Radius, Spacing } from '@/theme';

export function LiveTicker() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setIndex((prev) => (prev + 1) % LIVE_WITHDRAWALS.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [fadeAnim]);

  const current = LIVE_WITHDRAWALS[index];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.cardBorder,
        },
      ]}>
      <View style={[styles.badge, { backgroundColor: theme.primarySurface }]}>
        <Ionicons name="shield-checkmark" size={14} color={theme.primary} />
        <Text style={[styles.badgeText, { color: theme.primary }]}>LIVE</Text>
      </View>

      <Animated.View style={[styles.contentRow, { opacity: fadeAnim }]}>
        <Text style={[styles.userText, { color: theme.textSecondary }]}>
          User <Text style={{ fontWeight: '700', color: theme.text }}>{current.user}</Text>
        </Text>
        <Text style={[styles.actionText, { color: theme.textSecondary }]}>
          withdrew{' '}
          <Text style={{ fontWeight: '800', color: theme.primary }}>
            ₹{current.amount.toLocaleString()}
          </Text>
        </Text>
        <Text style={[styles.timeText, { color: theme.textMuted }]}>{current.time}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    marginRight: Spacing.two,
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
  },
  userText: {
    fontSize: 12,
  },
  actionText: {
    fontSize: 12,
  },
  timeText: {
    fontSize: 11,
  },
});
