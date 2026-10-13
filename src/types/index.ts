export type PlanFamily = 'land' | 'instrument' | 'dairy';

export type PlanImageKey =
  | 'land-hydroponics'
  | 'land-polyhouse'
  | 'tool-irrigation'
  | 'tool-tractor'
  | 'tool-drone'
  | 'tool-harvester'
  | 'dairy-milk'
  | 'dairy-creamery'
  | 'dairy-estate';

export interface Plan {
  id: string;
  subscription: string;
  title: string;
  subtitle: string;
  category: 'regular' | 'vip';
  family: PlanFamily;
  imageKey: PlanImageKey;
  price: number;
  dailyIncome: number;
  time: number; // in days
  totalIncome: number;
  badge?: string;
  isPopular?: boolean;
  imageUrl?: string;
  roiPercentage: number;
}

export interface UserProfile {
  id: string;
  username: string;
  phone: string;
  balance: number;
  totalRecharge: number;
  totalWithdraw: number;
  totalWelfare: number;
  inviteCode: string;
  hasActivePlan: boolean;
  avatarUrl?: string;
}

export interface StoredAccount {
  name: string;
  phone: string;
  password: string;
}

export interface BankDetails {
  holderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId?: string;
  isBound: boolean;
}

export type RecordType = 'income' | 'recharge' | 'withdraw' | 'checkin';
export type RecordStatus = 'success' | 'pending' | 'failed';

export interface TransactionRecord {
  id: string;
  type: RecordType;
  title: string;
  amount: number;
  status: RecordStatus;
  date: string;
  description?: string;
  planName?: string;
  referenceId?: string;
}

export interface CheckInStatus {
  lastCheckedInDate: string | null;
  streakDays: number;
  hasCheckedInToday: boolean;
  todayRewardClaimed: number;
}

export interface PaymentChannel {
  id: string;
  name: string;
  tag: string;
  minAmount: number;
  maxAmount: number;
  feePercentage: number;
  isRecommended?: boolean;
}

export interface TeamTier {
  level: number;
  name: string;
  rebatePercent: number;
  totalRecharge: number;
  totalMembers: number;
}

export interface TeamStats {
  totalPeople: number;
  totalRecharge: number;
  totalCommission: number;
  inviteCode: string;
  inviteUrl: string;
  tiers: TeamTier[];
}

export interface PlatformNotice {
  id: string;
  title: string;
  subtitle: string;
  launchDate: string;
  signUpBonus: number;
  dailyGiftCode: string;
  agentCashback: string;
  minWithdrawal: number;
  maxWithdrawal: number;
  referralBonusPercent: number;
  channelTelegramUrl: string;
  channelWhatsappUrl: string;
}
