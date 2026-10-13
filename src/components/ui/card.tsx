import React from 'react';
import { StyleSheet, View, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Shadows, Spacing } from '@/theme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'surface' | 'subtle' | 'bordered' | 'vip';
  style?: ViewStyle;
  onPress?: () => void;
  padding?: number;
}

export function Card({
  children,
  variant = 'elevated',
  style,
  onPress,
  padding = Spacing.four,
}: CardProps) {
  const theme = useTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'vip':
        return {
          backgroundColor: theme.surface,
          borderColor: theme.vipBorder,
          borderWidth: 1.5,
          ...Shadows.md,
        };
      case 'surface':
        return {
          backgroundColor: theme.surface,
          borderColor: theme.cardBorder,
          borderWidth: 1,
        };
      case 'subtle':
        return {
          backgroundColor: theme.surfaceSubtle,
          borderColor: theme.borderSubtle,
          borderWidth: 1,
        };
      case 'bordered':
        return {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: theme.surface,
          borderColor: theme.cardBorder,
          borderWidth: 1,
          ...Shadows.sm,
        };
    }
  };

  const containerStyle = [
    styles.card,
    getVariantStyles(),
    { padding },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={containerStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
});
