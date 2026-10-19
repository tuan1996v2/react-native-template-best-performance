import React, { useCallback, useEffect, useMemo } from 'react';
import useRenderLog from '@/hooks/useRenderLog';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import NavigationService from '../../navigation/NavigationService';
import { GlobalLoading } from '../../store/useLoadingStore';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { useStyles } from '../../theme/useStyles';
import { getFCMTokenAndSendToServer } from '@/firebase/fcmService';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SuperBanner, { type BannerItem } from '@/components/ui/superBanner/SuperBanner';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

import {
  IconSearch,
  IconSocial,
  IconModal,
  IconLanguage,
  IconLoading,
  IconAlert,
  IconNotification,
  IconRegister,
  IconTheme,
  IconComment,
  IconNetwork,
} from '@/assets/icon';

import createStyles from './HomeScreen.styles';
import AppButton from '@/components/ui/appButton/AppButton';
import { useAlertStore } from '@/components/ui/alert/useAlertStore';
import { CameraIcon } from '../camera/icons/CameraIcon';
import { BUILD_VERSION } from '@/env';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';

// ─── TYPES ────────────────────────────────────────────────────
interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  onPress: () => void;
  debounceTime?: number;
}

// ─── FEATURE CARD COMPONENT ─────────────────────────────────
const FeatureCard = React.memo(
  ({ title, subtitle, icon: Icon, color, onPress, debounceTime = 400 }: FeatureCardProps) => {
    useRenderLog(`FeatureCard[${title}]`);
    const styles = useStyles(createStyles);
    const mode = useThemeStore(state => state.mode);
    const theme = ThemeTokens[mode];
    const iconBgStyle = useMemo(
      () => ({
        backgroundColor: color + '15',
        borderColor: color + '30',
      }),
      [color],
    );

    return (
      <Animated.View style={[styles.featureCardContainer]}>
        <AppButton
          debounceTime={debounceTime}
          depth={8}
          bottomColor={color + '40'}
          color={theme.card}
          onPress={onPress}>
          <View style={styles.center}>
            <View style={[styles.iconContainer, iconBgStyle]}>
              <Icon fill={color} width={32} height={32} />
            </View>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureSubtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          </View>
        </AppButton>
      </Animated.View>
    );
  },
);

