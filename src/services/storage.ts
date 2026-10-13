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
      date: new Date(Date.now() - 3600000 * 24).toISOString(),
      description: 'New user registration reward (₹10)',
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
  async getUserProfile(): Promise<UserProfile> {
    return getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER);
  },

  async setUserProfile(profile: UserProfile): Promise<void> {
    await setItem(STORAGE_KEYS.USER_PROFILE, profile);
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
    const stored = await getItem<StoredAccount[] | null>(STORAGE_KEYS.ACCOUNTS, null);
    if (stored && stored.length > 0) {
      return stored;
    }
    const profile = await this.getUserProfile();
    const seeded: StoredAccount[] = [
      {
        name: profile.phone === INITIAL_USER.phone ? profile.username || 'Manish' : 'Manish',
        phone: INITIAL_USER.phone,
        password: '123456',
      },
    ];
    if (/^[6-9]\d{9}$/.test(profile.phone) && profile.phone !== INITIAL_USER.phone) {
      seeded.push({
        name: profile.username || 'Member',
        phone: profile.phone,
        password: '123456',
      });
      const book = await getItem<Record<string, AccountBundle>>(STORAGE_KEYS.ACCOUNT_BUNDLES, {});
      book[profile.phone] = await this.captureBundle();
      await setItem(STORAGE_KEYS.ACCOUNT_BUNDLES, book);
    }
    await setItem(STORAGE_KEYS.ACCOUNTS, seeded);
    return seeded;
  },

  async setAccounts(accounts: StoredAccount[]): Promise<void> {
    await setItem(STORAGE_KEYS.ACCOUNTS, accounts);
  },

  async switchToAccount(account: StoredAccount, mode: 'login' | 'register'): Promise<UserProfile> {
    const current = await this.getUserProfile();
    const book = await getItem<Record<string, AccountBundle>>(STORAGE_KEYS.ACCOUNT_BUNDLES, {});

    if (mode === 'login' && current.phone === account.phone) {
      const updated = { ...current, username: account.name || current.username };
      await this.setUserProfile(updated);
      return updated;
    }

    if (current.phone) {
      book[current.phone] = await this.captureBundle();
    }

    const next =
      mode === 'register'
        ? this.freshBundle(account)
        : (book[account.phone] ?? this.freshBundle(account));
    book[account.phone] = next;
    await setItem(STORAGE_KEYS.ACCOUNT_BUNDLES, book);
    await this.applyBundle(next);
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
      team: { ...INITIAL_TEAM_STATS },
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
