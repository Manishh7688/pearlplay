import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services/api';
import { StorageService } from '@/services/storage';
import { RecordType } from '@/types';

export const QUERY_KEYS = {
  USER_PROFILE: ['userProfile'] as const,
  PLANS: (category?: string) => ['plans', category || 'all'] as const,
  PLAN_BY_ID: (id: string) => ['plan', id] as const,
  ACTIVE_PLANS: ['activePlans'] as const,
  BANK_DETAILS: ['bankDetails'] as const,
  TRANSACTIONS: (type?: string) => ['transactions', type || 'all'] as const,
  TEAM_STATS: ['teamStats'] as const,
  CHECK_IN_STATUS: ['checkInStatus'] as const,
};

export function useUserProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE,
    queryFn: () => ApiService.getUserProfile(),
  });
}

export function usePlans(category?: 'all' | 'regular' | 'vip') {
  return useQuery({
    queryKey: QUERY_KEYS.PLANS(category),
    queryFn: () => ApiService.getPlans(category),
  });
}

export function usePlanById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PLAN_BY_ID(id),
    queryFn: () => ApiService.getPlanById(id),
    enabled: !!id,
  });
}

export function useUserActivePlans() {
  return useQuery({
    queryKey: QUERY_KEYS.ACTIVE_PLANS,
    queryFn: () => ApiService.getUserActivePlans(),
  });
}

export function useBankDetails() {
  return useQuery({
    queryKey: QUERY_KEYS.BANK_DETAILS,
    queryFn: () => ApiService.getBankDetails(),
  });
}

export function useTransactions(type?: RecordType | 'all') {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS(type),
    queryFn: () => ApiService.getTransactions(type),
  });
}

export function useTeamStats() {
  return useQuery({
    queryKey: QUERY_KEYS.TEAM_STATS,
    queryFn: () => ApiService.getTeamStats(),
  });
}

export function useCheckInStatus() {
  return useQuery({
    queryKey: QUERY_KEYS.CHECK_IN_STATUS,
    queryFn: () => StorageService.getCheckInStatus(),
  });
}
