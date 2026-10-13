import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useBankDetails } from '@/hooks/use-queries';
import { useSaveBankDetailsMutation } from '@/hooks/use-mutations';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Radius, Spacing } from '@/theme';

export default function BankDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { showToast } = useToast();

  const { data: bank } = useBankDetails();
  const saveMutation = useSaveBankDetailsMutation();

  const [holderName, setHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (bank?.isBound) {
      setHolderName(bank.holderName || '');
      setAccountNumber(bank.accountNumber || '');
      setIfscCode(bank.ifscCode || '');
      setBankName(bank.bankName || '');
      setUpiId(bank.upiId || '');
    } else {
      // Pre-fill default user name for convenience
      setHolderName('Manish');
    }
  }, [bank]);

  const handleSave = () => {
    const errs: Record<string, string> = {};

    if (!holderName.trim()) {
      errs.holderName = 'Account holder name is required';
    }
    if (!accountNumber.trim() || accountNumber.length < 9) {
      errs.accountNumber = 'Enter a valid account number (min 9 digits)';
    }
    if (!ifscCode.trim() || ifscCode.length < 11) {
      errs.ifscCode = 'Enter a valid 11-digit IFSC code (e.g. SBIN0001234)';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    saveMutation.mutate(
      {
        holderName: holderName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        bankName: bankName.trim() || 'State Bank of India',
        upiId: upiId.trim(),
      },
      {
        onSuccess: () => {
          showToast({
            message: 'Bank details saved securely!',
            type: 'success',
          });
          setTimeout(() => {
            router.back();
          }, 800);
        },
        onError: (err) => {
          showToast({
            message: err.message || 'Failed to save bank info.',
            type: 'error',
          });
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Bank Account Details" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <View
          style={[
            styles.infoCard,
            { backgroundColor: theme.primarySurface, borderColor: theme.primaryBorder },
          ]}>
          <Ionicons name="shield-checkmark" size={24} color={theme.primary} />
          <View style={{ flex: 1, marginLeft: Spacing.two }}>
            <Text style={[styles.infoTitle, { color: theme.primaryDark }]}>
              Secure Direct Deposit Binding
            </Text>
            <Text style={[styles.infoBody, { color: theme.textSecondary }]}>
              Please verify your bank details carefully. All withdrawal payouts are settled automatically to this registered account.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.formCard,
            { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          ]}>
          <Input
            label="Account Holder Name"
            placeholder="e.g. Manish Kumar"
            value={holderName}
            onChangeText={(txt) => {
              setHolderName(txt);
              setErrors((prev) => ({ ...prev, holderName: '' }));
            }}
            error={errors.holderName}
            leftIcon={<Ionicons name="person-outline" size={18} color={theme.textSecondary} />}
          />

          <Input
            label="Bank Account Number"
            placeholder="e.g. 50100428192831"
            value={accountNumber}
            onChangeText={(txt) => {
              setAccountNumber(txt);
              setErrors((prev) => ({ ...prev, accountNumber: '' }));
            }}
            keyboardType="numeric"
            error={errors.accountNumber}
            leftIcon={<Ionicons name="card-outline" size={18} color={theme.textSecondary} />}
          />

          <Input
            label="IFSC Code"
            placeholder="e.g. SBIN0001234"
            value={ifscCode}
            onChangeText={(txt) => {
              setIfscCode(txt.toUpperCase());
              setErrors((prev) => ({ ...prev, ifscCode: '' }));
            }}
            autoCapitalize="characters"
            maxLength={11}
            error={errors.ifscCode}
            leftIcon={<Ionicons name="business-outline" size={18} color={theme.textSecondary} />}
          />

          <Input
            label="Bank Name (Optional)"
            placeholder="e.g. State Bank of India"
            value={bankName}
            onChangeText={setBankName}
            leftIcon={<Ionicons name="location-outline" size={18} color={theme.textSecondary} />}
          />

          <Input
            label="UPI VPA (Optional)"
            placeholder="e.g. 7891192158@upi"
            value={upiId}
            onChangeText={setUpiId}
            leftIcon={<Ionicons name="phone-portrait-outline" size={18} color={theme.textSecondary} />}
            hint="For instant fallback UPI settlements"
          />
        </View>

        <View style={styles.actionSection}>
          <Button
            variant="primary"
            size="lg"
            loading={saveMutation.isPending}
            onPress={handleSave}
            leftIcon={<Ionicons name="save-outline" size={20} color="#FFFFFF" />}>
            Save Bank Details
          </Button>
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
    padding: Spacing.four,
    paddingBottom: Spacing.seven,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  infoBody: {
    fontSize: 12,
    lineHeight: 17,
  },
  formCard: {
    padding: Spacing.four,
    borderRadius: Radius.xl,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  actionSection: {
    marginTop: Spacing.two,
  },
});
