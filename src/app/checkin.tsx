import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Icon as Ionicons } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useCheckInStatus, useUserProfile } from '@/hooks/use-queries';
import { useDailyCheckInMutation, useRedeemGiftCodeMutation } from '@/hooks/use-mutations';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { VALID_GIFT_CODES } from '@/services/mock-data';
import { Radius, Shadows, Spacing } from '@/theme';

export default function CheckInScreen() {
  const theme = useTheme();
  const { showToast } = useToast();

  const { data: user } = useUserProfile();
  const { data: checkIn, refetch: refetchCheckIn } = useCheckInStatus();
  const checkInMutation = useDailyCheckInMutation();
  const redeemMutation = useRedeemGiftCodeMutation();

  const [promoCode, setPromoCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const hasCheckedIn = !!checkIn?.hasCheckedInToday;
  const streak = checkIn?.streakDays ?? 0;

  const handleClaimCheckIn = () => {
    checkInMutation.mutate(undefined, {
      onSuccess: (res) => {
        showToast({
          message: `🎉 Attendance bonus credited: +₹${res.reward}!`,
          type: 'success',
        });
        refetchCheckIn();
      },
      onError: (err) => {
        showToast({
          message: err.message || 'Already claimed today!',
          type: 'error',
        });
      },
    });
  };

  const handleRedeemCode = () => {
    const clean = promoCode.trim().toUpperCase();
    if (!clean) {
      setCodeError('Please enter a voucher code');
      return;
    }

    setCodeError('');
    redeemMutation.mutate(clean, {
      onSuccess: (res) => {
        showToast({
          message: `🎁 Voucher ${clean} redeemed: +₹${res.bonus} added to wallet!`,
          type: 'success',
        });
        setPromoCode('');
      },
      onError: (err) => {
        setCodeError(err.message || 'Invalid or expired code');
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Daily Check-in & Vouchers" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* Attendance Banner */}
        <View
          style={[
            styles.streakCard,
            {
              backgroundColor: theme.primaryDark,
              borderColor: theme.primaryBorder,
            },
          ]}>
          <View style={styles.streakHeader}>
            <View>
              <Text style={styles.streakSub}>Agricultural Attendance</Text>
              <Text style={styles.streakCount}>Day {streak} Streak</Text>
            </View>
            <Badge variant="vip" size="sm">
              ₹8 - ₹200 Daily
            </Badge>
          </View>

          {/* 7-Day Attendance Visualizer */}
          <View style={styles.daysRow}>
            {[1, 2, 3, 4, 5, 6, 7].map((d) => {
              const isPassed = d <= streak;
              const isToday = d === streak + (hasCheckedIn ? 0 : 1);
              return (
                <View key={d} style={styles.dayCol}>
                  <View
                    style={[
                      styles.dayCircle,
                      isPassed
                        ? { backgroundColor: '#10B981' }
                        : isToday
                        ? { backgroundColor: '#FCD34D' }
                        : { backgroundColor: 'rgba(255, 255, 255, 0.15)' },
                    ]}>
                    <Ionicons
                      name={isPassed ? 'checkmark' : 'gift'}
                      size={14}
                      color={isPassed ? '#FFFFFF' : isToday ? '#78350F' : '#A7F3D0'}
                    />
                  </View>
                  <Text style={styles.dayLabel}>Day {d}</Text>
                </View>
              );
            })}
          </View>

          <Button
            variant={hasCheckedIn ? 'secondary' : 'primary'}
            size="md"
            disabled={hasCheckedIn}
            loading={checkInMutation.isPending}
            onPress={handleClaimCheckIn}
            style={{ marginTop: Spacing.three }}
            leftIcon={
              <Ionicons
                name={hasCheckedIn ? 'checkmark-circle' : 'gift-outline'}
                size={18}
                color={hasCheckedIn ? theme.primary : '#FFFFFF'}
              />
            }>
            {hasCheckedIn ? 'Today’s Attendance Claimed' : 'Check In & Claim Reward Now'}
          </Button>
        </View>

        {/* Voucher Redemption Box */}
        <View
          style={[
            styles.redeemCard,
            { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          ]}>
          <View style={styles.redeemHeader}>
            <View style={[styles.codeIconCircle, { backgroundColor: theme.vipLight }]}>
              <Ionicons name="pricetag" size={20} color={theme.vipDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.redeemTitle, { color: theme.text }]}>
                Redeem Promo Voucher
              </Text>
              <Text style={[styles.redeemSub, { color: theme.textSecondary }]}>
                Enter official promotional codes released on our Telegram channel
              </Text>
            </View>
          </View>

          <Input
            value={promoCode}
            onChangeText={(txt) => {
              setPromoCode(txt.toUpperCase());
              setCodeError('');
            }}
            placeholder="e.g. PEARL2026"
            autoCapitalize="characters"
            error={codeError}
            leftIcon={<Ionicons name="key-outline" size={18} color={theme.textSecondary} />}
          />

          <Button
            variant="vip"
            size="md"
            loading={redeemMutation.isPending}
            onPress={handleRedeemCode}
            leftIcon={<Ionicons name="flash-outline" size={18} color="#FFFFFF" />}>
            Redeem Code
          </Button>

          {/* Available Test Promo Codes */}
          <View style={styles.testCodesSection}>
            <Text style={[styles.testCodesTitle, { color: theme.textSecondary }]}>
              Available Test Vouchers (Tap to fill):
            </Text>
            <View style={styles.codeTagsRow}>
              {Object.entries(VALID_GIFT_CODES).map(([code, reward]) => (
                <TouchableOpacity
                  key={code}
                  activeOpacity={0.7}
                  onPress={() => {
                    setPromoCode(code);
                    setCodeError('');
                  }}
                  style={[
                    styles.codeChip,
                    { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
                  ]}>
                  <Text style={[styles.codeChipText, { color: theme.primary }]}>
                    {code} (₹{reward})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    padding: Spacing.four,
    paddingBottom: Spacing.seven,
  },
  streakCard: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.four,
    ...Shadows.md,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  streakSub: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  streakCount: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayCol: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dayLabel: {
    color: '#D1FAE5',
    fontSize: 10,
    fontWeight: '600',
  },
  redeemCard: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.four,
    ...Shadows.sm,
  },
  redeemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  codeIconCircle: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redeemTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  redeemSub: {
    fontSize: 12,
    marginTop: 2,
  },
  testCodesSection: {
    marginTop: Spacing.four,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  testCodesTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.two,
  },
  codeTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  codeChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  codeChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
