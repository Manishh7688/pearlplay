import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Icon as Ionicons } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useTransactions } from '@/hooks/use-queries';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { ErrorView } from '@/components/ui/error-view';
import { EmptyView } from '@/components/ui/empty-view';
import { RecordType, TransactionRecord } from '@/types';
import { Radius, Shadows, Spacing } from '@/theme';

export default function RecordsScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ tab?: string }>();

  const [activeTab, setActiveTab] = useState<RecordType | 'all'>(
    (params.tab as RecordType) || 'all'
  );

  const {
    data: transactions,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useTransactions(activeTab);

  const tabs: { id: RecordType | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'income', label: 'Investments' },
    { id: 'recharge', label: 'Recharge' },
    { id: 'withdraw', label: 'Withdraw' },
  ];

  const getRecordStyle = (rec: TransactionRecord) => {
    switch (rec.type) {
      case 'recharge':
        return {
          icon: 'add-circle' as const,
          color: theme.primary,
          bg: theme.primarySurface,
          sign: '+',
        };
      case 'withdraw':
        return {
          icon: 'arrow-up-circle' as const,
          color: '#2563EB',
          bg: '#EFF6FF',
          sign: '-',
        };
      case 'income':
        return {
          icon: 'trending-up' as const,
          color: theme.vip,
          bg: theme.vipLight,
          sign: '',
        };
      case 'checkin':
      default:
        return {
          icon: 'gift' as const,
          color: theme.primary,
          bg: theme.primarySurface,
          sign: '+',
        };
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning' as const;
      case 'failed':
        return 'danger' as const;
      case 'success':
      default:
        return 'success' as const;
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Transaction Records" showBack />

      {/* Filter Tabs */}
      <View
        style={[
          styles.tabBar,
          { backgroundColor: theme.surface, borderBottomColor: theme.cardBorder },
        ]}>
        {tabs.map((t) => {
          const isSelected = activeTab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.8}
              onPress={() => setActiveTab(t.id)}
              style={[
                styles.tabItem,
                isSelected && {
                  borderBottomColor: theme.primary,
                  borderBottomWidth: 2.5,
                },
              ]}>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isSelected ? theme.primary : theme.textSecondary },
                  isSelected && { fontWeight: '800' },
                ]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

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
        {isLoading ? (
          <View style={{ gap: Spacing.three }}>
            <Skeleton height={74} borderRadius={Radius.lg} />
            <Skeleton height={74} borderRadius={Radius.lg} />
            <Skeleton height={74} borderRadius={Radius.lg} />
          </View>
        ) : isError ? (
          <ErrorView
            title="Failed to Load Records"
            message="Unable to fetch transaction history. Tap retry to reload."
            onRetry={() => refetch()}
          />
        ) : !transactions || transactions.length === 0 ? (
          <EmptyView
            icon="receipt-outline"
            title="No Records Found"
            description={`No transactions found in ${activeTab} category.`}
          />
        ) : (
          transactions.map((rec) => {
            const conf = getRecordStyle(rec);
            const formattedDate = new Date(rec.date).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <View
                key={rec.id}
                style={[
                  styles.recordCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.cardBorder,
                  },
                ]}>
                <View style={[styles.iconCircle, { backgroundColor: conf.bg }]}>
                  <Ionicons name={conf.icon} size={22} color={conf.color} />
                </View>

                <View style={styles.recordInfo}>
                  <Text style={[styles.recordTitle, { color: theme.text }]}>
                    {rec.title}
                  </Text>
                  {rec.description ? (
                    <Text
                      style={[styles.recordDesc, { color: theme.textSecondary }]}
                      numberOfLines={1}>
                      {rec.description}
                    </Text>
                  ) : null}
                  <Text style={[styles.recordDate, { color: theme.textMuted }]}>
                    {formattedDate} {rec.referenceId ? `• Ref: ${rec.referenceId}` : ''}
                  </Text>
                </View>

                <View style={styles.amountCol}>
                  <Text style={[styles.amountText, { color: theme.text }]}>
                    {conf.sign}₹{rec.amount.toLocaleString()}
                  </Text>
                  <Badge variant={getStatusBadgeVariant(rec.status)} size="sm">
                    {rec.status.toUpperCase()}
                  </Badge>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.two,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    padding: Spacing.four,
    paddingBottom: Spacing.seven,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.two,
    ...Shadows.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordInfo: {
    flex: 1,
    marginLeft: Spacing.three,
    paddingRight: Spacing.two,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  recordDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  recordDate: {
    fontSize: 11,
    marginTop: 3,
  },
  amountCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '900',
  },
});
