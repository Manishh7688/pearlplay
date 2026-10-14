import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { PLAN_IMAGES } from '@/components/plans/plan-images';
import { Radius, Shadows, Spacing } from '@/theme';

const SLIDES = [
  {
    id: 'agro',
    tag: 'SMART FARMING',
    title: 'Precision Hydroponics & Solar Irrigation',
    subtitle: 'Earn automated daily returns credited directly to your wallet every 24 hours.',
    ctaLabel: 'Explore Plans',
    ctaRoute: '/products' as const,
    accentColor: '#34D399',
    image: PLAN_IMAGES['land-hydroponics'],
  },
  {
    id: 'vip',
    tag: 'VIP SHORT-CYCLE',
    title: 'High-Yield Drone & Harvester Projects',
    subtitle: 'Short 5 to 7 day cycles with high daily payouts and 0% withdrawal fees.',
    ctaLabel: 'View VIP Plans',
    ctaRoute: '/products' as const,
    accentColor: '#FBBF24',
    image: PLAN_IMAGES['tool-drone'],
  },
  {
    id: 'team',
    tag: 'PARTNER NETWORK',
    title: 'Invite Friends & Earn 15% Commission',
    subtitle: 'Build your 3-tier agro-partner network and receive instant referral rewards.',
    ctaLabel: 'Invite Friends',
    ctaRoute: '/team' as const,
    accentColor: '#38BDF8',
    image: PLAN_IMAGES['dairy-estate'],
  },
];

export function BannerCarousel() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = SLIDES[activeIndex];

  return (
    <View style={styles.banner}>
      {/* Background Photo */}
      <Image
        source={current.image}
        style={styles.bgImage}
        contentFit="cover"
        transition={300}
      />

      {/* Dark Scrim Overlay for Clean Text Contrast */}
      <View style={styles.scrim} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.tagPill}>
            <View style={[styles.tagDot, { backgroundColor: current.accentColor }]} />
            <Text style={styles.tagText}>{current.tag}</Text>
          </View>

          <View style={styles.dotsRow}>
            {SLIDES.map((s, idx) => {
              const active = idx === activeIndex;
              return (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => setActiveIndex(idx)}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  style={[
                    styles.dot,
                    active
                      ? { width: 20, backgroundColor: current.accentColor }
                      : { width: 7, backgroundColor: 'rgba(255,255,255,0.45)' },
                  ]}
                />
              );
            })}
          </View>
        </View>

        <Text style={styles.heading} numberOfLines={2}>
          {current.title}
        </Text>

        <Text style={styles.subtitle} numberOfLines={2}>
          {current.subtitle}
        </Text>

        <View style={styles.bottomRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push(current.ctaRoute as any)}
            style={[styles.ctaBtn, { backgroundColor: current.accentColor }]}>
            <Text style={styles.ctaText}>{current.ctaLabel}</Text>
            <Icon name="arrow-right" size={15} color="#062016" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 184,
    backgroundColor: '#062E22',
    ...Shadows.md,
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(6, 24, 18, 0.72)',
  },
  content: {
    padding: Spacing.four,
    justifyContent: 'space-between',
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
  },
  tagDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
    lineHeight: 26,
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.three,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
  },
  ctaText: {
    color: '#062016',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
