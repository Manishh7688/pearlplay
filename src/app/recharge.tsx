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
import { useUserProfile } from '@/hooks/use-queries';
import { useRechargeMutation } from '@/hooks/use-mutations';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { PAYMENT_CHANNELS, QUICK_RECHARGE_AMOUNTS } from '@/services/mock-data';
import { Radius, Shadows, Spacing } from '@/theme';

export default function RechargeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const { data: user } = useUserProfile();
  const rechargeMutation = useRechargeMutation();

  const [amount, setAmount] = useState<string>('249');
  const [selectedChannel, setSelectedChannel] = useState<string>('pay-a');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const numericAmount = parseFloat(amount) || 0;

  const handleSelectQuickAmount = (val: number) => {
    setAmount(val.toString());
    setErrorMessage('');
  };

  const handleRecharge = () => {
    if (isNaN(numericAmount) || numericAmount < 100) {
      setErrorMessage('Minimum recharge amount is ₹100');
      return;
    }

    setErrorMessage('');
    rechargeMutation.mutate(
      { amount: numericAmount, channelId: selectedChannel },
      {
        onSuccess: (updated) => {
          showToast({
            message: `₹${numericAmount.toLocaleString()} credited successfully! New balance: ₹${updated.balance.toFixed(2)}`,
            type: 'success',
          });
          setTimeout(() => {
            router.back();
          }, 800);
        },
        onError: (err) => {
          showToast({
            message: err.message || 'Payment failed. Please try again.',
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
      <ScreenHeader title="Recharge Balance" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* Current Balance Overview */}
        <View
          style={[
            styles.balanceCard,
            {
              backgroundColor: theme.primaryDark,
              borderColor: theme.primaryBorder,
            },
          ]}>
          <View style={styles.coinCircle}>
            <Ionicons name="cash" size={24} color="#FCD34D" />
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.three }}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceVal}>₹{(user?.balance ?? 0).toFixed(2)}</Text>
          </View>
          <Badge variant="success" size="sm">
            Instant Credit
          </Badge>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Enter Amount</Text>
          <Input
            value={amount}
            onChangeText={(txt) => {
              setAmount(txt);
              setErrorMessage('');
            }}
            keyboardType="numeric"
            placeholder="Min ₹100"
            prefix={<Text style={[styles.currencyPrefix, { color: theme.primary }]}>₹</Text>}
            error={errorMessage}
            hint="Supports all Indian UPI apps, NetBanking, and IMPS"
          />
        </View>

        {/* Quick Amount Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Quick Plan Presets
          </Text>
          <View style={styles.presetGrid}>
            {QUICK_RECHARGE_AMOUNTS.map((val) => {
              const isSelected = numericAmount === val;
              return (
                <TouchableOpacity
                  key={val}
                  activeOpacity={0.75}
                  onPress={() => handleSelectQuickAmount(val)}
                  style={[
                    styles.presetBtn,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.surface,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.presetText,
                      { color: isSelected ? '#FFFFFF' : theme.text },
                    ]}>
                    ₹{val.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Online Payment Channels */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Select Payment Channel
          </Text>
          {PAYMENT_CHANNELS.map((ch) => {
            const isSelected = selectedChannel === ch.id;
            return (
              <TouchableOpacity
                key={ch.id}
                activeOpacity={0.8}
                onPress={() => setSelectedChannel(ch.id)}
                style={[
                  styles.channelCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: isSelected ? theme.primary : theme.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: isSelected ? theme.primary : theme.textMuted,
                      backgroundColor: isSelected ? theme.primary : 'transparent',
                    },
                  ]}>
                  {isSelected ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : null}
                </View>

                <View style={styles.channelInfo}>
                  <View style={styles.channelNameRow}>
                    <Text style={[styles.channelName, { color: theme.text }]}>
                      {ch.name}
                    </Text>
                    {ch.isRecommended ? (
                      <Badge variant="success" size="sm">
                        Recommended
                      </Badge>
                    ) : null}
                  </View>
                  <Text style={[styles.channelTag, { color: theme.textSecondary }]}>
                    {ch.tag} • Limit ₹{ch.minAmount} - ₹{ch.maxAmount.toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Payment Safety Notice */}
        <View
          style={[
            styles.safetyCard,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
          ]}>
          <Ionicons name="shield-checkmark-outline" size={18} color={theme.primary} />
          <Text style={[styles.safetyText, { color: theme.textSecondary }]}>
            256-bit encrypted gateway. Deposit will be credited automatically within 10-30 seconds.
          </Text>
        </View>

        {/* Submit Recharge Button */}
        <View style={styles.actionSection}>
          <Button
            variant="primary"
            size="lg"
            loading={rechargeMutation.isPending}
            onPress={handleRecharge}
            leftIcon={<Ionicons name="flash-outline" size={20} color="#FFFFFF" />}>
            Recharge Now (₹{numericAmount > 0 ? numericAmount.toLocaleString() : '0'})
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
    alignItems: 'center',
    padding: Spacing.four,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginBottom: Spacing.four,
    ...Shadows.md,
  },
  coinCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(252, 211, 77, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  balanceVal: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.four,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: Spacing.two,
  },
  currencyPrefix: {
    fontSize: 20,
    fontWeight: '900',
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  presetBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    borderWidth: 1,
    minWidth: '30%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '800',
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.lg,
    marginBottom: Spacing.two,
    ...Shadows.sm,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  channelInfo: {
    flex: 1,
  },
  channelNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  channelName: {
    fontSize: 14,
    fontWeight: '700',
  },
  channelTag: {
    fontSize: 12,
    marginTop: 2,
  },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  safetyText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  actionSection: {
    marginTop: Spacing.two,
  },
});
