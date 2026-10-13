import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Text,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { usePlans, useUserProfile } from '@/hooks/use-queries';
import { ScreenHeader } from '@/components/ui/screen-header';
import { PlanCard } from '@/components/plans/plan-card';
import {
  PlanFilterCategory,
  PlanFilterTabs,
} from '@/components/plans/plan-filter-tabs';
import { InvestModal } from '@/components/ui/invest-modal';
import { PlanCardSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorView } from '@/components/ui/error-view';
import { Plan } from '@/types';
import { Spacing } from '@/theme';

export default function ProductsScreen() {
  const theme = useTheme();
  const [category, setCategory] = useState<PlanFilterCategory>('all');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const { data: user } = useUserProfile();
  const {
    data: plans,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = usePlans(category);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Agro-Yield Plans"
        subtitle="Daily Income & VIP Welfare Subscriptions"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 90 }]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }>
        {/* Category switcher */}
        <PlanFilterTabs selected={category} onSelect={setCategory} />

        {/* Informative notice banner */}
        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: theme.primarySurface,
              borderColor: theme.primaryBorder,
            },
          ]}>
          <Text style={[styles.infoText, { color: theme.primaryDark }]}>
            💡 All plans generate daily income credited every 24 hours. Withdrawals are unlimited starting from ₹150 with 0% fee.
          </Text>
        </View>

        {/* Loading Skeletons */}
        {isLoading ? (
          <>
            <PlanCardSkeleton />
            <PlanCardSkeleton />
            <PlanCardSkeleton />
          </>
        ) : isError ? (
          <ErrorView
            title="Failed to Load Plans"
            message="Could not connect to subscription catalog. Please retry."
            onRetry={() => refetch()}
          />
        ) : (
          plans?.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onInvest={(p) => setSelectedPlan(p)}
            />
          ))
        )}
      </ScrollView>

      {/* Investment Modal */}
      <InvestModal
        plan={selectedPlan}
        user={user}
        visible={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
  },
  infoBox: {
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
});
