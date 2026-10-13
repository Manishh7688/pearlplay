import { Plan, TransactionRecord } from '@/types';
import { INITIAL_PLANS } from './mock-data';

export interface VipWithdrawalStatus {
  hasInvested: boolean;
  hasVip1: boolean;
  hasVip2: boolean;
  hasVip3: boolean;
  hasAllVip: boolean;
  withdrawCount: number;
  canWithdraw: boolean;
  requiredVip: 'vip1' | 'vip2' | 'vip3' | null;
  requiredPlan: Plan | null;
  maxPercentage: number; // 0.8 (80%) or 1.0 (100%)
  maxWithdrawableAmount: number;
  statusMessage: string;
}

export const VIP_PLANS = {
  VIP1: INITIAL_PLANS.find((p) => p.id === 'sub-vip-1')!,
  VIP2: INITIAL_PLANS.find((p) => p.id === 'sub-vip-2')!,
  VIP3: INITIAL_PLANS.find((p) => p.id === 'sub-vip-3')!,
};

export function checkVipWithdrawalStatus(
  userPlans: Plan[] = [],
  transactions: TransactionRecord[] = [],
  balance: number = 0
): VipWithdrawalStatus {
  const hasInvested = userPlans.length > 0;
  const hasVip1 = userPlans.some((p) => p.id === 'sub-vip-1');
  const hasVip2 = userPlans.some((p) => p.id === 'sub-vip-2');
  const hasVip3 = userPlans.some((p) => p.id === 'sub-vip-3');
  const hasAllVip = hasVip1 && hasVip2 && hasVip3;

  const withdrawTransactions = transactions.filter(
    (t) => t.type === 'withdraw' && t.status !== 'failed'
  );
  const withdrawCount = withdrawTransactions.length;

  // Case 1: All VIP plans purchased -> UNLIMITED WITHDRAWALS
  if (hasAllVip) {
    return {
      hasInvested,
      hasVip1,
      hasVip2,
      hasVip3,
      hasAllVip: true,
      withdrawCount,
      canWithdraw: true,
      requiredVip: null,
      requiredPlan: null,
      maxPercentage: 1.0,
      maxWithdrawableAmount: balance,
      statusMessage: '👑 Unlimited VIP Access: 100% Unrestricted Withdrawals Active',
    };
  }

  // Case 2: First withdrawal attempt (withdrawCount === 0)
  if (withdrawCount === 0) {
    if (!hasVip1) {
      return {
        hasInvested,
        hasVip1: false,
        hasVip2,
        hasVip3,
        hasAllVip: false,
        withdrawCount: 0,
        canWithdraw: false,
        requiredVip: 'vip1',
        requiredPlan: VIP_PLANS.VIP1,
        maxPercentage: 0.8,
        maxWithdrawableAmount: Math.floor(balance * 0.8),
        statusMessage: '🔒 VIP 1 Plan Required: Purchase Subscription VIP 1 to unlock your 1st withdrawal (up to 80%).',
      };
    }

    // Has VIP 1 -> Allowed up to 80%
    const max80 = Math.floor(balance * 0.8);
    return {
      hasInvested,
      hasVip1: true,
      hasVip2,
      hasVip3,
      hasAllVip: false,
      withdrawCount: 0,
      canWithdraw: true,
      requiredVip: null,
      requiredPlan: null,
      maxPercentage: 0.8,
      maxWithdrawableAmount: max80,
      statusMessage: `🌟 VIP 1 Active: 1st withdrawal unlocked (Max 80% = ₹${max80.toLocaleString()}). Next withdrawal requires VIP 2.`,
    };
  }

  // Case 3: Second withdrawal attempt (withdrawCount === 1)
  if (withdrawCount === 1) {
    if (!hasVip2) {
      return {
        hasInvested,
        hasVip1,
        hasVip2: false,
        hasVip3,
        hasAllVip: false,
        withdrawCount: 1,
        canWithdraw: false,
        requiredVip: 'vip2',
        requiredPlan: VIP_PLANS.VIP2,
        maxPercentage: 1.0,
        maxWithdrawableAmount: balance,
        statusMessage: '🔒 VIP 2 Plan Required: You have completed 1 withdrawal. Activate VIP 2 to unlock your 2nd withdrawal.',
      };
    }

    // Has VIP 2 -> Allowed 2nd withdrawal
    return {
      hasInvested,
      hasVip1,
      hasVip2: true,
      hasVip3,
      hasAllVip: false,
      withdrawCount: 1,
      canWithdraw: true,
      requiredVip: null,
      requiredPlan: null,
      maxPercentage: 1.0,
      maxWithdrawableAmount: balance,
      statusMessage: '🌟 VIP 2 Active: 2nd withdrawal unlocked. Activate VIP 3 to unlock unlimited withdrawals.',
    };
  }

  // Case 4: Third or more withdrawal attempt (withdrawCount >= 2) -> requires VIP 3 for unlimited
  if (!hasVip3) {
    return {
      hasInvested,
      hasVip1,
      hasVip2,
      hasVip3: false,
      hasAllVip: false,
      withdrawCount,
      canWithdraw: false,
      requiredVip: 'vip3',
      requiredPlan: VIP_PLANS.VIP3,
      maxPercentage: 1.0,
      maxWithdrawableAmount: balance,
      statusMessage: '🔒 VIP 3 Plan Required: Complete all VIP tiers to unlock unlimited 100% withdrawals.',
    };
  }

  // Fallback (All VIPs owned)
  return {
    hasInvested,
    hasVip1: true,
    hasVip2: true,
    hasVip3: true,
    hasAllVip: true,
    withdrawCount,
    canWithdraw: true,
    requiredVip: null,
    requiredPlan: null,
    maxPercentage: 1.0,
    maxWithdrawableAmount: balance,
    statusMessage: '👑 Unlimited VIP Access: 100% Unrestricted Withdrawals Active',
  };
}
