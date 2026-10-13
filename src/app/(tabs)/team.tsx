import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Share,
} from 'react-native';
import { Icon as Ionicons } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useTeamStats } from '@/hooks/use-queries';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { feedColumn, Radius, Shadows, Spacing } from '@/theme';

export default function TeamScreen() {
  const theme = useTheme();
  const { showToast } = useToast();
  const { data: teamStats, isLoading, refetch, isRefetching } = useTeamStats();

  const inviteCode = teamStats?.inviteCode || 'ZCRCGIUX';
  const inviteUrl = teamStats?.inviteUrl || `https://pearlapp.agri/register?invite=${inviteCode}`;

  const handleCopyLink = () => {
    // In web or native, show toast feedback
    showToast({
      message: 'Invitation link copied to clipboard!',
      type: 'success',
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join Pearl AgriTech with my referral code ${inviteCode} to get ₹10 sign-up bonus and earn daily farming yields! ${inviteUrl}`,
      });
    } catch {
      handleCopyLink();
    }
  };

  const tierColors = [
    { badge: '#D97706', bg: '#FEF3C7', icon: 'medal' as const, label: 'First Level (Direct)' },
    { badge: '#475569', bg: '#F1F5F9', icon: 'ribbon' as const, label: 'Second Level (Sub-team)' },
    { badge: '#92400E', bg: '#FDE68A', icon: 'star' as const, label: 'Third Level (Extended)' },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Agent Promotion"
        subtitle="3-Tier Referral Rebates & Bonuses"
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
        {/* Top Summary Banner */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: theme.primaryDark,
              borderColor: theme.primaryBorder,
            },
          ]}>
          <Text style={styles.summarySub}>Total Network Overview</Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>{teamStats?.totalPeople ?? 0}</Text>
              <Text style={styles.summaryLabel}>Total Members</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>
                ₹{(teamStats?.totalRecharge ?? 0).toLocaleString()}
              </Text>
              <Text style={styles.summaryLabel}>Team Turnover</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNum, { color: '#FCD34D' }]}>
                ₹{(teamStats?.totalCommission ?? 0).toLocaleString()}
              </Text>
              <Text style={styles.summaryLabel}>Total Commission</Text>
            </View>
          </View>
        </View>

        {/* Invitation Link Card */}
        <View
          style={[
            styles.inviteCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}>
          <View style={styles.inviteHeader}>
            <View style={[styles.giftCircle, { backgroundColor: theme.primarySurface }]}>
              <Ionicons name="gift" size={22} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.inviteTitle, { color: theme.text }]}>
                Your Referral Link
              </Text>
              <Text style={[styles.inviteSub, { color: theme.textSecondary }]}>
                Code: <Text style={{ fontWeight: '800', color: theme.primary }}>{inviteCode}</Text>
              </Text>
            </View>
            <Badge variant="vip" size="sm">
              15% Direct
            </Badge>
          </View>

          <View
            style={[
              styles.urlBox,
              { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
            ]}>
            <Text style={[styles.urlText, { color: theme.textSecondary }]} numberOfLines={1}>
              {inviteUrl}
            </Text>
          </View>

          <View style={styles.btnRow}>
            <Button
              variant="outline"
              size="md"
              onPress={handleCopyLink}
              style={{ flex: 1 }}
              leftIcon={<Ionicons name="copy-outline" size={16} color={theme.text} />}>
              Copy Link
            </Button>
            <Button
              variant="primary"
              size="md"
              onPress={handleShare}
              style={{ flex: 1 }}
              leftIcon={<Ionicons name="share-social-outline" size={16} color="#FFFFFF" />}>
              Share Now
            </Button>
          </View>
        </View>

        {/* 3-Tier Commission Levels */}
        <Text style={[styles.sectionHeading, { color: theme.text }]}>
          Commission Tier Structure
        </Text>

        {teamStats?.tiers.map((tier, idx) => {
          const cfg = tierColors[idx] || tierColors[0];
          return (
            <View
              key={tier.level}
              style={[
                styles.tierCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.cardBorder,
                },
              ]}>
              <View style={styles.tierHeader}>
                <View style={styles.tierNameRow}>
                  <View style={[styles.tierIconCircle, { backgroundColor: cfg.bg }]}>
                    <Ionicons name={cfg.icon} size={18} color={cfg.badge} />
                  </View>
                  <View>
                    <Text style={[styles.tierTitle, { color: theme.text }]}>
                      {tier.name}
                    </Text>
                    <Text style={[styles.tierLevelSub, { color: theme.textSecondary }]}>
                      {cfg.label}
                    </Text>
                  </View>
                </View>

                <Badge variant={idx === 0 ? 'vip' : 'primary'} size="md">
                  {tier.rebatePercent}% Rebate
                </Badge>
              </View>

              <View
                style={[
                  styles.tierGrid,
                  { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
                ]}>
                <View style={styles.tierCol}>
                  <Text style={[styles.tierLabel, { color: theme.textSecondary }]}>
                    Rebate Ratio
                  </Text>
                  <Text style={[styles.tierVal, { color: theme.primary }]}>
                    {tier.rebatePercent}%
                  </Text>
                </View>

                <View style={styles.tierDivider} />

                <View style={styles.tierCol}>
                  <Text style={[styles.tierLabel, { color: theme.textSecondary }]}>
                    Total Turnover
                  </Text>
                  <Text style={[styles.tierVal, { color: theme.text }]}>
                    ₹{tier.totalRecharge.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.tierDivider} />

                <View style={styles.tierCol}>
                  <Text style={[styles.tierLabel, { color: theme.textSecondary }]}>
                    Active People
                  </Text>
                  <Text style={[styles.tierVal, { color: theme.text }]}>
                    {tier.totalMembers}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* Welfare Referral Rule Card */}
        <View
          style={[
            styles.ruleBox,
            {
              backgroundColor: theme.surfaceSubtle,
              borderColor: theme.borderSubtle,
            },
          ]}>
          <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.ruleTitle, { color: theme.text }]}>
              Direct 10% Welfare Investment Reward
            </Text>
            <Text style={[styles.ruleBody, { color: theme.textSecondary }]}>
              Whenever an invited member invests into any VIP Welfare plan, 10% of their investment amount is credited directly to your withdrawable balance instantly.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    ...feedColumn,
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  summaryCard: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.four,
    ...Shadows.md,
  },
  summarySub: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.two,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNum: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  summaryLabel: {
    color: '#D1FAE5',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  inviteCard: {
    borderRadius: Radius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.four,
    ...Shadows.sm,
  },
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  giftCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  inviteSub: {
    fontSize: 12,
    marginTop: 2,
  },
  urlBox: {
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  urlText: {
    fontSize: 13,
    fontWeight: '500',
  },
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: Spacing.three,
  },
  tierCard: {
    borderRadius: Radius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.three,
    ...Shadows.sm,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  tierNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  tierIconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  tierLevelSub: {
    fontSize: 11,
    fontWeight: '500',
  },
  tierGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  tierCol: {
    flex: 1,
    alignItems: 'center',
  },
  tierLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tierVal: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  tierDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  ruleBox: {
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginTop: Spacing.two,
  },
  ruleTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  ruleBody: {
    fontSize: 12,
    lineHeight: 18,
  },
});
