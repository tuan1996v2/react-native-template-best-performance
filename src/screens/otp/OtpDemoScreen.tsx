import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { OTPInput } from '@/components/ui/OTP/input';
import type { SlotProps } from '@/components/ui/OTP/types';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';
import styles, { COLORS } from './OtpDemoScreen.styles';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import { useTranslation } from 'react-i18next';
import Countdown from '@/components/ui/countdown/Countdown';
import AppButton from '@/components/ui/appButton/AppButton';
import { useAlertStore, toast } from '@/components/ui/alert/useAlertStore';

// --- Reusable Caret Component ---
const FakeCaret = ({ color = COLORS.primary }: { color?: string }) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0, { duration: 500 }), withTiming(1, { duration: 500 })),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.caretContainer}>
      <Animated.View style={[styles.caret, { backgroundColor: color }, animatedStyle]} />
    </View>
  );
};

// --- 1. Stripe Style (6 slots) ---
const StripeOTP = () => {
  const { t } = useTranslation();
  const onComplete = (code: string) =>
    toast.success(t('otp.alerts.style_code', { style: 'Stripe', code }));

  const renderSlot = (slot: SlotProps, index: number) => {
    const isFirst = index === 0;
    const isLast = index === 2 || index === 5;

    return (
      <Pressable
        key={index}
        onPress={slot.focus}
        style={[
          styles.stripeSlot,
          isFirst && styles.stripeSlotFirst,
          isLast && styles.stripeSlotLast,
          slot.isActive && styles.stripeActiveSlot,
        ]}>
        {slot.char !== null && <Text style={styles.stripeChar}>{slot.char}</Text>}
        {slot.hasFakeCaret && <FakeCaret />}
      </Pressable>
    );
  };

  return (
    <OTPInput
      maxLength={6}
      onComplete={onComplete}
      render={({ slots }) => (
        <View style={styles.stripeContainer}>
          <View style={styles.row}>{slots.slice(0, 3).map((slot, i) => renderSlot(slot, i))}</View>
          <View style={styles.stripeDash} />
          <View style={styles.row}>{slots.slice(3).map((slot, i) => renderSlot(slot, i + 3))}</View>
        </View>
      )}
    />
  );
};

// --- 2. Apple Style (6 slots) ---
const AppleOTP = () => {
  const { t } = useTranslation();
  const onComplete = (code: string) =>
    toast.success(t('otp.alerts.style_code', { style: 'Apple', code }));

  return (
    <OTPInput
      maxLength={6}
      onComplete={onComplete}
      render={({ slots }) => (
        <View style={styles.row}>
          {slots.map((slot, index) => (
            <Pressable
              key={index}
              onPress={slot.focus}
              style={[styles.appleSlot, slot.isActive && styles.appleActiveSlot]}>
              {slot.char !== null && <Text style={styles.appleChar}>{slot.char}</Text>}
              {slot.hasFakeCaret && <FakeCaret />}
            </Pressable>
          ))}
        </View>
      )}
    />
  );
};

// --- 3. Dashed Style (6 slots) ---
const DashedOTP = () => {
  const { t } = useTranslation();
  const onComplete = (code: string) =>
    toast.success(t('otp.alerts.style_code', { style: 'Dashed', code }));

  return (
    <OTPInput
      maxLength={6}
      onComplete={onComplete}
      render={({ slots }) => (
        <View style={styles.row}>
          {slots.map((slot, index) => (
            <Pressable key={index} onPress={slot.focus} style={styles.dashedSlot}>
              {slot.char !== null && <Text style={styles.stripeChar}>{slot.char}</Text>}
              {slot.hasFakeCaret && <FakeCaret />}
              <View
                style={[styles.dashedUnderline, slot.isActive && styles.dashedActiveUnderline]}
              />
            </Pressable>
          ))}
        </View>
      )}
    />
  );
};

// --- 4. Revolt Style (6 slots) ---
const RevoltOTP = () => {
  const { t } = useTranslation();
  const onComplete = (code: string) =>
    toast.success(t('otp.alerts.style_code', { style: 'Revolt', code }));

  return (
    <OTPInput
      maxLength={6}
      onComplete={onComplete}
      render={({ slots }) => (
        <View style={styles.revoltContainer}>
          {slots.map((slot, index) => (
            <React.Fragment key={index}>
              <Pressable
                onPress={slot.focus}
                style={[styles.revoltSlot, slot.isActive && styles.revoltActiveSlot]}>
                {slot.char !== null && (
                  <Text style={[styles.stripeChar, styles.revoltChar]}>{slot.char}</Text>
                )}
                {slot.hasFakeCaret && <FakeCaret color="#2563EB" />}
              </Pressable>
              {index === 2 && (
                <View style={styles.centerJustify}>
                  <View style={styles.stripeDash} />
                </View>
              )}
            </React.Fragment>
          ))}
        </View>
      )}
    />
  );
};

const OtpDemoScreen = () => {
  const { t } = useTranslation();
  const showAlert = useAlertStore(state => state.showAlert);
  const [canResend, setCanResend] = React.useState(false);
  const [countdownKey, setCountdownKey] = React.useState(0);

  const handleResend = React.useCallback(() => {
    setCanResend(false);
    setCountdownKey(prev => prev + 1); // Reset countdown
    showAlert({
      title: t('common.success'),
      content: t('otp.resend_code'),
      buttons: [{ text: t('common.close'), onPress: () => {} }],
    });
  }, [t, showAlert]);

  const handleCountdownFinished = React.useCallback(() => {
    setCanResend(true);
  }, []);

  return (
    <AppScreen backgroundColor={COLORS.bg}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('otp.demo_title')}</Text>
        <Text style={styles.subtitle}>{t('otp.demo_subtitle')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Stripe Style */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('otp.styles.stripe.title')}</Text>
            <Text style={styles.sectionDesc}>{t('otp.styles.stripe.desc')}</Text>
          </View>
          <View style={styles.otpWrapper}>
            <StripeOTP />
          </View>
        </View> */}

        {/* 2. Apple Style */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('otp.styles.apple.title')}</Text>
            <Text style={styles.sectionDesc}>{t('otp.styles.apple.desc')}</Text>
          </View>
          <View style={styles.otpWrapper}>
            <AppleOTP />
          </View>
        </View>

        {/* 3. Dashed Style */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('otp.styles.dashed.title')}</Text>
            <Text style={styles.sectionDesc}>{t('otp.styles.dashed.desc')}</Text>
          </View>
          <View style={styles.otpWrapper}>
            <DashedOTP />
          </View>
        </View>

        {/* 4. Revolt Style */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('otp.styles.revolt.title')}</Text>
            <Text style={styles.sectionDesc}>{t('otp.styles.revolt.desc')}</Text>
          </View>
          <View style={styles.otpWrapper}>
            <RevoltOTP />
          </View>
        </View>

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          {!canResend ? (
            <View style={[styles.row, styles.justifyCenter]}>
              <Text style={styles.sectionDesc}>{t('otp.resend_after')}</Text>
              <Countdown
                key={countdownKey}
                initialSeconds={60}
                onFinished={handleCountdownFinished}
                textStyle={styles.resendText}
                suffix="s"
              />
            </View>
          ) : (
            <AppButton onPress={handleResend} color="transparent">
              {t('otp.resend_code')}
            </AppButton>
          )}
        </View>
      </ScrollView>
    </AppScreen>
  );
};

export default OtpDemoScreen;
