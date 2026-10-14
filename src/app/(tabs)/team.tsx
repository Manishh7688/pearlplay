import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Share,
  useWindowDimensions,
} from 'react-native';
import { Icon as Ionicons } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useTeamStats } from '@/hooks/use-queries';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { feedColumn, Layout, Radius, Shadows, Spacing } from '@/theme';

export default function TeamScreen() {
  const theme = useTheme();
  const { showToast } = useToast();
  const { width } = useWindowDimensions();
  const isDesktop = width >= Layout.desktop;
  const { data: teamStats, refetch, isRefetching } = useTeamStats();

  const inviteCode = teamStats?.inviteCode || 'ZCRCGIUX';
  const inviteUrl = teamStats?.inviteUrl || `https://pearlapp.agri/register?invite=${inviteCode}`;

  const handleCopyLink = () => {
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
    { badge: theme.vip, bg: theme.vipLight, icon: 'medal' as const, label: 'First Level (Direct)' },
    { badge: theme.primary, bg: theme.primarySurface, icon: 'ribbon' as const, label: 'Second Level (Sub-team)' },
    { badge: theme.accent, bg: theme.accentLight, icon: 'star' as const, label: 'Third Level (Extended)' },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Partner Network"
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
        {/* Top Overview + Referral Link: 2-Column on Desktop, Stacked on Mobile */}
        <View style={[styles.topRow, isDesktop && styles.topRowDesktop]}>
          {/* Top Summary Banner */}
          <View
            style={[
              styles.summaryCard,
              isDesktop && styles.topCol,
              {
                backgroundColor: theme.hero,
                borderColor: 'rgba(167, 243, 208, 0.14)',
              },
            ]}>
            <Text style={styles.summarySub}>Total Network Overview</Text>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNum}>{teamStats?.totalPeople ?? 0}</Text>
                <Text style={styles.summaryLabel}>Members</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryNum}>
                  ₹{(teamStats?.totalRecharge ?? 0).toLocaleString('en-IN')}
                </Text>
                <Text style={styles.summaryLabel}>Turnover</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryItem}>
                <Text style={[styles.summaryNum, { color: '#FCD34D' }]}>
                  ₹{(teamStats?.totalCommission ?? 0).toLocaleString('en-IN')}
                </Text>
                <Text style={styles.summaryLabel}>Commission</Text>
              </View>
            </View>
          </View>

          {/* Invitation Link Card */}
          <View
            style={[
              styles.inviteCard,
              isDesktop && styles.topCol,
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
        </View>

        {/* 3-Tier Commission Levels */}
        <Text style={[styles.sectionHeading, { color: theme.text }]}>
          Commission Tier Structure
        </Text>

        <View style={[styles.tiersWrap, isDesktop && styles.tiersWrapDesktop]}>
          {teamStats?.tiers.map((tier, idx) => {
            const cfg = tierColors[idx] || tierColors[0];
            return (
              <View
                key={tier.level}
                style={[
                  styles.tierCard,
                  isDesktop && styles.tierCardDesktop,
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
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.tierTitle, { color: theme.text }]} numberOfLines={1}>
                        {tier.name}
                      </Text>
                      <Text style={[styles.tierLevelSub, { color: theme.textSecondary }]} numberOfLines={1}>
                        {cfg.label}
                      </Text>
                    </View>
                  </View>

                  <Badge variant={idx === 0 ? 'vip' : 'primary'} size="sm">
                    {tier.rebatePercent}%
                  </Badge>
                </View>

                <View
                  style={[
                    styles.tierGrid,
                    { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
                  ]}>
                  <View style={styles.tierCol}>
                    <Text style={[styles.tierLabel, { color: theme.textMuted }]}>Rebate</Text>
                    <Text style={[styles.tierVal, { color: theme.primary }]}>
                      {tier.rebatePercent}%
                    </Text>
                  </View>

                  <View style={[styles.tierDivider, { backgroundColor: theme.border }]} />

                  <View style={styles.tierCol}>
                    <Text style={[styles.tierLabel, { color: theme.textMuted }]}>Turnover</Text>
                    <Text style={[styles.tierVal, { color: theme.text }]}>
                      ₹{tier.totalRecharge.toFixed(0)}
                    </Text>
                  </View>

                  <View style={[styles.tierDivider, { backgroundColor: theme.border }]} />

                  <View style={styles.tierCol}>
                    <Text style={[styles.tierLabel, { color: theme.textMuted }]}>Members</Text>
                    <Text style={[styles.tierVal, { color: theme.text }]}>
                      {tier.totalMembers}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Welfare Referral Rule Card */}
        <View
          style={[
            styles.ruleBox,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
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
  topRow: {
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  topRowDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  topCol: {
    flex: 1,
    marginBottom: 0,
  },
  summaryCard: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    justifyContent: 'center',
    ...Shadows.md,
  },
  summarySub: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.three,
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
    fontSize: 22,
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
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
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
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: Spacing.three,
  },
  tiersWrap: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  tiersWrapDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  tierCard: {
    borderRadius: Radius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    ...Shadows.sm,
  },
  tierCardDesktop: {
    flex: 1,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.three,
  },
  tierNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
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
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  tierCol: {
    flex: 1,
    alignItems: 'center',
  },
  tierLabel: {
    fontSize: 10,
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
  },
  ruleBox: {
    flexDirection: 'row',
    gap: Spacing.two + 2,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
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
