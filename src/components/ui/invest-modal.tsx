import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Icon as Ionicons } from '@/components/ui/icon';
import { Plan, UserProfile } from '@/types';
import { useTheme } from '@/hooks/use-theme';
import { useInvestMutation } from '@/hooks/use-mutations';
import { useToast } from './toast';
import { Button } from './button';
import { Badge } from './badge';
import { Radius, Shadows, Spacing } from '@/theme';

interface InvestModalProps {
  plan: Plan | null;
  user: UserProfile | undefined;
  visible: boolean;
  onClose: () => void;
}

export function InvestModal({ plan, user, visible, onClose }: InvestModalProps) {
  const theme = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const investMutation = useInvestMutation();

  if (!plan) return null;

  const currentBalance = user?.balance ?? 0;
  const isSufficient = currentBalance >= plan.price;
  const shortage = plan.price - currentBalance;

  const handleConfirmInvest = () => {
    investMutation.mutate(
      { planId: plan.id },
      {
        onSuccess: () => {
          showToast({
            message: `Successfully invested in ${plan.subscription}!`,
            type: 'success',
          });
          onClose();
        },
        onError: (err) => {
          showToast({
            message: err.message || 'Investment failed. Please try again.',
            type: 'error',
          });
        },
      }
    );
  };

  const handleGoToRecharge = () => {
    onClose();
    router.push('/recharge');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
            <View>
              <View style={styles.badgeRow}>
                <Badge variant={plan.category === 'vip' ? 'vip' : 'primary'} size="sm">
                  {plan.subscription}
                </Badge>
                {plan.badge ? (
                  <Badge variant="neutral" size="sm">
                    {plan.badge}
                  </Badge>
                ) : null}
              </View>
              <Text style={[styles.planTitle, { color: theme.text }]}>{plan.title}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Investment Details Grid */}
          <View style={styles.detailsContainer}>
            <View style={[styles.statBox, { backgroundColor: theme.surfaceSubtle }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Required Price</Text>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                ₹{plan.price.toLocaleString()}
              </Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: theme.surfaceSubtle }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Daily Profit</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                ₹{plan.dailyIncome.toLocaleString()}
              </Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: theme.surfaceSubtle }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Cycle Term</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{plan.time} Days</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: theme.surfaceSubtle }]}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Yield</Text>
              <Text style={[styles.statValue, { color: theme.vip }]}>
                ₹{plan.totalIncome.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Balance comparison banner */}
          <View
            style={[
              styles.balanceCard,
              {
                backgroundColor: isSufficient ? theme.primarySurface : theme.dangerLight,
                borderColor: isSufficient ? theme.primaryBorder : theme.danger,
              },
            ]}>
            <Ionicons
              name={isSufficient ? 'wallet-outline' : 'alert-circle-outline'}
              size={22}
              color={isSufficient ? theme.primaryDark : theme.danger}
            />
            <View style={styles.balanceInfo}>
              <Text
                style={[
                  styles.balanceText,
                  { color: isSufficient ? theme.primaryDark : theme.danger },
                ]}>
                Wallet Balance: ₹{currentBalance.toFixed(2)}
              </Text>
              {!isSufficient ? (
                <Text style={[styles.shortageText, { color: theme.danger }]}>
                  Insufficient balance. Need ₹{shortage.toFixed(2)} more.
                </Text>
              ) : null}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {isSufficient ? (
              <Button
                variant={plan.category === 'vip' ? 'vip' : 'primary'}
                size="lg"
                loading={investMutation.isPending}
                onPress={handleConfirmInvest}
                leftIcon={<Ionicons name="checkmark-done" size={20} color="#FFFFFF" />}>
                Confirm & Invest ₹{plan.price}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onPress={handleGoToRecharge}
                leftIcon={<Ionicons name="card-outline" size={20} color="#FFFFFF" />}>
                Recharge Wallet (Add ₹{Math.ceil(shortage)})
              </Button>
            )}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.cancelButton}>
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    width: '100%',
    maxWidth: 500,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.four,
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
    marginBottom: Spacing.one,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginVertical: Spacing.three,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.three,
    borderRadius: Radius.md,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  balanceInfo: {
    marginLeft: Spacing.two,
    flex: 1,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '700',
  },
  shortageText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  actions: {
    gap: Spacing.two,
  },
  cancelButton: {
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
