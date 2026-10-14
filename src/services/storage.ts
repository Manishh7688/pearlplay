import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BankDetails,
  CheckInStatus,
  Plan,
  StoredAccount,
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
  ACCOUNTS: '@pearl_accounts',
  ACCOUNT_BUNDLES: '@pearl_account_bundles',
  AUTH_SESSION: '@pearl_auth_session',
};

const EMPTY_BANK: BankDetails = {
  holderName: '',
  accountNumber: '',
  ifscCode: '',
  bankName: '',
  upiId: '',
  isBound: false,
};

const EMPTY_CHECK_IN: CheckInStatus = {
  lastCheckedInDate: null,
  streakDays: 0,
  hasCheckedInToday: false,
  todayRewardClaimed: 0,
};

interface AccountBundle {
  profile: UserProfile;
  bank: BankDetails;
  transactions: TransactionRecord[];
  plans: Plan[];
  checkIn: CheckInStatus;
  team: TeamStats;
  redeemed: string[];
}

function welcomeTransactions(): TransactionRecord[] {
  return [
    {
      id: 'tx-welcome',
      type: 'checkin',
      title: 'Platform Welcome Bonus',
      amount: 10,
      status: 'success',
      date: new Date().toISOString(),
      description: 'New user registration reward (₹10 credited)',
    },
  ];
}

function makeInviteCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

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
  async getAuthSession(): Promise<string | null> {
    return getItem<string | null>(STORAGE_KEYS.AUTH_SESSION, null);
  },

  async setAuthSession(phone: string): Promise<void> {
    await setItem(STORAGE_KEYS.AUTH_SESSION, phone);
  },

  async clearAuthSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    } catch {}
    delete memoryStore[STORAGE_KEYS.AUTH_SESSION];
  },

  async getUserProfile(): Promise<UserProfile> {
    const activePhone = await this.getAuthSession();
    if (activePhone) {
      const book = await getItem<Record<string, AccountBundle>>(STORAGE_KEYS.ACCOUNT_BUNDLES, {});
      if (book[activePhone]?.profile) {
        return book[activePhone].profile;
      }
    }
    return getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
  },

  async setUserProfile(profile: UserProfile): Promise<void> {
    await setItem(STORAGE_KEYS.USER_PROFILE, profile);
    if (profile.phone) {
      const book = await getItem<Record<string, AccountBundle>>(STORAGE_KEYS.ACCOUNT_BUNDLES, {});
      if (book[profile.phone]) {
        book[profile.phone].profile = profile;
        await setItem(STORAGE_KEYS.ACCOUNT_BUNDLES, book);
      }
    }
  },

  async getBankDetails(): Promise<BankDetails> {
    return getItem<BankDetails>(STORAGE_KEYS.BANK_DETAILS, EMPTY_BANK);
  },

  async setBankDetails(details: BankDetails): Promise<void> {
    await setItem(STORAGE_KEYS.BANK_DETAILS, details);
  },

  async getTransactions(): Promise<TransactionRecord[]> {
    return getItem<TransactionRecord[]>(STORAGE_KEYS.TRANSACTIONS, welcomeTransactions());
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
    const status = await getItem<CheckInStatus>(STORAGE_KEYS.CHECK_IN, EMPTY_CHECK_IN);

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

  async getAccounts(): Promise<StoredAccount[]> {
    const stored = await getItem<StoredAccount[]>(STORAGE_KEYS.ACCOUNTS, []);
    return stored || [];
  },

  async setAccounts(accounts: StoredAccount[]): Promise<void> {
    await setItem(STORAGE_KEYS.ACCOUNTS, accounts);
  },

  async switchToAccount(account: StoredAccount, mode: 'login' | 'register'): Promise<UserProfile> {
    const book = await getItem<Record<string, AccountBundle>>(STORAGE_KEYS.ACCOUNT_BUNDLES, {});

    const next =
      mode === 'register'
        ? this.freshBundle(account)
        : (book[account.phone] ?? this.freshBundle(account));
    book[account.phone] = next;
    await setItem(STORAGE_KEYS.ACCOUNT_BUNDLES, book);
    await this.applyBundle(next);
    await this.setAuthSession(account.phone);
    return next.profile;
  },

  freshBundle(account: StoredAccount): AccountBundle {
    return {
      profile: {
        ...INITIAL_USER,
        id: `usr-${account.phone}`,
        username: account.name,
        phone: account.phone,
        balance: 10,
        totalRecharge: 0,
        totalWithdraw: 0,
        totalWelfare: 0,
        inviteCode: makeInviteCode(),
        hasActivePlan: false,
      },
      bank: { ...EMPTY_BANK },
      transactions: welcomeTransactions(),
      plans: [],
      checkIn: { ...EMPTY_CHECK_IN },
      team: {
        ...INITIAL_TEAM_STATS,
        inviteCode: makeInviteCode(),
        inviteUrl: `https://pearlapp.agri/register?invite=${account.phone}`,
      },
      redeemed: [],
    };
  },

  async captureBundle(): Promise<AccountBundle> {
    const [profile, bank, transactions, plans, checkIn, team, redeemed] = await Promise.all([
      this.getUserProfile(),
      this.getBankDetails(),
      this.getTransactions(),
      this.getUserPlans(),
      this.getCheckInStatus(),
      this.getTeamStats(),
      this.getRedeemedCodes(),
    ]);
    return { profile, bank, transactions, plans, checkIn, team, redeemed };
  },

  async applyBundle(bundle: AccountBundle): Promise<void> {
    await Promise.all([
      setItem(STORAGE_KEYS.USER_PROFILE, bundle.profile),
      setItem(STORAGE_KEYS.BANK_DETAILS, bundle.bank),
      setItem(STORAGE_KEYS.TRANSACTIONS, bundle.transactions),
      setItem(STORAGE_KEYS.USER_PLANS, bundle.plans),
      setItem(STORAGE_KEYS.CHECK_IN, bundle.checkIn),
      setItem(STORAGE_KEYS.TEAM_STATS, bundle.team),
      setItem(STORAGE_KEYS.REDEEMED_CODES, bundle.redeemed),
    ]);
  },

  async resetAll(): Promise<void> {
    memoryStore = {};
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch {}
  },
};
