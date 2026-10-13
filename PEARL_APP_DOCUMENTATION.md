# Pearl App — Agro-Yield & Smart Farming Financial Application

> **Design & Engineering Documentation**  
> Built with **React Native**, **Expo Router (SDK 57)**, **TanStack React Query**, and **Yarn**.  
> Inspired by and fully upgraded from `https://aagriculltural55.com/`.

---

## 1. Executive Summary

**Pearl App** is a next-generation mobile and web application for smart agricultural equipment crowd-investment and daily income yield distribution. The application matches and expands upon 100% of the business logic of `https://aagriculltural55.com/` while delivering a vastly superior, modern, and trustworthy aesthetic.

### Key Enhancements over the Original Website:
| Dimension | Original Website (`aagriculltural55.com`) | **Pearl App** Upgrade |
| :--- | :--- | :--- |
| **Visual Design** | Harsh neon green (`#00b050`), boxy containers, pixelated tractor cliparts | Luxurious Emerald & Jade Green palette (`#064E3B`, `#059669`, `#10B981`) with Amber/Gold VIP accents and Pearl surfaces |
| **Typography & Hierarchy** | Generic browser fonts, inconsistent font sizes | Polished font hierarchy, crisp metric badges, bold profit numbers, and clear helper hints |
| **State Management** | Raw imperative jQuery AJAX calls and jQuery eval scripts | **TanStack React Query** (`@tanstack/react-query`) with query caching, optimistic mutations, and automated cache invalidation |
| **Loading & Error Handling** | Full-screen blocking spinners or blank unhandled states | Shimmer skeleton cards (`<PlanCardSkeleton />`), inline spinners, friendly error views with retry triggers (`<ErrorView />`), and in-app toasts |
| **Navigation & Routing** | Monolithic single-page script switching via `history.pushState` | **Expo Router** file-based navigation with clean bottom tabs `(tabs)` and standalone stack screens (`/recharge`, `/withdraw`, `/bank-details`, `/checkin`, `/records`, `/about`, `/support`, `/login`) |
| **Input Validation** | Native browser alerts and plain input boxes | Masked numeric inputs, prefix chips (`+91`, `₹`), real-time IFSC validation, bank account length checking, and balance shortage calculations |
| **Persistence** | Session cookies and server session | Local `AsyncStorage` repository with fallback memory store, preserving balances, streak, and bank credentials |

---

## 2. Static Subscription Dataset

The 9 official subscription plans are incorporated with exact financial parity and enriched with agricultural equipment names and ROI calculation:

| # | Subscription Label | Equipment / Project Name | Category | Price (₹) | Daily Income (₹) | Term (Days) | Total Revenue (₹) | Net ROI |
| :-: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | Subscription 1 | Pearl Eco-Hydroponics I | Regular | ₹249 | ₹310 | 60 | ₹18,600 | **+7,370%** |
| **2** | Subscription 2 | Pearl Solar Irrigation II | Regular | ₹599 | ₹499 | 45 | ₹22,455 | **+3,649%** |
| **3** | Subscription 3 | Pearl Tractor Fleet III | Regular | ₹1,100 | ₹699 | 40 | ₹27,960 | **+2,442%** |
| **4** | Subscription 4 | Pearl Climate Polyhouse IV | Regular | ₹1,999 | ₹1,849 | 30 | ₹55,470 | **+2,675%** |
| **5** | Subscription 5 | Pearl Drone Sprayer V | Regular | ₹2,599 | ₹2,499 | 25 | ₹62,475 | **+2,304%** |
| **6** | Subscription 6 | Pearl Autonomous Harvester VI | Regular | ₹3,199 | ₹2,849 | 25 | ₹71,225 | **+2,126%** |
| **7** | Subscription VIP 1 | VIP Rapid Cycle Alpha | VIP | ₹449 | ₹1,549 | 7 | ₹10,843 | **+2,315%** |
| **8** | Subscription VIP 2 | VIP High-Speed Beta | VIP | ₹749 | ₹2,199 | 6 | ₹13,194 | **+1,662%** |
| **9** | Subscription VIP 3 | VIP Elite Harvest Gamma | VIP | ₹1,899 | ₹3,318 | 5 | ₹16,590 | **+774%** |

---

## 3. Architecture & Separate Routes Navigation

The project follows the standard **Expo Router** convention inside `src/app/`:

