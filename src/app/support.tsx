import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Button } from '@/components/ui/button';
import { INITIAL_PLATFORM_NOTICE } from '@/services/mock-data';
import { Radius, Shadows, Spacing } from '@/theme';

export default function SupportScreen() {
  const theme = useTheme();
  const notice = INITIAL_PLATFORM_NOTICE;

  const handleOpenTelegram = () => {
    Linking.openURL(notice.channelTelegramUrl).catch(() => {});
  };

  const handleOpenWhatsApp = () => {
    Linking.openURL(notice.channelWhatsappUrl).catch(() => {});
  };

  const faqs = [
    {
      q: 'How fast are wallet recharges credited?',
      a: 'All deposits via UPI, QR, and NetBanking are automatically credited within 10 to 60 seconds.',
    },
    {
      q: 'When can I request a withdrawal?',
      a: 'Withdrawals are open 24/7 with zero limits on frequency. The minimum withdrawal is ₹150, and the maximum single ticket is ₹10,000.',
    },
    {
      q: 'How do referral commissions work?',
      a: 'You earn 15% instant cashback on Level 1 direct referral investments, 3% on Level 2, and 1% on Level 3. Plus, get 10% direct bonus when your referral invests in a VIP Welfare plan.',
    },
    {
      q: 'How do I redeem daily gift codes?',
      a: 'Daily gift codes ranging from ₹8 to ₹200 are posted on our official Telegram channel. Go to the "Daily Rewards & Vouchers" screen to claim them.',
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Customer Care & Support" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* Support Channels Grid */}
        <View style={styles.channelsGrid}>
          {/* Telegram Channel Card */}
          <View
            style={[
              styles.channelCard,
              { backgroundColor: theme.surface, borderColor: theme.cardBorder },
            ]}>
            <View style={[styles.cIcon, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="paper-plane" size={24} color="#0284C7" />
            </View>
            <Text style={[styles.cTitle, { color: theme.text }]}>Official Telegram</Text>
            <Text style={[styles.cSub, { color: theme.textSecondary }]}>
              Daily announcements, gift codes, and community discussions.
            </Text>
            <Button
              variant="primary"
              size="sm"
              onPress={handleOpenTelegram}
              leftIcon={<Ionicons name="send" size={14} color="#FFFFFF" />}>
              Open Telegram
            </Button>
          </View>

          {/* WhatsApp Support Card */}
          <View
            style={[
              styles.channelCard,
              { backgroundColor: theme.surface, borderColor: theme.cardBorder },
            ]}>
            <View style={[styles.cIcon, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="logo-whatsapp" size={24} color="#16A34A" />
            </View>
            <Text style={[styles.cTitle, { color: theme.text }]}>WhatsApp Care</Text>
            <Text style={[styles.cSub, { color: theme.textSecondary }]}>
              24/7 One-on-one live support for payment and account assistance.
            </Text>
            <Button
              variant="primary"
              size="sm"
              onPress={handleOpenWhatsApp}
              style={{ backgroundColor: '#16A34A', borderColor: '#15803D' }}
              leftIcon={<Ionicons name="chatbubbles" size={14} color="#FFFFFF" />}>
              Chat on WhatsApp
            </Button>
          </View>
        </View>

        {/* Operating Hours Notice */}
        <View
          style={[
            styles.hoursCard,
            { backgroundColor: theme.primarySurface, borderColor: theme.primaryBorder },
          ]}>
          <Ionicons name="time" size={20} color={theme.primary} />
          <View style={{ flex: 1, marginLeft: Spacing.two }}>
            <Text style={[styles.hoursTitle, { color: theme.primaryDark }]}>
              Customer Service Operating Hours
            </Text>
            <Text style={[styles.hoursBody, { color: theme.textSecondary }]}>
              Online 24 Hours / 7 Days a week • Average response time under 3 minutes
            </Text>
          </View>
        </View>

        {/* FAQs */}
        <Text style={[styles.faqHeading, { color: theme.text }]}>
          Frequently Asked Questions
        </Text>

        {faqs.map((f, i) => (
          <View
            key={i}
            style={[
              styles.faqCard,
              { backgroundColor: theme.surface, borderColor: theme.cardBorder },
            ]}>
            <View style={styles.qRow}>
              <Ionicons name="help-circle-outline" size={18} color={theme.primary} />
              <Text style={[styles.qText, { color: theme.text }]}>{f.q}</Text>
            </View>
            <Text style={[styles.aText, { color: theme.textSecondary }]}>{f.a}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    paddingBottom: Spacing.seven,
  },
  channelsGrid: {
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  channelCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    ...Shadows.sm,
  },
  cIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  cTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  cSub: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.three,
  },
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  hoursTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  hoursBody: {
    fontSize: 12,
  },
  faqHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Spacing.three,
  },
  faqCard: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.two,
    ...Shadows.sm,
  },
  qRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    marginBottom: 6,
  },
  qText: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  aText: {
    fontSize: 12,
    lineHeight: 18,
    paddingLeft: 26,
  },
});
