import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Icon as Ionicons } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useUserProfile } from '@/hooks/use-queries';
import { useResetDemoMutation } from '@/hooks/use-mutations';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { feedColumn, Radius, Shadows, Spacing } from '@/theme';

interface ProfileMenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  color: string;
  route?: string;
  action?: () => void;
}

interface ProfileMenuGroup {
  title: string;
  items: ProfileMenuItem[];
}

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const { data: user, isLoading, refetch, isRefetching } = useUserProfile();
  const resetDemo = useResetDemoMutation();

  const handleAppDownload = () => {
    if (Platform.OS === 'web') {
      const anchor = document.createElement('a');
      anchor.href = '/PearlAgriTech.apk';
      anchor.download = 'PearlAgriTech.apk';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      showToast({ message: 'Downloading PearlAgriTech.apk', type: 'success' });
      return;
    }
    showToast({
      message: 'Open Pearl AgriTech in a browser, then use Account → Installation to download the APK.',
      type: 'info',
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Account Management',
      'Would you like to switch user or reset demo data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Demo Data',
          style: 'destructive',
          onPress: () => {
            resetDemo.mutate(undefined, {
              onSuccess: () => {
                showToast({ message: 'Demo data reset to default (₹10 balance)', type: 'info' });
              },
            });
          },
        },
        {
          text: 'Log In / Switch',
          onPress: () => router.push('/login' as any),
        },
      ]
    );
  };

  const menuSections: ProfileMenuGroup[] = [
    {
      title: 'Finance & Records',
      items: [
        {
          id: 'bank',
          title: 'Bank Account Binding',
          subtitle: 'Required for bank withdrawals',
          icon: 'bank-outline',
          color: theme.primary,
          route: '/bank-details',
        },
        {
          id: 'income',
          title: 'Income & Investment Orders',
          subtitle: 'Track active plans & daily yields',
          icon: 'chart-timeline-variant',
          color: '#10B981',
          route: '/records',
        },
        {
          id: 'withdraw-records',
          title: 'Withdrawal History',
          subtitle: 'View status of your withdrawals',
          icon: 'receipt-text',
          color: '#2563EB',
          route: '/records',
        },
        {
          id: 'redeem',
          title: 'Daily Rewards & Gift Voucher',
          subtitle: 'Claim attendance and promo codes',
          icon: 'ticket-percent',
          color: '#D97706',
          route: '/checkin',
        },
      ],
    },
    {
      title: 'Company & Support',
      items: [
        {
          id: 'about',
          title: 'About Pearl AgriTech',
          subtitle: 'Smart agriculture infrastructure',
          icon: 'barn',
          color: theme.primary,
          route: '/about',
        },
        {
          id: 'support',
          title: 'Customer Care & Official Telegram',
          subtitle: '24/7 Telegram & WhatsApp support',
          icon: 'message-badge',
          color: '#0284C7',
          route: '/support',
        },
        {
          id: 'download',
          title: 'Pearl AgriTech Installation',
          subtitle: 'Download PearlAgriTech.apk',
          icon: 'cellphone-arrow-down',
          color: theme.textSecondary,
          action: handleAppDownload,
        },
      ],
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Account"
        subtitle="Account & Portfolio Overview"
        rightAction={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/support' as any)}
            style={[styles.headIcon, { backgroundColor: theme.surfaceSubtle }]}>
            <Ionicons name="headset-outline" size={18} color={theme.text} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }>
        {/* User Profile Card */}
        <View
          style={[
            styles.userCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}>
          <View style={styles.userInfoRow}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <Ionicons name="person" size={26} color="#FFFFFF" />
            </View>

            <View style={styles.userTextCol}>
              <View style={styles.nameRow}>
                <Text style={[styles.userName, { color: theme.text }]}>
                  {user?.username || 'Manish'}
                </Text>
                <Badge variant="primary" size="sm">
                  Verified
                </Badge>
              </View>
              <Text style={[styles.userPhone, { color: theme.textSecondary }]}>
                +91 {user?.phone || '7891192158'}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/login' as any)}
              style={[styles.switchBtn, { backgroundColor: theme.surfaceSubtle }]}>
              <Ionicons name="swap-horizontal" size={18} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Account Balance Box */}
          <View
            style={[
              styles.balanceBox,
              {
                backgroundColor: theme.primaryDark,
                borderColor: theme.primaryBorder,
              },
            ]}>
            <View>
              <Text style={styles.balanceLabel}>Account Balance</Text>
              <Text style={styles.balanceVal}>
                ₹{(user?.balance ?? 0).toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/recharge' as any)}
              style={styles.rechargeNowBtn}>
              <Ionicons name="flash" size={16} color="#FFFFFF" />
              <Text style={styles.rechargeNowText}>Recharge</Text>
            </TouchableOpacity>
          </View>

          {/* Mini Stats: Recharge, Withdraw, Welfare */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={[styles.statNum, { color: theme.text }]}>
                ₹{(user?.totalRecharge ?? 0).toLocaleString()}
              </Text>
              <Text style={[styles.statTitle, { color: theme.textSecondary }]}>
                Recharge
              </Text>
            </View>

            <View style={[styles.statDiv, { backgroundColor: theme.borderSubtle }]} />

            <View style={styles.statCol}>
              <Text style={[styles.statNum, { color: theme.text }]}>
                ₹{(user?.totalWithdraw ?? 0).toLocaleString()}
              </Text>
              <Text style={[styles.statTitle, { color: theme.textSecondary }]}>
                Withdraw
              </Text>
            </View>

            <View style={[styles.statDiv, { backgroundColor: theme.borderSubtle }]} />

            <View style={styles.statCol}>
              <Text style={[styles.statNum, { color: theme.vip }]}>
                ₹{(user?.totalWelfare ?? 0).toLocaleString()}
              </Text>
              <Text style={[styles.statTitle, { color: theme.textSecondary }]}>
                Welfare
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((sec) => (
          <View key={sec.title} style={styles.menuGroup}>
            <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>
              {sec.title}
            </Text>

            <View
              style={[
                styles.menuCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.cardBorder,
                },
              ]}>
              {sec.items.map((item, idx) => {
                const isLast = idx === sec.items.length - 1;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (item.action) {
                        item.action();
                      } else if (item.route) {
                        router.push(item.route as any);
                      }
                    }}
                    style={[
                      styles.menuItem,
                      !isLast && { borderBottomWidth: 1, borderBottomColor: theme.borderSubtle },
                    ]}>
                    <View style={[styles.menuIconCircle, { backgroundColor: theme.surfaceSubtle }]}>
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>

                    <View style={styles.menuTextWrap}>
                      <Text style={[styles.menuTitle, { color: theme.text }]}>
                        {item.title}
                      </Text>
                      {item.subtitle ? (
                        <Text style={[styles.menuSub, { color: theme.textSecondary }]}>
                          {item.subtitle}
                        </Text>
                      ) : null}
                    </View>

                    <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Logout / Exit App Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={[styles.logoutBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="log-out-outline" size={18} color={theme.danger} />
          <Text style={[styles.logoutText, { color: theme.danger }]}>
            Exit App / Switch Account
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    ...feedColumn,
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  userCard: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.four,
    ...Shadows.sm,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTextCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  userPhone: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  switchBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceBox: {
    borderRadius: Radius.lg,
    padding: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  balanceLabel: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  balanceVal: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  rechargeNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
  },
  rechargeNowText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.two,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 15,
    fontWeight: '800',
  },
  statTitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  statDiv: {
    width: 1,
    height: 22,
  },
  menuGroup: {
    marginBottom: Spacing.four,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.two,
    marginLeft: 4,
  },
  menuCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  menuTextWrap: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  menuSub: {
    fontSize: 12,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
