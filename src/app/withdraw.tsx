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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useBankDetails, useUserProfile } from '@/hooks/use-queries';
import { useWithdrawMutation } from '@/hooks/use-mutations';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { Radius, Shadows, Spacing } from '@/theme';

export default function WithdrawScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { showToast } = useToast();

  const { data: user } = useUserProfile();
  const { data: bank } = useBankDetails();
  const withdrawMutation = useWithdrawMutation();

  const [amount, setAmount] = useState<string>('150');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const currentBalance = user?.balance ?? 0;
  const numericAmount = parseFloat(amount) || 0;
  const isBankBound = !!bank?.isBound && !!bank?.accountNumber;

  const handleWithdrawAll = () => {
    setAmount(Math.floor(currentBalance).toString());
    setErrorMessage('');
  };

  const handleWithdraw = () => {
    if (!isBankBound) {
      setErrorMessage('Please bind your bank details first.');
      router.push('/bank-details');
      return;
    }

    if (isNaN(numericAmount) || numericAmount < 150) {
      setErrorMessage('Minimum withdrawal amount is ₹150');
      return;
    }

    if (numericAmount > 10000) {
      setErrorMessage('Maximum single withdrawal limit is ₹10,000');
      return;
    }

    if (numericAmount > currentBalance) {
      setErrorMessage(`Insufficient balance. Current balance is ₹${currentBalance.toFixed(2)}`);
      return;
    }

    setErrorMessage('');
    withdrawMutation.mutate(
      { amount: numericAmount },
      {
        onSuccess: () => {
          showToast({
            message: `Withdrawal request of ₹${numericAmount.toLocaleString()} submitted successfully!`,
            type: 'success',
          });
          setTimeout(() => {
            router.push('/records');
          }, 800);
        },
        onError: (err) => {
          showToast({
            message: err.message || 'Withdrawal failed. Please check your bank info.',
            type: 'error',
          });
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Withdraw Funds" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* Balance Card */}
        <View
          style={[
            styles.balanceCard,
            {
              backgroundColor: theme.primaryDark,
              borderColor: theme.primaryBorder,
            },
          ]}>
          <View>
            <Text style={styles.balanceLabel}>Withdrawable Balance</Text>
            <Text style={styles.balanceVal}>₹{currentBalance.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleWithdrawAll}
            style={[styles.allBtn, { backgroundColor: '#10B981' }]}>
            <Text style={styles.allBtnText}>Withdraw All</Text>
          </TouchableOpacity>
        </View>

        {/* Bank Binding Status Card */}
        <View
          style={[
            styles.bankCard,
            {
              backgroundColor: theme.surface,
              borderColor: isBankBound ? theme.primaryBorder : theme.vipBorder,
            },
          ]}>
          {isBankBound ? (
            <View style={styles.bankContent}>
              <View style={[styles.bankIconCircle, { backgroundColor: theme.primarySurface }]}>
                <Ionicons name="card" size={22} color={theme.primary} />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.bankTitleRow}>
                  <Text style={[styles.bankName, { color: theme.text }]}>
                    {bank.bankName || 'State Bank of India'}
                  </Text>
                  <Badge variant="success" size="sm">
                    Verified
                  </Badge>
                </View>
                <Text style={[styles.bankDetailsText, { color: theme.textSecondary }]}>
                  {bank.holderName} • A/C ••••{bank.accountNumber.slice(-4)}
                </Text>
                <Text style={[styles.ifscText, { color: theme.textMuted }]}>
                  IFSC: {bank.ifscCode}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/bank-details')}
                style={styles.editBtn}>
                <Ionicons name="create-outline" size={18} color={theme.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.bankNotBound}>
              <View style={[styles.warnCircle, { backgroundColor: theme.vipLight }]}>
                <Ionicons name="alert" size={20} color={theme.vipDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.warnTitle, { color: theme.vipDark }]}>
                  Bank Account Not Bound
                </Text>
                <Text style={[styles.warnSub, { color: theme.textSecondary }]}>
                  Please save your bank account and IFSC to receive funds.
                </Text>
              </View>
              <Button
                variant="vip"
                size="sm"
                fullWidth={false}
                onPress={() => router.push('/bank-details')}>
                Bind Now
              </Button>
            </View>
          )}
        </View>

        {/* Withdrawal Amount Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Withdrawal Amount
          </Text>
          <Input
            value={amount}
            onChangeText={(txt) => {
              setAmount(txt);
              setErrorMessage('');
            }}
            keyboardType="numeric"
            placeholder="Min ₹150, Max ₹10,000"
            prefix={<Text style={[styles.currencyPrefix, { color: theme.primary }]}>₹</Text>}
            error={errorMessage}
            hint="Daily unlimited withdrawals • Handling Fee: ₹0.00 (0%)"
          />
        </View>

        {/* Quick Amount Pills */}
        <View style={styles.pillsRow}>
          {[150, 500, 1000, 2500, 5000].map((val) => (
            <TouchableOpacity
              key={val}
              activeOpacity={0.75}
              onPress={() => {
                setAmount(val.toString());
                setErrorMessage('');
              }}
              style={[
                styles.pillBtn,
                {
                  backgroundColor: numericAmount === val ? theme.primary : theme.surface,
                  borderColor: numericAmount === val ? theme.primary : theme.border,
                },
              ]}>
              <Text
                style={[
                  styles.pillText,
                  { color: numericAmount === val ? '#FFFFFF' : theme.text },
                ]}>
                ₹{val}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Financial Calculation Summary */}
        <View
          style={[
            styles.feeCard,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
          ]}>
          <View style={styles.feeRow}>
            <Text style={[styles.feeLabel, { color: theme.textSecondary }]}>Requested Amount</Text>
            <Text style={[styles.feeVal, { color: theme.text }]}>
              ₹{numericAmount.toLocaleString()}
            </Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={[styles.feeLabel, { color: theme.textSecondary }]}>Platform Fee (0%)</Text>
            <Text style={[styles.feeVal, { color: theme.success }]}>₹0.00 (Free)</Text>
          </View>
          <View style={[styles.feeDivider, { backgroundColor: theme.borderSubtle }]} />
          <View style={styles.feeRow}>
            <Text style={[styles.feeTotalLabel, { color: theme.text }]}>Net Settlement</Text>
            <Text style={[styles.feeTotalVal, { color: theme.primary }]}>
              ₹{numericAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Platform Withdrawal Policy */}
        <View
          style={[
            styles.policyCard,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
          ]}>
          <Text style={[styles.policyHeader, { color: theme.text }]}>
            Withdrawal Instructions
          </Text>
          <Text style={[styles.policyItem, { color: theme.textSecondary }]}>
            • Minimum withdrawal: ₹150 | Maximum single withdrawal: ₹10,000.
          </Text>
          <Text style={[styles.policyItem, { color: theme.textSecondary }]}>
            • Unlimited number of withdrawals per day, processed 24/7.
          </Text>
          <Text style={[styles.policyItem, { color: theme.textSecondary }]}>
            • Funds are transferred directly to your bank account via IMPS/NEFT within minutes.
          </Text>
        </View>

        {/* Submit Button */}
        <View style={styles.actionSection}>
          <Button
            variant="primary"
            size="lg"
            loading={withdrawMutation.isPending}
            onPress={handleWithdraw}
            leftIcon={<Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />}>
            Submit Withdrawal Request
          </Button>
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
    padding: Spacing.four,
    paddingBottom: Spacing.seven,
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.four,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginBottom: Spacing.four,
    ...Shadows.md,
  },
  balanceLabel: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  balanceVal: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 2,
  },
  allBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
  },
  allBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  bankCard: {
    borderRadius: Radius.lg,
    padding: Spacing.three,
    borderWidth: 1.5,
    marginBottom: Spacing.four,
    ...Shadows.sm,
  },
  bankContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  bankIconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bankName: {
    fontSize: 15,
    fontWeight: '800',
  },
  bankDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  ifscText: {
    fontSize: 11,
    marginTop: 1,
  },
  editBtn: {
    padding: 6,
  },
  bankNotBound: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  warnCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warnTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  warnSub: {
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.two,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  currencyPrefix: {
    fontSize: 20,
    fontWeight: '900',
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  pillBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    borderWidth: 1,
    ...Shadows.sm,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  feeCard: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  feeLabel: {
    fontSize: 13,
  },
  feeVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  feeDivider: {
    height: 1,
    marginVertical: 6,
  },
  feeTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  feeTotalVal: {
    fontSize: 16,
    fontWeight: '900',
  },
  policyCard: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  policyHeader: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  policyItem: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 3,
  },
  actionSection: {
    marginTop: Spacing.two,
  },
});
