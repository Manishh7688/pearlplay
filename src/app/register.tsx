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
import { useRegisterMutation } from '@/hooks/use-mutations';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Radius, Shadows, Spacing } from '@/theme';

export default function RegisterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const registerMutation = useRegisterMutation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = () => {
    const cleanName = name.trim().replace(/\s+/g, ' ');
    if (cleanName.length < 2) {
      setErrorMessage('Please enter your name');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Password and confirm password do not match');
      return;
    }

    setErrorMessage('');
    registerMutation.mutate(
      { name: cleanName, phone, password },
      {
        onSuccess: (usr) => {
          showToast({
            message: `Welcome, ${usr.username}. ₹10 sign-up bonus added.`,
            type: 'success',
          });
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 600);
        },
        onError: (err) => {
          setErrorMessage(err.message || 'Could not create the account.');
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Create Account" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
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
            Open an account and start with a ₹10 welcome bonus
          </Text>
        </View>

        <View
          style={[
            styles.formCard,
            { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          ]}>
          <Text style={[styles.formHeading, { color: theme.text }]}>Register New Member</Text>

          <Input
            label="Full Name"
            value={name}
            onChangeText={(txt) => {
              setName(txt);
              setErrorMessage('');
            }}
            autoCapitalize="words"
            maxLength={40}
            leftIcon={<Ionicons name="person-outline" size={18} color={theme.textSecondary} />}
          />

          <Input
            label="Mobile Number"
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
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              setErrorMessage('');
            }}
            secureTextEntry={!showPassword}
            maxLength={32}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={theme.textSecondary} />}
            rightIcon={
              <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPassword((open) => !open)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            }
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(txt) => {
              setConfirmPassword(txt);
              setErrorMessage('');
            }}
            secureTextEntry={!showConfirm}
            maxLength={32}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={theme.textSecondary} />}
            rightIcon={
              <TouchableOpacity activeOpacity={0.7} onPress={() => setShowConfirm((open) => !open)}>
                <Ionicons
                  name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
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
            loading={registerMutation.isPending}
            onPress={handleRegister}
            style={{ marginTop: Spacing.two }}
            rightIcon={<Ionicons name="rocket-outline" size={18} color="#FFFFFF" />}>
            Create Account
          </Button>

          <View style={styles.switchRow}>
            <Text style={[styles.switchPrompt, { color: theme.textSecondary }]}>
              Already have an account?
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.replace('/login')}>
              <Text style={[styles.switchLink, { color: theme.primary }]}>Log In</Text>
            </TouchableOpacity>
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
    fontSize: 16,
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
});
