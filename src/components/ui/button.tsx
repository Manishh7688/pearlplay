import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Shadows, Spacing } from '@/theme';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'vip' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}: ButtonProps) {
  const theme = useTheme();

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle; spinnerColor: string } => {
    switch (variant) {
      case 'vip':
        return {
          container: {
            backgroundColor: theme.vip,
            borderColor: theme.vipDark,
            ...Shadows.md,
          },
          text: { color: '#FFFFFF' },
          spinnerColor: '#FFFFFF',
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.primarySurface,
            borderColor: theme.primaryBorder,
          },
          text: { color: theme.primaryDark },
          spinnerColor: theme.primary,
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: theme.border,
            borderWidth: 1.5,
          },
          text: { color: theme.text },
          spinnerColor: theme.text,
        };
      case 'danger':
        return {
          container: {
            backgroundColor: theme.danger,
            borderColor: theme.danger,
          },
          text: { color: '#FFFFFF' },
          spinnerColor: '#FFFFFF',
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: { color: theme.primary },
          spinnerColor: theme.primary,
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: theme.primary,
            borderColor: theme.primaryDark,
            ...Shadows.md,
          },
          text: { color: '#FFFFFF' },
          spinnerColor: '#FFFFFF',
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: Spacing.one + 2,
            paddingHorizontal: Spacing.three,
            borderRadius: Radius.sm,
            minHeight: 34,
          },
          text: { fontSize: 13, fontWeight: '600' },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: Spacing.three,
            paddingHorizontal: Spacing.five,
            borderRadius: Radius.lg,
            minHeight: 52,
          },
          text: { fontSize: 17, fontWeight: '700' },
        };
      case 'md':
      default:
        return {
          container: {
            paddingVertical: Spacing.two + 4,
            paddingHorizontal: Spacing.four,
            borderRadius: Radius.md,
            minHeight: 44,
          },
          text: { fontSize: 15, fontWeight: '600' },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  const renderContent = () => {
    if (React.isValidElement(children) && !Array.isArray(children)) {
      return children;
    }
    return (
      <Text style={[styles.baseText, variantStyles.text, sizeStyles.text, textStyle]}>
        {children}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.baseButton,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.spinnerColor} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
          {renderContent()}
          {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  iconLeft: {
    marginRight: Spacing.two,
  },
  iconRight: {
    marginLeft: Spacing.two,
  },
  disabled: {
    opacity: 0.55,
  },
});
