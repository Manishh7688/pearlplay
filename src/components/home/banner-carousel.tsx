import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Shadows, Spacing } from '@/theme';

export function BannerCarousel() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.hero,
          borderColor: 'transparent',
        },
      ]}>
      {/* Background visual accents */}
      <View style={styles.glow} />

      <View style={styles.topBadgeRow}>
        <View style={styles.tag}>
          <Icon name="sprout" size={12} color="#E8B86A" />
          <Text style={styles.tagText}>OFFICIAL AGRI-TECH PLATFORM</Text>
        </View>
        <Text style={styles.versionText}>July 2026 Release</Text>
      </View>

      <Text style={styles.bannerHeading}>
        Pearl Smart Agro-Yield <Text style={{ color: '#7DCEA0' }}>Infrastructure</Text>
      </Text>

      <Text style={styles.bannerSubtext}>
        Invest in farmland, cropping tools, and dairy with daily returns paid to your wallet.
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.featureItem}>
          <Icon name="check-decagram" size={14} color="#7DCEA0" />
          <Text style={styles.featureText}>Daily Income</Text>
        </View>
        <View style={styles.featureItem}>
          <Icon name="check-decagram" size={14} color="#7DCEA0" />
          <Text style={styles.featureText}>Easy Withdrawals</Text>
        </View>
        <View style={styles.featureItem}>
          <Icon name="check-decagram" size={14} color="#7DCEA0" />
          <Text style={styles.featureText}>15% Level Rebate</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: Spacing.three,
    ...Shadows.md,
  },
  glow: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3DAB74',
    opacity: 0.15,
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(252, 211, 77, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
  },
  tagText: {
    color: '#E8B86A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  versionText: {
    color: '#D5EBDF',
    fontSize: 11,
    fontWeight: '500',
  },
  bannerHeading: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
    lineHeight: 26,
    marginBottom: 6,
  },
  bannerSubtext: {
    color: '#D5EBDF',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: Spacing.three,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: Spacing.two,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    color: '#ECFDF5',
    fontSize: 11,
    fontWeight: '600',
  },
});
