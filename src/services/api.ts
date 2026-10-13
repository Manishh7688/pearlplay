import {
  BankDetails,
  CheckInStatus,
  Plan,
  RecordType,
  TeamStats,
  TransactionRecord,
  UserProfile,
} from '@/types';
import {
  INITIAL_PLANS,
  INITIAL_PLATFORM_NOTICE,
  VALID_GIFT_CODES,
} from './mock-data';
import { StorageService } from './storage';

const delay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const ApiService = {
  // Fetch available investment subscriptions
  async getPlans(category?: 'all' | 'regular' | 'vip'): Promise<Plan[]> {
    await delay(350);
    if (!category || category === 'all') {
      return [...INITIAL_PLANS];
    }
    return INITIAL_PLANS.filter((p) => p.category === category);
  },

  // Fetch plan by ID
  async getPlanById(id: string): Promise<Plan | undefined> {
    await delay(200);
    return INITIAL_PLANS.find((p) => p.id === id);
  },

  // Fetch user profile
  async getUserProfile(): Promise<UserProfile> {
    await delay(300);
    return StorageService.getUserProfile();
  },

  // Fetch user's active investments
  async getUserActivePlans(): Promise<Plan[]> {
    await delay(300);
    return StorageService.getUserPlans();
  },

  // Fetch bank binding info
  async getBankDetails(): Promise<BankDetails> {
    await delay(250);
    return StorageService.getBankDetails();
  },

  // Save bank details
  async saveBankDetails(details: Omit<BankDetails, 'isBound'>): Promise<BankDetails> {
    await delay(600);

    if (!details.holderName.trim()) {
      throw new Error('Please enter account holder name');
    }
    if (!details.accountNumber.trim() || details.accountNumber.length < 9) {
      throw new Error('Please enter a valid bank account number');
    }
    if (!details.ifscCode.trim() || details.ifscCode.length < 11) {
      throw new Error('Please enter a valid 11-digit IFSC code (e.g. SBIN0001234)');
    }

    const updated: BankDetails = {
      ...details,
      bankName: details.bankName || 'State Bank of India',
      isBound: true,
    };

    await StorageService.setBankDetails(updated);
    return updated;
  },

  // Wallet Recharge
  async rechargeWallet(amount: number, channelId: string): Promise<UserProfile> {
    await delay(700);

    if (!amount || amount < 100) {
      throw new Error('Minimum recharge amount is ₹100');
    }

    const currentProfile = await StorageService.getUserProfile();
    const updatedProfile: UserProfile = {
      ...currentProfile,
      balance: currentProfile.balance + amount,
      totalRecharge: currentProfile.totalRecharge + amount,
    };

    await StorageService.setUserProfile(updatedProfile);

    // Record transaction
    const record: TransactionRecord = {
      id: `rcg-${Date.now()}`,
      type: 'recharge',
      title: `Recharge via ${channelId.toUpperCase()}`,
      amount: amount,
      status: 'success',
      date: new Date().toISOString(),
      description: `Instant online payment credited to wallet`,
      referenceId: `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    };
    await StorageService.addTransaction(record);

    return updatedProfile;
  },

  // Withdraw funds
  async withdrawFunds(amount: number): Promise<UserProfile> {
    await delay(750);

    const bankDetails = await StorageService.getBankDetails();
    if (!bankDetails.isBound || !bankDetails.accountNumber) {
      throw new Error('Please bind your bank account details before requesting a withdrawal.');
    }

    const notice = INITIAL_PLATFORM_NOTICE;
    if (amount < notice.minWithdrawal) {
      throw new Error(`Minimum withdrawal amount is ₹${notice.minWithdrawal}`);
    }
    if (amount > notice.maxWithdrawal) {
      throw new Error(`Maximum single withdrawal limit is ₹${notice.maxWithdrawal}`);
    }

    const currentProfile = await StorageService.getUserProfile();
    if (currentProfile.balance < amount) {
      throw new Error(
        `Insufficient balance. Current balance is ₹${currentProfile.balance.toFixed(2)}, requested ₹${amount}`
      );
    }

    const updatedProfile: UserProfile = {
      ...currentProfile,
      balance: currentProfile.balance - amount,
      totalWithdraw: currentProfile.totalWithdraw + amount,
    };

    await StorageService.setUserProfile(updatedProfile);

    // Record withdrawal transaction
    const record: TransactionRecord = {
      id: `wth-${Date.now()}`,
      type: 'withdraw',
      title: `Bank Withdrawal to ${bankDetails.bankName || 'Bank'}`,
      amount: amount,
      status: 'pending', // matching standard fintech withdrawal review status
      date: new Date().toISOString(),
      description: `Account ending in ••••${bankDetails.accountNumber.slice(-4)} (0% handling fee)`,
      referenceId: `WTX${Math.floor(10000000 + Math.random() * 90000000)}`,
    };
    await StorageService.addTransaction(record);

    return updatedProfile;
  },

  // Invest in plan / subscription
  async investInPlan(planId: string): Promise<{ profile: UserProfile; plan: Plan }> {
    await delay(800);

    const plan = INITIAL_PLANS.find((p) => p.id === planId);
    if (!plan) {
      throw new Error('Plan not found.');
    }

    const currentProfile = await StorageService.getUserProfile();
    if (currentProfile.balance < plan.price) {
      const shortage = plan.price - currentProfile.balance;
      throw new Error(
        `Insufficient balance! You need ₹${shortage.toFixed(2)} more to invest in ${plan.subscription}. Please recharge first.`
      );
    }

    const updatedProfile: UserProfile = {
      ...currentProfile,
      balance: currentProfile.balance - plan.price,
      totalWelfare: currentProfile.totalWelfare + plan.dailyIncome,
      hasActivePlan: true,
    };

    await StorageService.setUserProfile(updatedProfile);
    await StorageService.addUserPlan(plan);

    // Record purchase transaction
    const record: TransactionRecord = {
      id: `inv-${Date.now()}`,
      type: 'income',
      title: `Invested in ${plan.subscription}`,
      amount: plan.price,
      status: 'success',
      date: new Date().toISOString(),
      description: `${plan.title} (Daily yield ₹${plan.dailyIncome} for ${plan.time} days)`,
      planName: plan.subscription,
      referenceId: `INV${Math.floor(10000000 + Math.random() * 90000000)}`,
    };
    await StorageService.addTransaction(record);

    return { profile: updatedProfile, plan };
  },

  // Daily Check-in Claim
  async claimDailyCheckIn(): Promise<{ reward: number; status: CheckInStatus; profile: UserProfile }> {
    await delay(500);

    const user = await StorageService.getUserProfile();
    const checkIn = await StorageService.getCheckInStatus();

    if (checkIn.hasCheckedInToday) {
      throw new Error('You have already claimed today’s check-in bonus. Come back tomorrow!');
    }

    // According to platform notification: Daily Gift Code/CheckIn ₹8 to ₹200 (Requires Plan)
    // We award between ₹8 to ₹25 randomly for daily check-in
    const reward = Math.floor(Math.random() * 18) + 8; // ₹8 - ₹25
    const todayStr = new Date().toISOString().split('T')[0];

    const updatedCheckIn: CheckInStatus = {
      lastCheckedInDate: todayStr,
      streakDays: checkIn.streakDays + 1,
      hasCheckedInToday: true,
      todayRewardClaimed: reward,
    };

    const updatedProfile: UserProfile = {
      ...user,
      balance: user.balance + reward,
    };

    await StorageService.setCheckInStatus(updatedCheckIn);
    await StorageService.setUserProfile(updatedProfile);

    // Record check-in bonus
    const record: TransactionRecord = {
      id: `chk-${Date.now()}`,
      type: 'checkin',
      title: `Daily Check-In Streak #${updatedCheckIn.streakDays}`,
      amount: reward,
      status: 'success',
      date: new Date().toISOString(),
      description: `Daily agricultural activity attendance gift bonus`,
    };
    await StorageService.addTransaction(record);

    return { reward, status: updatedCheckIn, profile: updatedProfile };
  },

  // Redeem Promo / Gift Code
  async redeemGiftCode(rawCode: string): Promise<{ bonus: number; profile: UserProfile }> {
    await delay(600);

    const code = rawCode.trim().toUpperCase();
    if (!code) {
      throw new Error('Please enter a gift redemption code.');
    }

    const redeemed = await StorageService.getRedeemedCodes();
    if (redeemed.includes(code)) {
      throw new Error('This gift code has already been claimed on your account.');
    }

    const reward = VALID_GIFT_CODES[code];
    if (!reward) {
      throw new Error('Invalid or expired gift code. Please check your Telegram channel for current codes.');
    }

    const user = await StorageService.getUserProfile();
    const updatedProfile: UserProfile = {
      ...user,
      balance: user.balance + reward,
    };

    await StorageService.addRedeemedCode(code);
    await StorageService.setUserProfile(updatedProfile);

    // Record code redemption
    const record: TransactionRecord = {
      id: `rdm-${Date.now()}`,
      type: 'checkin',
      title: `Voucher Code: ${code}`,
      amount: reward,
      status: 'success',
      date: new Date().toISOString(),
      description: `Official Telegram promotional redemption bonus`,
    };
    await StorageService.addTransaction(record);

    return { bonus: reward, profile: updatedProfile };
  },

  // Get transaction records
  async getTransactions(type?: RecordType | 'all'): Promise<TransactionRecord[]> {
    await delay(350);
    const records = await StorageService.getTransactions();
    if (!type || type === 'all') {
      return records;
    }
    return records.filter((r) => r.type === type);
  },

  // Get team stats
  async getTeamStats(): Promise<TeamStats> {
    await delay(300);
    return StorageService.getTeamStats();
  },

  // Login authentication
  async login(phone: string, pass: string): Promise<UserProfile> {
    await delay(600);
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (cleanPhone.length < 10) {
      throw new Error('Please enter a valid 10-digit mobile number');
    }
    if (pass.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Accept user credentials from prompt or any valid mock
    const user = await StorageService.getUserProfile();
    const updated = {
      ...user,
      phone: cleanPhone,
    };
    await StorageService.setUserProfile(updated);
    return updated;
  },

  // Reset demo data to defaults
  async resetDemoData(): Promise<UserProfile> {
    await StorageService.resetAll();
    return StorageService.getUserProfile();
  },
};
