import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BankDetails,
  CheckInStatus,
  Plan,
  TeamStats,
  TransactionRecord,
  UserProfile,
} from '@/types';
import {
  INITIAL_PLANS,
  INITIAL_TEAM_STATS,
  INITIAL_USER,
} from './mock-data';

const STORAGE_KEYS = {
  USER_PROFILE: '@pearl_user_profile',
  BANK_DETAILS: '@pearl_bank_details',
  TRANSACTIONS: '@pearl_transactions',
  USER_PLANS: '@pearl_user_plans',
  CHECK_IN: '@pearl_check_in',
  TEAM_STATS: '@pearl_team_stats',
  REDEEMED_CODES: '@pearl_redeemed_codes',
};

// In-memory fallback if AsyncStorage is unavailable
let memoryStore: Record<string, string> = {};

async function getItem<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch {
    if (memoryStore[key]) {
      return JSON.parse(memoryStore[key]) as T;
    }
  }
  return defaultValue;
}

async function setItem<T>(key: string, value: T): Promise<void> {
  const serialized = JSON.stringify(value);
  try {
    await AsyncStorage.setItem(key, serialized);
  } catch {
    memoryStore[key] = serialized;
  }
}

export const StorageService = {
  async getUserProfile(): Promise<UserProfile> {
    return getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
  },

  async setUserProfile(profile: UserProfile): Promise<void> {
    await setItem(STORAGE_KEYS.USER_PROFILE, profile);
  },

  async getBankDetails(): Promise<BankDetails> {
    return getItem<BankDetails>(STORAGE_KEYS.BANK_DETAILS, {
      holderName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      upiId: '',
      isBound: false,
    });
  },

  async setBankDetails(details: BankDetails): Promise<void> {
    await setItem(STORAGE_KEYS.BANK_DETAILS, details);
  },

  async getTransactions(): Promise<TransactionRecord[]> {
    return getItem<TransactionRecord[]>(STORAGE_KEYS.TRANSACTIONS, [
      {
        id: 'tx-welcome',
        type: 'checkin',
        title: 'Platform Welcome Bonus',
        amount: 10,
        status: 'success',
        date: new Date(Date.now() - 3600000 * 24).toISOString(),
        description: 'New user registration reward (₹10)',
      },
    ]);
  },

  async addTransaction(record: TransactionRecord): Promise<void> {
    const records = await this.getTransactions();
    records.unshift(record);
    await setItem(STORAGE_KEYS.TRANSACTIONS, records);
  },

  async getUserPlans(): Promise<Plan[]> {
    return getItem<Plan[]>(STORAGE_KEYS.USER_PLANS, []);
  },

  async addUserPlan(plan: Plan): Promise<void> {
    const plans = await this.getUserPlans();
    plans.unshift(plan);
    await setItem(STORAGE_KEYS.USER_PLANS, plans);
  },

  async getCheckInStatus(): Promise<CheckInStatus> {
    const status = await getItem<CheckInStatus>(STORAGE_KEYS.CHECK_IN, {
      lastCheckedInDate: null,
      streakDays: 0,
      hasCheckedInToday: false,
      todayRewardClaimed: 0,
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const hasCheckedInToday = status.lastCheckedInDate === todayStr;

    return {
      ...status,
      hasCheckedInToday,
    };
  },

  async setCheckInStatus(status: CheckInStatus): Promise<void> {
    await setItem(STORAGE_KEYS.CHECK_IN, status);
  },

  async getTeamStats(): Promise<TeamStats> {
    return getItem<TeamStats>(STORAGE_KEYS.TEAM_STATS, INITIAL_TEAM_STATS);
  },

  async getRedeemedCodes(): Promise<string[]> {
    return getItem<string[]>(STORAGE_KEYS.REDEEMED_CODES, []);
  },

  async addRedeemedCode(code: string): Promise<void> {
    const codes = await this.getRedeemedCodes();
    codes.push(code.toUpperCase());
    await setItem(STORAGE_KEYS.REDEEMED_CODES, codes);
  },

  async resetAll(): Promise<void> {
    memoryStore = {};
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch {}
  },
};
