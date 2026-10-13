import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { Button } from './button';
import { Badge } from './badge';
import { Plan } from '@/types';
import { Radius, Shadows, Spacing } from '@/theme';

export interface VipWithdrawalModalProps {
  visible: boolean;
  onClose: () => void;
  requiredVip: 'vip1' | 'vip2' | 'vip3' | null;
  requiredPlan: Plan | null;
  withdrawCount: number;
  onSelectPlanForInvest?: (plan: Plan) => void;
}

export function VipWithdrawalModal({
  visible,
  onClose,
  requiredVip,
  requiredPlan,
  withdrawCount,
  onSelectPlanForInvest,
}: VipWithdrawalModalProps) {
  const theme = useTheme();
  const router = useRouter();

  if (!visible || !requiredPlan) {
    return null;
  }

  const getVipContent = () => {
    switch (requiredVip) {
      case 'vip2':
        return {
          tag: 'VIP 2 REQUIRED',
          title: 'Activate VIP 2 for 2nd Withdrawal',
          subtitle:
            'You have successfully completed your 1st withdrawal! To process your 2nd withdrawal, please activate the Subscription VIP 2 plan.',
          stepIndex: 2,
        };
      case 'vip3':
        return {
          tag: 'VIP 3 ELITE REQUIRED',
          title: 'Activate All VIP Plans for Unlimited Withdrawals',
          subtitle:
            'To enjoy 100% full-balance, unlimited withdrawals with zero restrictions, please activate Subscription VIP 3.',
          stepIndex: 3,
        };
      case 'vip1':
      default:
        return {
          tag: 'VIP 1 REQUIRED',
          title: 'Activate VIP 1 to Unlock 1st Withdrawal',
          subtitle:
            'To withdraw your earnings, you must hold Subscription VIP 1. Once activated, you can withdraw up to 80% of your available balance!',
          stepIndex: 1,
        };
    }
  };

  const content = getVipContent();

  const handlePurchase = () => {
    onClose();
    if (onSelectPlanForInvest && requiredPlan) {
      onSelectPlanForInvest(requiredPlan);
    } else {
      router.push('/products');
    }
  };

  const handleGoToProducts = () => {
    onClose();
    router.push('/products');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.dialog, { backgroundColor: theme.surface }]}>
          {/* Header Banner */}
          <View style={[styles.headerBanner, { backgroundColor: theme.vipDark }]}>
            <View style={[styles.crownCircle, { backgroundColor: theme.vip }]}>
              <Icon name="crown" size={26} color="#FFFFFF" />
            </View>

            <View style={styles.headerTextWrap}>
              <View style={styles.tagRow}>
                <Badge variant="vip" size="sm">
                  {content.tag}
                </Badge>
                <Text style={styles.withdrawalCounterText}>
                  Withdrawal #{withdrawCount + 1} Attempt
                </Text>
              </View>
              <Text style={styles.headerTitle}>{content.title}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
              <Icon name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Modal Scrollable Body */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* Explanation Note */}
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {content.subtitle}
            </Text>

            {/* VIP Roadmap Steps */}
            <View
              style={[
                styles.roadmapCard,
                { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
              ]}>
              <Text style={[styles.roadmapTitle, { color: theme.text }]}>
                VIP Withdrawal Policy Roadmap
              </Text>
              <View style={styles.stepsRow}>
                <View style={[styles.stepItem, content.stepIndex === 1 && styles.stepActive]}>
                  <View
                    style={[
                      styles.stepDot,
                      {
                        backgroundColor:
                          content.stepIndex >= 1 ? theme.vip : theme.backgroundElement,
                      },
                    ]}>
                    <Text style={styles.stepNum}>1</Text>
                  </View>
                  <Text style={[styles.stepLabel, { color: theme.text }]}>VIP 1</Text>
                  <Text style={[styles.stepSub, { color: theme.textSecondary }]}>
                    80% 1st Payout
                  </Text>
                </View>

                <View style={[styles.stepLine, { backgroundColor: theme.borderSubtle }]} />

                <View style={[styles.stepItem, content.stepIndex === 2 && styles.stepActive]}>
                  <View
                    style={[
                      styles.stepDot,
                      {
                        backgroundColor:
                          content.stepIndex >= 2 ? theme.vip : theme.backgroundElement,
                      },
                    ]}>
                    <Text style={styles.stepNum}>2</Text>
                  </View>
                  <Text style={[styles.stepLabel, { color: theme.text }]}>VIP 2</Text>
                  <Text style={[styles.stepSub, { color: theme.textSecondary }]}>
                    2nd Payout
                  </Text>
                </View>

                <View style={[styles.stepLine, { backgroundColor: theme.borderSubtle }]} />

                <View style={[styles.stepItem, content.stepIndex === 3 && styles.stepActive]}>
                  <View
                    style={[
                      styles.stepDot,
                      {
                        backgroundColor:
                          content.stepIndex >= 3 ? theme.vip : theme.backgroundElement,
                      },
                    ]}>
                    <Text style={styles.stepNum}>3</Text>
                  </View>
                  <Text style={[styles.stepLabel, { color: theme.text }]}>All VIPs</Text>
                  <Text style={[styles.stepSub, { color: theme.textSecondary }]}>
                    100% Unlimited
                  </Text>
                </View>
              </View>
            </View>

            {/* Target VIP Plan Card */}
            <View
              style={[
                styles.planShowcase,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.vipBorder,
                },
              ]}>
              <View style={styles.planHeaderRow}>
                <View>
                  <Badge variant="vip" size="sm">
                    {requiredPlan.subscription}
                  </Badge>
                  <Text style={[styles.planTitleText, { color: theme.text }]}>
                    {requiredPlan.title}
                  </Text>
                </View>

                <View
                  style={[
                    styles.daysChip,
                    { backgroundColor: theme.vipLight, borderColor: theme.vipBorder },
                  ]}>
                  <Icon name="clock-outline" size={13} color={theme.vipDark} />
                  <Text style={[styles.daysText, { color: theme.vipDark }]}>
                    {requiredPlan.time} Days
                  </Text>
                </View>
              </View>

              {/* Financial Matrix */}
              <View
                style={[
                  styles.matrix,
                  { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
                ]}>
                <View style={styles.matrixCol}>
                  <Text style={[styles.matrixLabel, { color: theme.textSecondary }]}>
                    Price
                  </Text>
                  <Text style={[styles.matrixVal, { color: theme.primary }]}>
                    ₹{requiredPlan.price.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.matrixCol}>
                  <Text style={[styles.matrixLabel, { color: theme.textSecondary }]}>
                    Daily Profit
                  </Text>
                  <Text style={[styles.matrixVal, { color: theme.text }]}>
                    ₹{requiredPlan.dailyIncome.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.matrixCol}>
                  <Text style={[styles.matrixLabel, { color: theme.textSecondary }]}>
                    Total Revenue
                  </Text>
                  <Text style={[styles.matrixVal, { color: theme.vip }]}>
                    ₹{requiredPlan.totalIncome.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <Button
                variant="vip"
                size="lg"
                onPress={handlePurchase}
                leftIcon={<Icon name="lightning-bolt" size={20} color="#FFFFFF" />}>
                Get {requiredPlan.subscription} Now (₹{requiredPlan.price.toLocaleString()})
              </Button>

              <Button
                variant="outline"
                size="md"
                onPress={handleGoToProducts}
                leftIcon={<Icon name="view-grid-outline" size={16} color={theme.text} />}>
                Browse All VIP Plans
              </Button>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onClose}
                style={styles.cancelBtn}>
                <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                  Maybe Later
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    zIndex: 9999,
  },
  dialog: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '90%',
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  headerBanner: {
    padding: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  crownCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: 4,
  },
  withdrawalCounterText: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flexGrow: 0,
  },
  scrollContent: {
    padding: Spacing.four,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: Spacing.three,
  },
  roadmapCard: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  roadmapTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.two,
    textAlign: 'center',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  stepActive: {
    borderRadius: Radius.sm,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepNum: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  stepSub: {
    fontSize: 10,
    marginTop: 1,
  },
  stepLine: {
    width: 20,
    height: 2,
  },
  planShowcase: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.four,
    ...Shadows.sm,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.three,
  },
  planTitleText: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  daysChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  daysText: {
    fontSize: 11,
    fontWeight: '800',
  },
  matrix: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  matrixCol: {
    flex: 1,
    alignItems: 'center',
  },
  matrixLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  matrixVal: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  actions: {
    gap: Spacing.two,
  },
  cancelBtn: {
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