```
src/
├── app/
│   ├── _layout.tsx               # Root Layout: QueryClientProvider, ToastProvider, ThemeProvider, Stack
│   ├── index.tsx                 # Entry redirect to /(tabs)
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Custom 4-tab Bottom Navigator (Home, Products, Promotion, Mine)
│   │   ├── index.tsx             # Home Screen (Hero, Balance Card, Quick Actions, Ticker, Featured Plan)
│   │   ├── products.tsx          # Agro-Yield Plans Catalog (All / Regular / VIP filter tabs, Plan Cards)
│   │   ├── team.tsx              # Agent Promotion & 3-Tier Commission Network (15% / 3% / 1%)
│   │   └── profile.tsx           # Mine / Profile Screen (Balance, Stats, Records, Settings, Logout)
│   ├── recharge.tsx              # Dedicated Recharge Route (Presets ₹249-₹3,199, Channel PAY-A/PAY-B)
│   ├── withdraw.tsx              # Dedicated Withdraw Route (Limits ₹150-₹10,000, 0% Fee, Bank check)
│   ├── bank-details.tsx          # Bank Account Binding Route (Holder Name, Account No, IFSC Code)
│   ├── checkin.tsx               # Daily Check-in Streak & Gift Code Redemption Route
│   ├── records.tsx               # Transaction History Route (Tabs: All, Investments, Recharge, Withdraw)
│   ├── about.tsx                 # Company Profile, Vision, and Regulatory Guarantee
│   ├── support.tsx               # Telegram Channel, WhatsApp Live Support, and FAQ Accordion
│   └── login.tsx                 # Auth Screen (Phone + 6-digit PIN, default: 7891192158 / 123456)
├── components/
│   ├── home/
│   │   ├── balance-card.tsx      # Balance Card with Eye Toggle and Quick Recharge trigger
│   │   ├── quick-actions.tsx     # CheckIn, Invite, Recharge, Withdraw buttons
│   │   ├── live-ticker.tsx       # Animated Real-Time Withdrawal proof ticker
│   │   └── banner-carousel.tsx   # Modern agriculture technology banner
│   ├── plans/
│   │   ├── plan-card.tsx         # Reusable Subscription Card with ROI, daily profit, duration
│   │   └── plan-filter-tabs.tsx  # All Plans / Daily Plans / VIP Welfare filter bar
│   └── ui/
│       ├── button.tsx            # Button with variants (primary, vip, secondary, outline, danger) & spinner
│       ├── badge.tsx             # Badges for status, VIP tiers, and verified labels
│       ├── card.tsx              # Elevated glassmorphic card containers
│       ├── input.tsx             # Styled text inputs with icons, prefix (+91, ₹), and validation errors
│       ├── screen-header.tsx     # Standard screen header with back navigation and action slot
│       ├── toast.tsx             # Context-based Toast notification banner
│       ├── loading-skeleton.tsx  # Shimmer loading placeholders for TanStack Query
│       ├── error-view.tsx        # Error state with friendly messaging and Retry button
│       ├── empty-view.tsx        # Empty state graphic and text
│       ├── announcement-modal.tsx# Official Announcement popup (July 2026 launch rules, Telegram link)
│       └── invest-modal.tsx      # Investment Confirmation sheet with balance check & Recharge fallback
├── hooks/
│   ├── use-queries.ts            # TanStack React Query hooks (useUserProfile, usePlans, useTransactions...)
│   ├── use-mutations.ts          # TanStack React Query mutations (useRecharge, useWithdraw, useInvest...)
│   └── use-theme.ts              # Theme accessor hook for light & dark palettes
├── services/
│   ├── api.ts                    # Simulated API layer with latency, balance updates, and error handling
│   ├── mock-data.ts              # 9 subscriptions, initial user Manish, platform rules, live ticker data
│   └── storage.ts                # AsyncStorage persistence layer
├── theme/
│   └── index.ts                  # Color tokens, spacing, typography, and shadow presets
└── types/
    └── index.ts                  # TypeScript interfaces for all data structures
```

---

## 4. TanStack React Query Integration

The application leverages `@tanstack/react-query` to provide seamless data fetching, caching, loading skeletons, and automated cache invalidation:

### Queries (`src/hooks/use-queries.ts`):
- `useUserProfile()`: Queries current user balance (starts with ₹10.00 sign-up bonus), total recharge, total withdraw, welfare revenue, and active plan status.
- `usePlans(category)`: Queries the 9 subscription plans filtered by `all`, `regular`, or `vip`.
- `useBankDetails()`: Queries registered bank account holder, account number, and IFSC code.
- `useTransactions(type)`: Queries transaction logs categorized by `all`, `income`, `recharge`, or `withdraw`.
- `useTeamStats()`: Queries referral team member count, team turnover, and 3-tier commission breakdown.
- `useCheckInStatus()`: Queries daily attendance streak and claims.

