import React, { createContext, useContext, useState, useCallback } from 'react';
import { StyleSheet, Text, Animated, View } from 'react-native';
import { Icon as Ionicons } from '@/components/ui/icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Radius, Shadows, Spacing } from '@/theme';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions | string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const opacityAnim = useState(new Animated.Value(0))[0];
  const translateYAnim = useState(new Animated.Value(-20))[0];

  const showToast = useCallback(
    (options: ToastOptions | string) => {
      const opts: ToastOptions =
        typeof options === 'string' ? { message: options, type: 'success' } : options;
      const type = opts.type || 'success';
      const duration = opts.duration || 2600;

      setToast({ message: opts.message, type });

      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: -20,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setToast(null);
        });
      }, duration);
    },
    [opacityAnim, translateYAnim]
  );

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case 'error':
        return { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5', icon: 'close-circle' as const };
      case 'warning':
        return { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D', icon: 'warning' as const };
      case 'info':
        return { bg: '#EFF6FF', text: '#1E40AF', border: '#93C5FD', icon: 'information-circle' as const };
      case 'success':
      default:
        return { bg: '#ECFDF5', text: '#065F46', border: '#6EE7B7', icon: 'checkmark-circle' as const };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toastContainer,
            {
              top: Math.max(insets.top, 16) + 8,
              opacity: opacityAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}>
          <View
            style={[
              styles.toastBox,
              {
                backgroundColor: getToastColors(toast.type).bg,
                borderColor: getToastColors(toast.type).border,
              },
            ]}>
            <Ionicons
              name={getToastColors(toast.type).icon}
              size={20}
              color={getToastColors(toast.type).text}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.toastText, { color: getToastColors(toast.type).text }]}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    borderWidth: 1,
    maxWidth: 500,
    ...Shadows.md,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
});
