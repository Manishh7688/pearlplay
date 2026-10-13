import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = Radius.sm,
  style,
}: SkeletonProps) {
  const theme = useTheme();
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.backgroundElement,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
}

export function PlanCardSkeleton() {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.cardSkeleton,
        { backgroundColor: theme.surface, borderColor: theme.cardBorder },
      ]}>
      <View style={styles.headerRow}>
        <Skeleton width="40%" height={24} />
        <Skeleton width="20%" height={22} borderRadius={Radius.full} />
      </View>
      <Skeleton width="60%" height={14} style={{ marginTop: 8 }} />

      <View style={styles.gridRow}>
        <View style={styles.col}>
          <Skeleton width="70%" height={12} />
          <Skeleton width="90%" height={20} style={{ marginTop: 6 }} />
        </View>
        <View style={styles.col}>
          <Skeleton width="70%" height={12} />
          <Skeleton width="90%" height={20} style={{ marginTop: 6 }} />
        </View>
      </View>

      <View style={styles.footerRow}>
        <Skeleton width="35%" height={26} />
        <Skeleton width="40%" height={40} borderRadius={Radius.md} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardSkeleton: {
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    marginTop: Spacing.four,
    gap: Spacing.three,
  },
  col: {
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.four,
  },
});
