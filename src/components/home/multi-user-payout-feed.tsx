import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { LIVE_WITHDRAWALS } from '@/services/mock-data';
import { Radius, Shadows, Spacing } from '@/theme';

export function MultiUserPayoutFeed() {
  const theme = useTheme();
  const router = useRouter();

  // Rotate items smoothly to keep feed feeling live
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % LIVE_WITHDRAWALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Display 4 items dynamically starting from startIndex
  const visiblePayouts = [0, 1, 2, 3].map((offset) => {
    const idx = (startIndex + offset) % LIVE_WITHDRAWALS.length;
    return LIVE_WITHDRAWALS[idx];
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.cardBorder,
        },
      ]}>
      {/* Header with strict flex isolation so Withdraw button never overlaps text */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={[styles.iconWrap, { backgroundColor: theme.primarySurface }]}>
            <Icon name="bank-transfer-out" size={18} color={theme.primary} />
          </View>
          <View style={styles.headerTextWrap}>
            <View style={styles.titleBadgeRow}>
              <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                Live Community Payouts
              </Text>
              <View style={[styles.livePill, { backgroundColor: theme.primarySurface }]}>
                <View style={[styles.liveDot, { backgroundColor: theme.success }]} />
                <Text style={[styles.liveText, { color: theme.primary }]}>LIVE</Text>
              </View>
            </View>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
              Verified instant bank withdrawals with 0% fee
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.push('/withdraw')}
          style={[
            styles.withdrawLink,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
          ]}>
          <Text style={[styles.withdrawLinkText, { color: theme.primary }]}>Withdraw</Text>
          <Icon name="arrow-forward" size={13} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Multi-User Feed List */}
      <View style={styles.list}>
        {visiblePayouts.map((item, index) => {
          const isLast = index === visiblePayouts.length - 1;
          return (
            <View
              key={`${item.id}-${index}`}
              style={[
                styles.feedRow,
                !isLast && { borderBottomWidth: 1, borderBottomColor: theme.borderSubtle },
              ]}>
              <View style={styles.userCol}>
                <View style={[styles.userAvatar, { backgroundColor: theme.surfaceSubtle }]}>
                  <Icon name="cellphone" size={15} color={theme.textMuted} />
                </View>
                <View style={styles.userColText}>
                  <Text style={[styles.userName, { color: theme.text }]} numberOfLines={1}>
                    User {item.user}
                  </Text>
                  <Text style={[styles.userTime, { color: theme.textMuted }]} numberOfLines={1}>
                    {item.time} • Bank Transfer
                  </Text>
                </View>
              </View>

              <View style={styles.payoutCol}>
                <Text style={[styles.amountText, { color: theme.primary }]}>
                  +₹{item.amount.toLocaleString('en-IN')}
                </Text>
                <View style={styles.statusPill}>
                  <Icon name="check-decagram" size={12} color={theme.success} />
                  <Text style={[styles.statusText, { color: theme.success }]}>Success</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer Trust Guarantee */}
      <View
        style={[
          styles.footer,
          { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
        ]}>
        <Icon name="shield-checkmark" size={14} color={theme.primary} />
        <Text style={[styles.footerText, { color: theme.textSecondary }]} numberOfLines={1}>
          Automated settlements 24/7 • Min ₹150 • Direct bank transfer
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
    gap: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: Radius.full,
    flexShrink: 0,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  withdrawLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    borderWidth: 1,
    flexShrink: 0,
  },
  withdrawLinkText: {
    fontSize: 12,
    fontWeight: '700',
  },
  list: {
    marginVertical: Spacing.one,
  },
  feedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  userCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userColText: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  userTime: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  payoutCol: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginTop: Spacing.two,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
});
