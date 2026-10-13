import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { INITIAL_PLATFORM_NOTICE } from '@/services/mock-data';
import { Button } from './button';
import { Radius, Shadows, Spacing } from '@/theme';

interface AnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AnnouncementModal({ visible, onClose }: AnnouncementModalProps) {
  const theme = useTheme();
  const notice = INITIAL_PLATFORM_NOTICE;

  const points = [
    {
      num: 1,
      title: 'Platform Launch Date',
      value: notice.launchDate,
      icon: 'rocket-outline' as const,
    },
    {
      num: 2,
      title: 'Free Sign-up Bonus',
      value: `₹${notice.signUpBonus} (Credited immediately)`,
      icon: 'gift-outline' as const,
    },
    {
      num: 3,
      title: 'Daily Check-in & Gift Code',
      value: notice.dailyGiftCode,
      icon: 'calendar-outline' as const,
    },
    {
      num: 4,
      title: '3-Tier Agent Commission',
      value: notice.agentCashback,
      icon: 'people-outline' as const,
    },
    {
      num: 5,
      title: 'Settlement Speed',
      value: 'Daily Real-Time Yield & Instant Withdrawals',
      icon: 'flash-outline' as const,
    },
    {
      num: 6,
      title: 'Withdrawal Limits',
      value: `₹${notice.minWithdrawal} - ₹${notice.maxWithdrawal.toLocaleString()}`,
      icon: 'wallet-outline' as const,
    },
    {
      num: 7,
      title: 'Direct Referral Bonus',
      value: `${notice.referralBonusPercent}% instant reward on invited investments`,
      icon: 'cash-outline' as const,
    },
    {
      num: 8,
      title: 'Withdrawal Frequency',
      value: '24/7 Unlimited Daily Requests',
      icon: 'checkmark-circle-outline' as const,
    },
  ];

  const handleOpenTelegram = () => {
    Linking.openURL(notice.channelTelegramUrl).catch(() => {});
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.dialog, { backgroundColor: theme.surface }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: theme.primarySurface }]}>
            <View style={styles.badgeRow}>
              <View style={[styles.appLogoCircle, { backgroundColor: theme.primary }]}>
                <Ionicons name="leaf" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.primaryDark }]}>
                  {notice.title}
                </Text>
                <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                  {notice.subtitle}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={[styles.closeTopButton, { backgroundColor: theme.surface }]}>
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollInner}
            showsVerticalScrollIndicator={false}>
            {points.map((pt) => (
              <View
                key={pt.num}
                style={[
                  styles.pointRow,
                  { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
                ]}>
                <View style={[styles.pointNumber, { backgroundColor: theme.primarySurface }]}>
                  <Text style={[styles.pointNumberText, { color: theme.primary }]}>
                    {pt.num}
                  </Text>
                </View>

                <View style={styles.pointTextWrapper}>
                  <Text style={[styles.pointTitle, { color: theme.textSecondary }]}>
                    {pt.title}
                  </Text>
                  <Text style={[styles.pointValue, { color: theme.text }]}>{pt.value}</Text>
                </View>

                <Ionicons name={pt.icon} size={18} color={theme.primary} />
              </View>
            ))}

            <View style={styles.actionSection}>
              <Button
                variant="primary"
                size="md"
                onPress={handleOpenTelegram}
                leftIcon={<Ionicons name="paper-plane" size={18} color="#FFFFFF" />}>
                Join Official Telegram Channel
              </Button>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onClose}
                style={[styles.gotItButton, { borderColor: theme.border }]}>
                <Text style={[styles.gotItText, { color: theme.textSecondary }]}>
                  Understood & Continue
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  header: {
    padding: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    flex: 1,
  },
  appLogoCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  closeTopButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.two,
  },
  scrollContent: {
    flexGrow: 0,
  },
  scrollInner: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  pointNumber: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  pointNumberText: {
    fontSize: 12,
    fontWeight: '800',
  },
  pointTextWrapper: {
    flex: 1,
    paddingRight: Spacing.two,
  },
  pointTitle: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pointValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  actionSection: {
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  gotItButton: {
    paddingVertical: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gotItText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