const HomeScreen = () => {
  useRenderLog('HomeScreen');
  const styles = useStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const showToast = useAlertStore(state => state.showToast);
  const showAlert = useAlertStore(state => state.showAlert);

  const mode = useThemeStore(state => state.mode);
  const setMode = useThemeStore(state => state.setMode);
  const theme = ThemeTokens[mode];

  // 🚀 Animated values for collapsible header
  const headerTranslateY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  const HEADER_COLLAPSE_HEIGHT = useMemo(() => insets.top + 160, [insets.top]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      'worklet';
      const y = event.contentOffset.y;
      const dy = y - lastScrollY.value;

      if (y > 0) {
        const next = headerTranslateY.value - dy;
        headerTranslateY.value = Math.max(-HEADER_COLLAPSE_HEIGHT, Math.min(0, next));
      } else {
        headerTranslateY.value = 0;
      }
      lastScrollY.value = y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerTranslateY.value }],
  }));

  // ─── BANNER DATA ─────────────────────────────────────────
  const bannerData: BannerItem[] = useMemo(
    () => [
      {
        id: '1',
        title: 'Futuristic UI Kit',
        subtitle: 'Build faster with zero-re-render components',
        imageUrl:
          'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80',
        backgroundColor: '#6366F1',
      },
      {
        id: '2',
        title: 'iOS 26 Aesthetic',
        subtitle: 'Glassmorphism and spring interactions',
        imageUrl:
          'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80',
        backgroundColor: '#EC4899',
      },
    ],
    [],
  );

  useEffect(() => {
    getFCMTokenAndSendToServer();
  }, []);

  const handleNavigateToDetail = useCallback(() => {
    NavigationService.navigate('DetailScreen', { productId: 123 });
  }, []);

  const handleNavigateToSwipeable = useCallback(() => {
    NavigationService.navigate('SwipeableScreen');
  }, []);

  const showModal = useCallback(() => {
    NavigationService.navigate('MyModalScreen');
  }, []);

  const goToRegister = useCallback(() => {
    NavigationService.navigate('RegisterScreen');
  }, []);

  const handleNavigateToCamera = useCallback(() => {
    NavigationService.navigate('CameraScreen');
  }, []);

  const handleNavigateToQrScanScreen = useCallback(() => {
    NavigationService.navigate('QrScanScreen');
  }, []);

  const handleNavigateToOtp = useCallback(() => {
    NavigationService.navigate('OtpDemoScreen');
  }, []);

  const handleNavigateToNetworkSimulator = useCallback(() => {
    NavigationService.navigate('NetworkSimulatorScreen');
  }, []);

  const handleNavigateToChatDemo = useCallback(() => {
    NavigationService.navigate('ChatDemoScreen');
  }, []);

  const handleNavigateToChatSimulator = useCallback(() => {
    NavigationService.navigate('ChatSimulatorScreen');
  }, []);

  const handleShowLoading = useCallback(() => {
    GlobalLoading.show(t('home.actions.saving_data'));
    setTimeout(() => {
      GlobalLoading.hide();
    }, 2000);
  }, [t]);

  const handleShowAlert = useCallback(() => {
    showAlert({
      title: t('home.actions.delete_chat_title'),
      content: t('home.actions.delete_chat_confirm'),
      buttons: [
        { text: t('common.cancel'), style: 'cancel', onPress: () => {} },
        {
          text: t('home.actions.delete_now'),
          onPress: () => showToast(t('home.actions.deleted_success'), 'success'),
        },
      ],
    });
  }, [showAlert, showToast, t]);

  const handleChangeLanguage = useCallback(() => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
    showToast(
      newLang === 'en' ? t('home.actions.switched_to_en') : t('home.actions.switched_to_vi'),
      'success',
    );
  }, [showToast, t]);

  const handleToggleTheme = useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    showToast(
      newMode === 'dark' ? 'Switched to Dark Mode 🌙' : 'Switched to Light Mode ☀️',
      'success',
    );
  }, [mode, setMode, showToast]);

  const handleShowToast = useCallback(() => {
    showToast(t('home.actions.welcome_back'), 'success');
  }, [showToast, t]);

  const headerPaddingStyle = useMemo(() => ({ paddingTop: insets.top + 10 }), [insets.top]);

  return (
    <AppScreen edges={[]} backgroundColor={theme.background} statusBarStyle="light-content">
      <View style={styles.root}>
        {/* 🚀 COLLAPSIBLE HEADER (Absolute Overlay) ────────────────── */}
        <Animated.View style={[styles.headerWrapper, headerAnimatedStyle]}>
          <View style={[styles.headerContainer, headerPaddingStyle]}>
            <LinearGradient
              colors={theme.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greetingText}>{t('home.greeting')}</Text>
                <Text style={styles.headerTitleText}>{t('home.explore_today')}</Text>
              </View>

              <View style={styles.searchContainer}>
                <IconSearch fill="rgba(255,255,255,0.8)" width={20} height={20} />
                <TextInput
                  placeholder={t('home.search_placeholder')}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.searchInput}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.ScrollView
          style={styles.scrollview}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: HEADER_COLLAPSE_HEIGHT - 20 },
          ]}>
          <View style={styles.bannerSection}>
            <SuperBanner data={bannerData} />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.system_utilities')}</Text>
          </View>

          <View style={styles.grid}>
            {/* 1. Network Inspector & DevTools (Cực kỳ hữu ích khi debug/test API) */}
            <FeatureCard
              title={t('home.features.network.title')}
              subtitle={t('home.features.network.subtitle')}
              icon={IconNetwork}
              color={theme.mode === 'light' ? '#0EA5E9' : '#38BDF8'}
              onPress={handleNavigateToNetworkSimulator}
            />

            {/* 2. Realtime Chat & Hội thoại thực tế */}
            <FeatureCard
              title={t('home.features.chat_demo.title')}
              subtitle={t('home.features.chat_demo.subtitle')}
              icon={IconComment}
              color={theme.mode === 'light' ? '#6366F1' : '#818CF8'}
              onPress={handleNavigateToChatDemo}
            />

            {/* 3. Quét mã QR & Barcode (Vision Camera) */}
            <FeatureCard
              title={t('home.features.qr.title')}
              subtitle={t('home.features.qr.subtitle')}
              icon={CameraIcon}
              color={theme.mode === 'light' ? '#06B6D4' : '#22D3EE'}
              onPress={handleNavigateToQrScanScreen}
            />

            {/* 4. Xác thực OTP Zero Re-render */}
            <FeatureCard
              title={t('home.features.otp.title')}
              subtitle={t('home.features.otp.subtitle')}
              icon={IconRegister}
              color={theme.mode === 'light' ? '#4F46E5' : '#818CF8'}
              onPress={handleNavigateToOtp}
            />

            {/* 5. Camera & Ghi hình */}
            <FeatureCard
              title={t('home.features.camera.title')}
              subtitle={t('home.features.camera.subtitle')}
              icon={CameraIcon}
              color={theme.mode === 'light' ? '#F43F5E' : '#FB7185'}
              onPress={handleNavigateToCamera}
            />

            {/* 6. Bảng tin Social Feed FlashList */}
            <FeatureCard
              title={t('home.features.social_feed.title')}
              subtitle={t('home.features.social_feed.subtitle')}
              icon={IconSocial}
              color={theme.mode === 'light' ? '#8B5CF6' : '#A78BFA'}
              onPress={handleNavigateToDetail}
            />

            {/* 7. Thao tác vuốt Native Gesture */}
            <FeatureCard
              title={t('home.features.swipe.title')}
              subtitle={t('home.features.swipe.subtitle')}
              icon={IconNotification}
              color={theme.mode === 'light' ? '#10B981' : '#34D399'}
              onPress={handleNavigateToSwipeable}
            />

            {/* 8. Kịch bản mô phỏng Chat */}
            <FeatureCard
              title={t('home.features.chat_simulator.title')}
              subtitle={t('home.features.chat_simulator.subtitle')}
              icon={IconComment}
              color={theme.mode === 'light' ? '#2563EB' : '#60A5FA'}
              onPress={handleNavigateToChatSimulator}
            />

            {/* 9. Biểu mẫu & Form nhập liệu */}
            <FeatureCard
              title={t('home.features.register.title')}
              subtitle={t('home.features.register.subtitle')}
              icon={IconRegister}
              color={theme.mode === 'light' ? '#EC4899' : '#F472B6'}
              onPress={goToRegister}
            />

            {/* 10. Chế độ giao diện Sáng / Tối */}
            <FeatureCard
              title={t('home.features.theme.title')}
              subtitle={
                mode === 'light' ? t('home.features.theme.light') : t('home.features.theme.dark')
              }
              icon={IconTheme}
              color={theme.primary}
              onPress={handleToggleTheme}
            />

            {/* 11. Đa ngôn ngữ i18n */}
            <FeatureCard
              title={t('home.features.language.title')}
              subtitle={i18n.language === 'en' ? 'English' : 'Tiếng Việt'}
              icon={IconLanguage}
              color={theme.mode === 'light' ? '#F59E0B' : '#FBBF24'}
              onPress={handleChangeLanguage}
            />

            {/* 12. Cửa sổ nổi Modal */}
            <FeatureCard
              title={t('home.features.modal.title')}
              subtitle={t('home.features.modal.subtitle')}
              icon={IconModal}
              color={theme.mode === 'light' ? '#D946EF' : '#E879F9'}
              onPress={showModal}
            />

            {/* 13. Thông báo tức thì Toast */}
            <FeatureCard
              title={t('home.features.notification.title')}
              subtitle={t('home.features.notification.subtitle')}
              icon={IconNotification}
              color={theme.mode === 'light' ? '#3B82F6' : '#60A5FA'}
              onPress={handleShowToast}
            />

            {/* 14. Hộp thoại xác nhận Alert */}
            <FeatureCard
              title={t('home.features.alert.title')}
              subtitle={t('home.features.alert.subtitle')}
              icon={IconAlert}
              color={theme.mode === 'light' ? '#EF4444' : '#F87171'}
              onPress={handleShowAlert}
            />

            {/* 15. Trạng thái chờ Loading */}
            <FeatureCard
              title={t('home.features.loading.title')}
              subtitle={t('home.features.loading.subtitle')}
              icon={IconLoading}
              color={theme.mode === 'light' ? '#8B5CF6' : '#A78BFA'}
              onPress={handleShowLoading}
            />
          </View>

          <View style={styles.footerInfo}>
            <Text style={styles.footerText}>{t('common.version', { version: BUILD_VERSION })}</Text>
          </View>
        </Animated.ScrollView>
      </View>
    </AppScreen>
  );
};

export default React.memo(HomeScreen);
