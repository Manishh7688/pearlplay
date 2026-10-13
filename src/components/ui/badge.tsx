import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'vip' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'sm',
  icon,
  style,
  textStyle,
}: BadgeProps) {
  const theme = useTheme();

  const getVariantStyles = (): { bg: string; text: string; border?: string } => {
    switch (variant) {
      case 'vip':
        return {
          bg: theme.vipLight,
          text: theme.vipDark,
          border: theme.vipBorder,
        };
      case 'success':
        return {
          bg: theme.successLight,
          text: theme.success,
          border: theme.primaryBorder,
        };
      case 'warning':
        return {
          bg: theme.warningLight,
          text: theme.warning,
          border: theme.vipBorder,
        };
      case 'danger':
        return {
          bg: theme.dangerLight,
          text: theme.danger,
        };
      case 'info':
        return {
          bg: theme.accentLight,
          text: theme.accent,
        };
      case 'neutral':
        return {
          bg: theme.backgroundElement,
          text: theme.textSecondary,
        };
      case 'primary':
      default:
        return {
          bg: theme.primarySurface,
          text: theme.primaryDark,
          border: theme.primaryBorder,
        };
    }
  };

  const vStyles = getVariantStyles();
  const isSm = size === 'sm';

  const renderContent = () => {
    if (React.isValidElement(children) && !Array.isArray(children)) {
      return children;
    }
    return (
      <Text
        style={[
          styles.text,
          {
            color: vStyles.text,
            fontSize: isSm ? 11 : 13,
          },
          textStyle,
        ]}>
        {children}
      </Text>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: vStyles.bg,
          borderColor: vStyles.border || 'transparent',
          borderWidth: vStyles.border ? 1 : 0,
          paddingVertical: isSm ? 3 : 5,
          paddingHorizontal: isSm ? Spacing.two : Spacing.three,
        },
        style,
      ]}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
