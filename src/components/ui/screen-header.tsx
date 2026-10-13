import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon as Ionicons } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  transparent = false,
}: ScreenHeaderProps) {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 12 : 8),
          backgroundColor: transparent ? 'transparent' : theme.surface,
          borderBottomColor: transparent ? 'transparent' : theme.borderSubtle,
        },
      ]}>
      <View style={styles.content}>
        {showBack ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBack}
            style={[styles.iconButton, { backgroundColor: theme.primarySurface }]}>
            <Ionicons name="arrow-back" size={20} color={theme.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.titleWrapper}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {rightAction ? (
          <View style={styles.rightActionWrapper}>{rightAction}</View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
  },
  content: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  rightActionWrapper: {
    minWidth: 38,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  placeholder: {
    width: 38,
  },
});
