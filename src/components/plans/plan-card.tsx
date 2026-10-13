import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Plan } from '@/types';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Radius, Shadows, Spacing } from '@/theme';

interface PlanCardProps {
  plan: Plan;
  onInvest: (plan: Plan) => void;
  featured?: boolean;
}

export function PlanCard({ plan, onInvest, featured = false }: PlanCardProps) {
  const theme = useTheme();
  const isVip = plan.category === 'vip';

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
      {/* Top Header */}
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
          <Text style={[styles.planSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
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
          <Ionicons
            name="time-outline"
            size={13}
            color={isVip ? theme.vipDark : theme.primary}
          />
          <Text
            style={[
              styles.daysText,
              { color: isVip ? theme.vipDark : theme.primary },
            ]}>
            {plan.time} Days
          </Text>
        </View>
      </View>

      {/* Financial Details Matrix */}
      <View
        style={[
          styles.matrix,
          {
            backgroundColor: theme.surfaceSubtle,
            borderColor: theme.borderSubtle,
          },
        ]}>
        <View style={styles.matrixCol}>
          <Text style={[styles.matrixLabel, { color: theme.textSecondary }]}>Daily Profit</Text>
          <Text style={[styles.matrixVal, { color: theme.primary }]}>
            ₹{plan.dailyIncome.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.matrixDivider, { backgroundColor: theme.borderSubtle }]} />

        <View style={styles.matrixCol}>
          <Text style={[styles.matrixLabel, { color: theme.textSecondary }]}>Total Income</Text>
          <Text style={[styles.matrixVal, { color: isVip ? theme.vip : theme.text }]}>
            ₹{plan.totalIncome.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.matrixDivider, { backgroundColor: theme.borderSubtle }]} />

        <View style={styles.matrixCol}>
          <Text style={[styles.matrixLabel, { color: theme.textSecondary }]}>Net Return</Text>
          <Text style={[styles.roiText, { color: theme.success }]}>
            +{plan.roiPercentage}%
          </Text>
        </View>
      </View>

      {/* Footer: Price tag & Invest button */}
      <View style={styles.footer}>
        <View>
          <Text style={[styles.pricePrefix, { color: theme.textSecondary }]}>Price</Text>
          <Text style={[styles.priceValue, { color: theme.text }]}>
            ₹{plan.price.toLocaleString()}
          </Text>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            variant={isVip ? 'vip' : 'primary'}
            size="md"
            onPress={() => onInvest(plan)}
            rightIcon={<Ionicons name="arrow-forward" size={16} color="#FFFFFF" />}>
            Invest Now
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    ...Shadows.sm,
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
    padding: Spacing.three,
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
    fontSize: 15,
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
    width: 140,
  },
});
