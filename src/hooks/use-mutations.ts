import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/api';
import { BankDetails } from '@/types';
import { QUERY_KEYS } from './use-queries';

export function useRechargeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ amount, channelId }: { amount: number; channelId: string }) =>
      ApiService.rechargeWallet(amount, channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useWithdrawMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ amount }: { amount: number }) => ApiService.withdrawFunds(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useInvestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId }: { planId: string }) => ApiService.investInPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVE_PLANS });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useSaveBankDetailsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (details: Omit<BankDetails, 'isBound'>) => ApiService.saveBankDetails(details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BANK_DETAILS });
    },
  });
}

export function useDailyCheckInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ApiService.claimDailyCheckIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHECK_IN_STATUS });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useRedeemGiftCodeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => ApiService.redeemGiftCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ phone, pass }: { phone: string; pass: string }) =>
      ApiService.login(phone, pass),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; phone: string; password: string }) =>
      ApiService.register(input),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useResetDemoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ApiService.resetDemoData(),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
