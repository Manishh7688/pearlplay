import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  prefix?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  prefix,
  leftIcon,
  rightIcon,
  error,
  hint,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const theme = useTheme();

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.surfaceElevated,
            borderColor: error ? theme.danger : theme.border,
          },
        ]}>
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        {prefix ? (
          <View style={[styles.prefixWrapper, { borderRightColor: theme.border }]}>
            {typeof prefix === 'string' ? (
              <Text style={[styles.prefixText, { color: theme.textSecondary }]}>
                {prefix}
              </Text>
            ) : (
              prefix
            )}
          </View>
        ) : null}

        <TextInput
          placeholderTextColor={theme.textMuted}
          style={[
            styles.input,
            {
              color: theme.text,
            },
            style,
          ]}
          {...props}
        />

        {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
      ) : hint ? (
        <Text style={[styles.hintText, { color: theme.textMuted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: Spacing.three,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.one + 2,
    letterSpacing: -0.1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    minHeight: 48,
    paddingHorizontal: Spacing.three,
  },
  leftIcon: {
    marginRight: Spacing.two,
  },
  prefixWrapper: {
    paddingRight: Spacing.two,
    marginRight: Spacing.two,
    borderRightWidth: 1,
  },
  prefixText: {
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: Spacing.two,
  },
  rightIcon: {
    marginLeft: Spacing.two,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 2,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 4,
    marginLeft: 2,
  },
});
