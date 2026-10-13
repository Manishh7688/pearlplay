import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { Plan } from '@/types';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { FAMILY_LABEL, PLAN_IMAGES } from '@/components/plans/plan-images';
import { Layout, Radius, Shadows, Spacing } from '@/theme';

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
          borderColor: isVip ? theme.vipBorder : featured ? theme.primaryBorder : theme.cardBorder,
          borderWidth: isVip || featured ? 1.5 : 1,
        },
        featured && Shadows.md,
      ]}>
      <View style={styles.heroWrap}>
        <Image
          source={PLAN_IMAGES[plan.imageKey]}
          style={styles.hero}
          contentFit="cover"
          transition={200}
        />
        <View style={[styles.familyChip, { backgroundColor: 'rgba(255,252,248,0.94)' }]}>
          <View style={[styles.familyDot, { backgroundColor: tone }]} />
          <Text style={[styles.familyText, { color: theme.text }]}>{FAMILY_LABEL[plan.family]}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.header}>
          <View style={styles.titleArea}>
            <View style={styles.badgeRow}>
              <Badge variant={isVip ? 'vip' : 'primary'} size="sm">
                {plan.subscription}
              </Badge>
              {plan.isPopular ? (
                <Badge variant="warning" size="sm">
                  Most Popular
                </Badge>
              ) : null}
              {plan.badge && !plan.isPopular ? (
                <Badge variant="neutral" size="sm">
                  {plan.badge}
                </Badge>
              ) : null}
            </View>
            <Text style={[styles.planTitle, { color: theme.text }]}>{plan.title}</Text>
            <Text style={[styles.planSubtitle, { color: theme.textSecondary }]} numberOfLines={2}>
              {plan.subtitle}
            </Text>
          </View>

          <View
            style={[
              styles.daysChip,
              {
                backgroundColor: isVip ? theme.vipLight : theme.primarySurface,
                borderColor: isVip ? theme.vipBorder : theme.primaryBorder,
              },
            ]}>
            <Icon name="time-outline" size={13} color={isVip ? theme.vipDark : theme.primary} />
            <Text style={[styles.daysText, { color: isVip ? theme.vipDark : theme.primary }]}>
              {plan.time}d
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.matrix,
            {
              backgroundColor: theme.surfaceSubtle,
              borderColor: theme.borderSubtle,
            },
          ]}>
          <View style={styles.matrixCol}>
            <Text style={[styles.matrixLabel, { color: theme.textSecondary }]}>Daily</Text>
            <Text style={[styles.matrixVal, { color: theme.primary }]}>
              ₹{plan.dailyIncome.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.matrixDivider, { backgroundColor: theme.borderSubtle }]} />

          <View style={styles.matrixCol}>
            <Text style={[styles.matrixLabel, { color: theme.textSecondary }]}>Total</Text>
            <Text style={[styles.matrixVal, { color: isVip ? theme.vip : theme.text }]}>
              ₹{plan.totalIncome.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.matrixDivider, { backgroundColor: theme.borderSubtle }]} />

          <View style={styles.matrixCol}>
            <Text style={[styles.matrixLabel, { color: theme.textSecondary }]}>Return</Text>
            <Text style={[styles.roiText, { color: theme.success }]}>+{plan.roiPercentage}%</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={[styles.pricePrefix, { color: theme.textSecondary }]}>Price</Text>
            <Text style={[styles.priceValue, { color: theme.text }]}>₹{plan.price.toLocaleString()}</Text>
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              variant={isVip ? 'vip' : 'primary'}
              size="md"
              onPress={() => onInvest(plan)}
              rightIcon={<Icon name="arrow-forward" size={16} color={theme.textInverse} />}>
              Invest Now
            </Button>
          </View>
        </View>
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
  const two = width >= Layout.grid;

  return (
    <View style={[styles.list, two && styles.listGrid]}>
      {plans.map((plan) => (
        <View key={plan.id} style={two ? styles.listItem : undefined}>
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
    ...Shadows.sm,
  },
  heroWrap: {
    height: 168,
    backgroundColor: '#E7E1D6',
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
  },
  familyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  familyText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: -0.1,
  },
  body: {
    padding: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.three,
  },
  titleArea: {
    flex: 1,
    paddingRight: Spacing.two,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.one + 2,
    marginBottom: 6,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  planSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 17,
  },
  daysChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  daysText: {
    fontSize: 12,
    fontWeight: '800',
  },
  matrix: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  matrixCol: {
    flex: 1,
    alignItems: 'center',
  },
  matrixLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  matrixVal: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },
  roiText: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },
  matrixDivider: {
    width: 1,
    height: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.three,
  },
  pricePrefix: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  buttonWrapper: {
    flex: 1,
    maxWidth: 160,
  },
  list: {
    width: '100%',
  },
  listGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  listItem: {
    width: '50%',
    paddingHorizontal: 8,
  },
});
