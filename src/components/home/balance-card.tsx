import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { UserProfile } from '@/types';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Shadows, Spacing } from '@/theme';

interface BalanceCardProps {
  user: UserProfile | undefined;
  isLoading?: boolean;
}

export function BalanceCard({ user, isLoading }: BalanceCardProps) {
  const theme = useTheme();
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);

  const balance = user?.balance ?? 0;
  const totalRecharge = user?.totalRecharge ?? 0;
  const totalWithdraw = user?.totalWithdraw ?? 0;
  const totalWelfare = user?.totalWelfare ?? 0;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.hero,
          borderColor: 'rgba(167, 243, 208, 0.14)',
        },
      ]}>
      {/* Subtle decorative glow */}
      <View style={[styles.glowCircle, { backgroundColor: theme.primaryLight }]} />

      {/* Top row: Wallet Balance + Action buttons */}
      <View style={styles.topRow}>
        <View style={styles.balanceInfo}>
          <View style={styles.labelRow}>
            <Text style={styles.labelText}>Wallet Balance</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowBalance(!showBalance)}
              style={styles.eyeBtn}>
              <Icon
                name={showBalance ? 'eye-outline' : 'eye-off-outline'}
                size={16}
                color={theme.heroMuted}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceValue}>
            {isLoading
              ? '₹ ••••••'
              : showBalance
                ? `₹${balance.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : '₹ ••••••'}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/recharge')}
            style={[styles.rechargeBtn, { backgroundColor: '#10B981' }]}>
            <Icon name="wallet-plus" size={16} color="#042F22" />
            <Text style={styles.rechargeBtnText}>Recharge</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/records')}
            style={styles.historyBtn}>
            <Icon name="receipt-text-outline" size={17} color="#ECFDF5" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Clean 3-column summary strip */}
      <View style={styles.statsPanel}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Recharge</Text>
          <Text style={styles.statVal}>
            {showBalance ? `₹${totalRecharge.toLocaleString('en-IN')}` : '₹••••'}
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Withdraw</Text>
          <Text style={styles.statVal}>
            {showBalance ? `₹${totalWithdraw.toLocaleString('en-IN')}` : '₹••••'}
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Yield</Text>
          <Text style={[styles.statVal, { color: '#FCD34D' }]}>
            {showBalance ? `₹${totalWelfare.toLocaleString('en-IN')}` : '₹••••'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.md,
  },
  glowCircle: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.18,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  balanceInfo: {
    flex: 1,
    minWidth: 150,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelText: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  eyeBtn: {
    padding: 3,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: -0.6,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rechargeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: Radius.full,
    gap: 6,
  },
  rechargeBtnText: {
    color: '#042F22',
    fontSize: 13,
    fontWeight: '800',
  },
  historyBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  statsPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radius.lg,
    paddingVertical: 11,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#D1FAE5',
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.85,
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
});
