import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Icon as Ionicons } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { Button } from './button';
import { Radius, Spacing } from '@/theme';

export interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorView({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading data. Please check your connection and try again.',
  onRetry,
  fullScreen = false,
}: ErrorViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        { backgroundColor: fullScreen ? theme.background : theme.surfaceElevated, borderColor: theme.border },
      ]}>
      <View style={[styles.iconCircle, { backgroundColor: theme.dangerLight }]}>
        <Ionicons name="alert-circle-outline" size={32} color={theme.danger} />
      </View>

      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>

      {onRetry ? (
        <View style={styles.buttonWrapper}>
          <Button
            size="md"
            variant="secondary"
            onPress={onRetry}
            leftIcon={<Ionicons name="refresh" size={16} color={theme.primary} />}>
            Retry Request
          </Button>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.five,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginVertical: Spacing.three,
  },
  fullScreen: {
    flex: 1,
    marginVertical: 0,
    borderWidth: 0,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
    marginBottom: Spacing.four,
  },
  buttonWrapper: {
    width: 160,
  },
});
