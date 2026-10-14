import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { Plan } from '@/types';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { FAMILY_LABEL, PLAN_IMAGES } from '@/components/plans/plan-images';
import { Radius, Shadows, Spacing } from '@/theme';

interface PlanCardProps {
  plan: Plan;
  onInvest: (plan: Plan) => void;
  featured?: boolean;
}

const FAMILY_COLOR = {
  land: 'primary',
  instrument: 'accent',
  dairy: 'vip',
} as const;

export function PlanCard({ plan, onInvest, featured = false }: PlanCardProps) {
  const theme = useTheme();
  const isVip = plan.category === 'vip';
  const tone = theme[FAMILY_COLOR[plan.family]];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: isVip
            ? theme.vipBorder
            : featured
              ? theme.primaryBorder
              : theme.cardBorder,
          borderWidth: isVip || featured ? 1.5 : 1,
        },
        featured ? Shadows.md : Shadows.sm,
      ]}>
      {/* Clean Image Header */}
      <View style={[styles.heroWrap, { backgroundColor: theme.backgroundElement }]}>
        <Image
          source={PLAN_IMAGES[plan.imageKey]}
          style={styles.hero}
          contentFit="cover"
          transition={200}
        />

        {/* Top-left category chip */}
        <View style={[styles.familyChip, { backgroundColor: 'rgba(15, 23, 42, 0.76)' }]}>
          <View style={[styles.familyDot, { backgroundColor: tone }]} />
          <Text style={styles.familyText}>{FAMILY_LABEL[plan.family]}</Text>
        </View>

        {/* Top-right duration pill */}
        <View style={[styles.daysChip, { backgroundColor: 'rgba(15, 23, 42, 0.76)' }]}>
          <Icon name="time-outline" size={12} color="#FFFFFF" />
          <Text style={styles.daysText}>{plan.time} Days</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Title & Single Badge */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.planTitle, { color: theme.text }]} numberOfLines={1}>
              {plan.title}
            </Text>
            {isVip ? (
              <Badge variant="vip" size="sm">
                VIP
              </Badge>
            ) : plan.isPopular ? (
              <Badge variant="primary" size="sm">
                Popular
              </Badge>
            ) : null}
          </View>
          <Text style={[styles.planSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
            {plan.subtitle}
          </Text>
        </View>

        {/* Simple 3-Column Metrics Box: Price • Daily • Total */}
        <View
          style={[
            styles.metricsBox,
            {
              backgroundColor: theme.surfaceSubtle,
              borderColor: theme.borderSubtle,
            },
          ]}>
          <View style={styles.metricCol}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Price</Text>
            <Text style={[styles.metricVal, { color: theme.text }]}>
              ₹{plan.price.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />

          <View style={styles.metricCol}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Daily</Text>
            <Text style={[styles.metricVal, { color: theme.primary }]}>
              ₹{plan.dailyIncome.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />

          <View style={styles.metricCol}>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Total</Text>
            <Text style={[styles.metricVal, { color: isVip ? theme.vip : theme.text }]}>
              ₹{plan.totalIncome.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* Clean Action Button */}
        <Button
          variant={isVip ? 'vip' : 'primary'}
          size="md"
          fullWidth
          onPress={() => onInvest(plan)}
          rightIcon={<Icon name="arrow-forward" size={16} color="#FFFFFF" />}>
          {`Invest Now • +${plan.roiPercentage}% ROI`}
        </Button>
      </View>
    </View>
  );
}

export function PlanList({
  plans,
  onInvest,
  featuredId,
}: {
  plans: Plan[];
  onInvest: (plan: Plan) => void;
  featuredId?: string;
}) {
  const { width } = useWindowDimensions();
  const cols = width >= 1200 ? 3 : width >= 720 ? 2 : 1;

  return (
    <View style={[styles.list, cols > 1 && styles.listGrid]}>
      {plans.map((plan) => (
        <View
          key={plan.id}
          style={
            cols === 3
              ? styles.listItemThree
              : cols === 2
                ? styles.listItemTwo
                : styles.listItemOne
          }>
          <PlanCard
            plan={plan}
            featured={plan.id === featuredId}
            onInvest={onInvest}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    marginBottom: Spacing.three,
    overflow: 'hidden',
  },
  heroWrap: {
    height: 148,
    position: 'relative',
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  familyChip: {
    position: 'absolute',
    left: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
  },
  familyDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  familyText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  daysChip: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
  },
  daysText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    padding: Spacing.three,
  },
  header: {
    marginBottom: Spacing.two + 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  planTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  planSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3,
  },
  metricsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
  },
  list: {
    width: '100%',
  },
  listGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  listItemOne: {
    width: '100%',
  },
  listItemTwo: {
    width: '50%',
    paddingHorizontal: 8,
  },
  listItemThree: {
    width: '33.3333%',
    paddingHorizontal: 8,
  },
});