### Mutations (`src/hooks/use-mutations.ts`):
- `useRechargeMutation()`: Submits wallet deposit, updates balance, appends a `recharge` transaction record, and invalidates `['userProfile']` & `['transactions']`.
- `useWithdrawMutation()`: Validates bank binding, checks minimum ₹150 and maximum ₹10,000 limits, validates balance sufficiency, deducts wallet funds, appends a `withdraw` transaction record, and invalidates queries.
- `useInvestMutation()`: Validates that `walletBalance >= planPrice`, deducts price, credits welfare revenue, activates active plan status, appends an `income` transaction record, and invalidates queries.
- `useSaveBankDetailsMutation()`: Validates 9-digit account number and 11-character IFSC code, saves details to storage, and invalidates `['bankDetails']`.
- `useDailyCheckInMutation()`: Credits ₹8 - ₹25 attendance bonus, updates daily streak, and invalidates queries.
- `useRedeemGiftCodeMutation()`: Validates official Telegram promotional codes (e.g. `PEARL2026`, `VIPBONUS`, `AGRI100`), credits instant wallet cash, and invalidates queries.
- `useLoginMutation()`: Authenticates user credentials (`7891192158` / `123456`) and updates the user session.

---

## 5. Business Logic & Feature Parity

1. **Initial Welcome Bonus:**
   - Every user starts with ₹10.00 credited automatically to their account balance upon registration/first launch.
2. **Platform Announcement Notice:**
   - On the Home screen, tapping the notification bell opens the official popup detailing:
     - Platform launch date: July 2026
     - Sign-up bonus: ₹10
     - Daily gift code: ₹8 to ₹200 (Requires Plan)
     - 3-tier agent commission cashback: Level 1 (15%), Level 2 (3%), Level 3 (1%)
     - Settlement: Daily Income, Daily Withdrawal
     - Withdrawal limits: ₹150 - ₹10,000
     - Direct referral welfare bonus: 10% direct reward
     - Unlimited 24/7 withdrawals
3. **Recharge Flow (`/recharge`):**
   - Quick amount chips for all primary plan tiers (₹249, ₹290, ₹599, ₹700, ₹1,100, ₹1,899, ₹1,999, ₹2,599, ₹3,199).
   - Channel selector for PAY-A (UPI FastPay) and PAY-B (Gateway & QR).
   - Instant simulated wallet crediting with in-app toast feedback.
4. **Withdrawal Flow (`/withdraw`):**
   - Validates that bank details are bound; if not, offers 1-tap navigation to `/bank-details`.
   - Validates minimum ₹150 and maximum ₹10,000.
   - 0% handling fee with net settlement calculation.
   - Pushes transaction to Transaction Records with `PENDING` review status.
5. **Investment Flow (`/products` & Invest Modal):**
   - Tapping "Invest Now" displays the full yield calculation.
   - If wallet balance is insufficient, displays clear shortage amount and provides a direct "Recharge Wallet" button.
   - If balance is sufficient, confirms investment, deducts balance, and adds to active portfolio.
6. **Agent Promotion (`/team`):**
   - Direct referral code `ZCRCGIUX` with 1-tap copy button and native share sheet.
   - 3-level commission breakdown:
     - Level 1: 15% Rebate Ratio
     - Level 2: 3% Rebate Ratio
     - Level 3: 1% Rebate Ratio
   - Direct 10% cash bonus when invited referrals invest in VIP Welfare plans.
7. **Daily Rewards & Gift Vouchers (`/checkin`):**
   - 7-day attendance streak tracker with daily attendance gift.
   - Official voucher redemption with pre-configured codes: `PEARL2026` (₹150), `VIPBONUS` (₹200), `AGRI100` (₹100), `WELCOME50` (₹50).

---

## 6. Commands & How to Run

### Install Dependencies:
```bash
yarn install
```

### Typecheck & Diagnostics:
```bash
npx tsc --noEmit
npx expo-doctor
```

### Run Locally:
```bash
yarn web          # Open in browser (http://localhost:8081)
yarn android      # Run on Android emulator / device
yarn ios          # Run on iOS simulator / device
```

### Build Web Bundle:
```bash
npx expo export --platform web
```
All static routes are verified and bundled to `dist/`.

---

## 7. Demo Credentials

For quick evaluation:
- **Phone Number:** `7891192158`
- **Password:** `123456`
- **Initial Balance:** `₹10.00`
- **Sample Promo Codes to Test:** `PEARL2026`, `VIPBONUS`, `AGRI100`, `WELCOME50`
