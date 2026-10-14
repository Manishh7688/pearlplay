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

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setErrorMessage('');
    loginMutation.mutate(
      { phone: cleanPhone, pass: password },
      {
        onSuccess: (usr) => {
          showToast({
            message: `Welcome back, ${usr.username}!`,
            type: 'success',
          });
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 400);
        },
        onError: (err) => {
          setErrorMessage(err.message || 'Incorrect mobile number or password.');
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
        showBack={false}
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
            placeholder="Enter 10-digit mobile number"
            value={phone}
            onChangeText={(txt) => {
              setPhone(txt.replace(/\D/g, '').slice(0, 10));
              setErrorMessage('');
            }}
            keyboardType="phone-pad"
            maxLength={10}
            prefix={<Text style={[styles.prefix, { color: theme.primary }]}>+91</Text>}
            leftIcon={<Ionicons name="call-outline" size={18} color={theme.textSecondary} />}
          />

          <Input
            label="Password"
            placeholder="Enter password (min 6 characters)"
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

        {/* Info card */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
          ]}>
          <Ionicons name="shield-checkmark" size={18} color={theme.primary} />
          <Text style={[styles.infoCardText, { color: theme.textSecondary }]}>
            Open to all Indian mobile numbers (+91). Receive instant ₹10 welcome bonus upon registration.
          </Text>
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
    maxWidth: 520,
    alignSelf: 'center',
    padding: Spacing.four,
    paddingBottom: Spacing.seven,
  },
  brandHero: {
    alignItems: 'center',
    marginVertical: Spacing.four,
  },
  brandMark: {
    width: 80,
    height: 80,
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
    textAlign: 'center',
  },
  formCard: {
    padding: Spacing.four,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginBottom: Spacing.four,
    ...Shadows.sm,
  },
  formHeading: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: Spacing.three,
  },
  prefix: {
    fontSize: 15,
    fontWeight: '700',
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  infoCardText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
});
