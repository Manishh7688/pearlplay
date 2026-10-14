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
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useThemeMode } from '@/hooks/use-theme';
import { useUserProfile, usePlans } from '@/hooks/use-queries';
import { BalanceCard } from '@/components/home/balance-card';
import { QuickActions } from '@/components/home/quick-actions';
import { BannerCarousel } from '@/components/home/banner-carousel';
import { PlanCard } from '@/components/plans/plan-card';
import { MultiUserPayoutFeed } from '@/components/home/multi-user-payout-feed';
import { AnnouncementModal } from '@/components/ui/announcement-modal';
import { InvestModal } from '@/components/ui/invest-modal';
import { PlanCardSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorView } from '@/components/ui/error-view';
import { Plan } from '@/types';
import { feedColumn, Layout, Radius, Shadows, Spacing } from '@/theme';

export default function HomeScreen() {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWideWeb = width >= Layout.desktop;

  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [selectedPlanForInvest, setSelectedPlanForInvest] = useState<Plan | null>(null);

  const {
    data: user,
    isLoading: userLoading,
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

  // Find the first lowest/minimum entry plan (Subscription 1: Pearl Eco-Hydroponics I, ₹249)
  const minPlan =
    plans && plans.length > 0
      ? plans.reduce((min, p) => (p.price < min.price ? p : min), plans[0])
      : null;

  const firstName = user?.username ? user.username.split(' ')[0] : 'Investor';

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      {/* Clean Top App Bar */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 14 : 10),
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
        ]}>
        <View style={styles.topBarInner}>
          {/* Clickable Brand Row navigating to Home / Root */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.replace('/')}
            style={styles.brandRow}>
            <View style={[styles.brandIconCircle, { backgroundColor: theme.primary }]}>
              <Icon name="sprout" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.brandTextWrap}>
              <View style={styles.brandTitleRow}>
                <Text style={[styles.brandTitle, { color: theme.text }]} numberOfLines={1}>
                  Pearl AgriTech
                </Text>
                <Icon name="check-decagram" size={15} color={theme.primary} />
              </View>
              <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                Hello, {firstName}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.topRightActions}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={toggleTheme}
              accessibilityLabel="Toggle color theme"
              style={[
                styles.headerIconBtn,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.border,
                },
              ]}>
              <Icon
                name={mode === 'dark' ? 'weather-sunny' : 'weather-night'}
                size={18}
                color={mode === 'dark' ? theme.warning : theme.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/support')}
              style={[
                styles.headerIconBtn,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.border,
                },
              ]}>
              <Icon name="lifebuoy" size={18} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setAnnouncementVisible(true)}
              style={[
                styles.headerIconBtn,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.border,
                },
              ]}>
              <Icon name="bell-badge-outline" size={18} color={theme.text} />
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
        {/* Responsive Hero Section: 2-Column on Desktop Web, Stacked on Mobile */}
        {isWideWeb ? (
          <View style={styles.desktopHeroGrid}>
            <View style={styles.desktopHeroCol}>
              <BalanceCard user={user} isLoading={userLoading} />
              <QuickActions />
            </View>
            <View style={styles.desktopHeroCol}>
              <BannerCarousel />
            </View>
          </View>
        ) : (
          <View style={styles.mobileHeroStack}>
            <BalanceCard user={user} isLoading={userLoading} />
            <QuickActions />
            <BannerCarousel />
          </View>
        )}

        {/* Minimum Entry Plan Spotlight */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Featured Starter Plan
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                Lowest entry agro-yield investment project
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/products')}
              style={[styles.seeAllPill, { backgroundColor: theme.primarySurface }]}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>View All Plans (9)</Text>
              <Icon name="arrow-right" size={14} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {plansLoading ? (
            <PlanCardSkeleton />
          ) : plansError ? (
            <ErrorView
              title="Failed to load subscription"
              message="Could not load the featured starter plan. Tap to retry."
              onRetry={refetchPlans}
            />
          ) : minPlan ? (
            <PlanCard
              plan={minPlan}
              featured
              onInvest={(p) => setSelectedPlanForInvest(p)}
            />
          ) : null}
        </View>

        {/* Multi-User Real-Time Payout Feed */}
        <MultiUserPayoutFeed />
      </ScrollView>

      {/* Floating WhatsApp Support Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleOpenWhatsApp}
        style={[styles.floatingWhatsApp, { backgroundColor: '#10B981' }]}>
        <Icon name="whatsapp" size={26} color="#FFFFFF" />
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  topBarInner: {
    ...feedColumn,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  brandIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTextWrap: {
    flex: 1,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
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
  desktopHeroGrid: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.four,
    marginBottom: Spacing.four,
  },
  desktopHeroCol: {
    flex: 1,
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  mobileHeroStack: {
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  section: {
    marginBottom: Spacing.two,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
    gap: 8,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  seeAllPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  floatingWhatsApp: {
    position: 'absolute',
    bottom: 20,
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
