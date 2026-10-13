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
          borderColor: 'transparent',
        },
      ]}>
      {/* Decorative background glow */}
      <View style={[styles.glowCircle, { backgroundColor: theme.primary }]} />

      {/* Top row: Balance label, eye toggle, and Recharge button */}
      <View style={styles.topRow}>
        <View>
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
            {isLoading ? '••••••' : showBalance ? `₹${balance.toFixed(2)}` : '₹••••••'}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/recharge')}
          style={[styles.rechargeBtn, { backgroundColor: theme.primaryLight }]}>
          <Icon name="wallet-plus" size={18} color={theme.textInverse} />
          <Text style={styles.rechargeBtnText}>Recharge</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom stats row: Recharge, Withdraw, Welfare */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Recharge</Text>
          <Text style={styles.statVal}>₹{totalRecharge.toLocaleString()}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Withdraw</Text>
          <Text style={styles.statVal}>₹{totalWithdraw.toLocaleString()}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Welfare</Text>
          <Text style={[styles.statVal, { color: '#E8B86A' }]}>
            ₹{totalWelfare.toLocaleString()}
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
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.25,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelText: {
    color: '#D5EBDF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eyeBtn: {
    padding: 2,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  rechargeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    gap: 6,
    ...Shadows.sm,
  },
  rechargeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: Spacing.three,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#D5EBDF',
    fontSize: 11,
    fontWeight: '500',
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
