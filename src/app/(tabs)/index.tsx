import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { useUserProfile, usePlans } from '@/hooks/use-queries';
import { BalanceCard } from '@/components/home/balance-card';
import { QuickActions } from '@/components/home/quick-actions';
import { LiveTicker } from '@/components/home/live-ticker';
import { BannerCarousel } from '@/components/home/banner-carousel';
import { PlanCard, PlanList } from '@/components/plans/plan-card';
import { AnnouncementModal } from '@/components/ui/announcement-modal';
import { InvestModal } from '@/components/ui/invest-modal';
import { PlanCardSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorView } from '@/components/ui/error-view';
import { Plan } from '@/types';
import { feedColumn, Radius, Shadows, Spacing } from '@/theme';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [announcementVisible, setAnnouncementVisible] = useState(false);
  const [selectedPlanForInvest, setSelectedPlanForInvest] = useState<Plan | null>(null);

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
    refetch: refetchUser,
  } = useUserProfile();

  const {
    data: plans,
    isLoading: plansLoading,
    isError: plansError,
    refetch: refetchPlans,
  } = usePlans('all');

  const isRefreshing = userLoading || plansLoading;

  const handleRefresh = () => {
    refetchUser();
    refetchPlans();
  };

  const handleOpenWhatsApp = () => {
    Linking.openURL('https://api.whatsapp.com/send?phone=919876543210').catch(() => {});
  };

  // Featured plan (Subscription VIP 1 or Subscription 1)
  const featuredPlan = plans?.find((p) => p.isPopular) || plans?.[0];
  const regularPreviewPlans = plans?.filter((p) => p.category === 'regular').slice(0, 3) || [];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      {/* Top App Bar */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 14 : 10),
            backgroundColor: theme.surface,
            borderBottomColor: theme.cardBorder,
          },
        ]}>
        <View style={styles.topBarInner}>
        <View style={styles.brandRow}>
          <View style={[styles.brandIconCircle, { backgroundColor: theme.primary }]}>
            <Icon name="sprout" size={20} color={theme.textInverse} />
          </View>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={[styles.brandTitle, { color: theme.text }]}>Pearl AgriTech</Text>
              <Icon name="check-decagram" size={16} color={theme.primary} />
            </View>
            <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
              Yield & Agro-Finance
            </Text>
          </View>
        </View>

        <View style={styles.topRightActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/support')}
            style={[styles.headerIconBtn, { backgroundColor: theme.surfaceSubtle }]}>
            <Icon name="lifebuoy" size={19} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setAnnouncementVisible(true)}
            style={[styles.headerIconBtn, { backgroundColor: theme.surfaceSubtle }]}>
            <Icon name="bell-badge-outline" size={19} color={theme.text} />
            <View style={[styles.unreadDot, { backgroundColor: theme.danger }]} />
          </TouchableOpacity>
        </View>
        </View>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }>
        {/* User Balance Card */}
        <BalanceCard user={user} isLoading={userLoading} />

        {/* Quick Navigation Action Grid (CheckIn, Invite, Recharge, Withdraw) */}
        <QuickActions />

        {/* Live Withdrawal Proof Ticker */}
        <LiveTicker />

        {/* High-Tech Agriculture Banner */}
        <BannerCarousel />

        {/* Special Featured Plan Section */}
        {featuredPlan ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Icon name="crown-outline" size={18} color={theme.vip} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Special Plan of the Day
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/products')}>
                <Text style={[styles.seeAllText, { color: theme.primary }]}>View All →</Text>
              </TouchableOpacity>
            </View>

            <PlanCard
              plan={featuredPlan}
              onInvest={(p) => setSelectedPlanForInvest(p)}
              featured
            />
          </View>
        ) : null}

        {/* Regular Yield Opportunities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Icon name="sprout" size={18} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Daily Income Projects
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/products')}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>Explore (9) →</Text>
            </TouchableOpacity>
          </View>

          {plansLoading ? (
            <>
              <PlanCardSkeleton />
              <PlanCardSkeleton />
            </>
          ) : plansError ? (
            <ErrorView
              title="Failed to load subscriptions"
              message="Could not load subscription plans. Tap to retry."
              onRetry={refetchPlans}
            />
          ) : (
            <PlanList
              plans={regularPreviewPlans}
              onInvest={(p) => setSelectedPlanForInvest(p)}
            />
          )}
        </View>
      </ScrollView>

      {/* Floating WhatsApp Support Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleOpenWhatsApp}
        style={[styles.floatingWhatsApp, { backgroundColor: '#25D366' }]}>
        <Icon name="whatsapp" size={28} color={theme.textInverse} />
      </TouchableOpacity>

      {/* Announcement Modal Popup */}
      <AnnouncementModal
        visible={announcementVisible}
        onClose={() => setAnnouncementVisible(false)}
      />

      {/* Investment Confirmation Modal */}
      <InvestModal
        plan={selectedPlanForInvest}
        user={user}
        visible={!!selectedPlanForInvest}
        onClose={() => setSelectedPlanForInvest(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  topBarInner: {
    ...feedColumn,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  brandIconCircle: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  scrollContent: {
    ...feedColumn,
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  section: {
    marginBottom: Spacing.four,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  floatingWhatsApp: {
    position: 'absolute',
    bottom: 18,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
    zIndex: 99,
  },
});
