import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Icon as Ionicons } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { useLoginMutation } from '@/hooks/use-mutations';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Radius, Shadows, Spacing } from '@/theme';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const loginMutation = useLoginMutation();

  const [phone, setPhone] = useState('7891192158');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (!phone.trim() || phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setErrorMessage('');
    loginMutation.mutate(
      { phone, pass: password },
      {
        onSuccess: (usr) => {
          showToast({
            message: `Welcome back, ${usr.username}!`,
            type: 'success',
          });
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 600);
        },
        onError: (err) => {
          setErrorMessage(err.message || 'Login failed. Please verify credentials.');
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Account Login"
        showBack
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* Logo and Brand Title */}
        <View style={styles.brandHero}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.brandMark}
            contentFit="cover"
            accessibilityLabel="Pearl AgriTech"
          />
          <Text style={[styles.brandTitle, { color: theme.text }]}>
            Pearl <Text style={{ color: theme.primary }}>AgriTech</Text>
          </Text>
          <Text style={[styles.brandSub, { color: theme.textSecondary }]}>
            Smart Agro-Yields & Daily Return Ecosystem
          </Text>
        </View>

        {/* Auth Form Card */}
        <View
          style={[
            styles.formCard,
            { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          ]}>
          <Text style={[styles.formHeading, { color: theme.text }]}>
            Sign In with Mobile
          </Text>

          <Input
            label="Mobile Phone Number"
            value={phone}
            onChangeText={(txt) => {
              setPhone(txt);
              setErrorMessage('');
            }}
            keyboardType="phone-pad"
            maxLength={10}
            prefix={<Text style={[styles.prefix, { color: theme.primary }]}>+91</Text>}
            leftIcon={<Ionicons name="call-outline" size={18} color={theme.textSecondary} />}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              setErrorMessage('');
            }}
            secureTextEntry={!showPassword}
            maxLength={32}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={theme.textSecondary} />}
            rightIcon={
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            }
            error={errorMessage}
          />

          <View style={styles.forgotRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                showToast({
                  message: 'Use default demo credentials: 7891192158 / 123456',
                  type: 'info',
                })
              }>
              <Text style={[styles.forgotText, { color: theme.primary }]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            variant="primary"
            size="lg"
            loading={loginMutation.isPending}
            onPress={handleLogin}
            style={{ marginTop: Spacing.two }}
            rightIcon={<Ionicons name="rocket-outline" size={18} color="#FFFFFF" />}>
            LOG IN
          </Button>

          <View style={styles.switchRow}>
            <Text style={[styles.switchPrompt, { color: theme.textSecondary }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/register')}>
              <Text style={[styles.switchLink, { color: theme.primary }]}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Credentials Helper Pill */}
        <View
          style={[
            styles.demoCredentialsBox,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
          ]}>
          <Ionicons name="information-circle" size={18} color={theme.primary} />
          <View style={{ flex: 1, marginLeft: Spacing.two }}>
            <Text style={[styles.demoTitle, { color: theme.text }]}>
              Demo Testing Credentials
            </Text>
            <Text style={[styles.demoBody, { color: theme.textSecondary }]}>
              Phone: 7891192158 | Password: 123456 (Pre-filled for fast evaluation)
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    padding: Spacing.four,
    paddingBottom: Spacing.seven,
  },
  brandHero: {
    alignItems: 'center',
    marginVertical: Spacing.five,
  },
  brandMark: {
    width: 84,
    height: 84,
    borderRadius: 22,
    marginBottom: Spacing.two,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  formCard: {
    padding: Spacing.four,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginBottom: Spacing.four,
    ...Shadows.sm,
  },
  formHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Spacing.three,
  },
  prefix: {
    fontSize: 15,
    fontWeight: '700',
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: Spacing.two,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.four,
  },
  switchPrompt: {
    fontSize: 13,
  },
  switchLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  demoCredentialsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  demoBody: {
    fontSize: 12,
    marginTop: 2,
  },
});
