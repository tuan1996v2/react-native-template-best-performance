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
} from '@/assets/icon';

import createStyles, { COLORS, GRADIENT_START, GRADIENT_END } from './HomeScreen.styles';
import AppButton from '@/components/ui/appButton/AppButton';
import { useAlertStore } from '@/components/ui/alert/useAlertStore';
import { CameraIcon } from '../camera/icons/CameraIcon';
import { BUILD_VERSION } from '@/env';

// ─── TYPES ────────────────────────────────────────────────────
interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  onPress: () => void;
}

// ─── FEATURE CARD COMPONENT ─────────────────────────────────
const FeatureCard = React.memo(
  ({ title, subtitle, icon: Icon, color, onPress }: FeatureCardProps) => {
    useRenderLog(`FeatureCard[${title}]`);
    const styles = useStyles(createStyles);
    const iconBgStyle = useMemo(
      () => ({
        backgroundColor: color + '15',
        borderColor: color + '30',
      }),
      [color],
    );

    return (
      <Animated.View style={[styles.featureCardContainer]}>
        <AppButton depth={8} bottomColor={color + '40'} color="#fff" onPress={onPress}>
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

// ─── MAIN SCREEN ──────────────────────────────────────────────
const HomeScreen = () => {
  useRenderLog('HomeScreen');
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = useStyles(createStyles);
  const showToast = useAlertStore(state => state.showToast);
  const showAlert = useAlertStore(state => state.showAlert);

  // 🚀 Animated values for collapsible header
  const headerTranslateY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  // Approximate header height (Compact header + insets)
  // headerContainer paddingBottom(24) + headerContent (approx 100) + search (48) + margins
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
        imageUrl: 'https://picsum.photos/seed/banner1/800/400',
        title: t('home.banners.explore_world'),
        subtitle: t('home.banners.explore_world_sub'),
      },
      {
        id: '2',
        imageUrl: 'https://picsum.photos/seed/banner2/800/400',
        title: t('home.banners.hot_deal'),
        subtitle: t('home.banners.hot_deal_sub'),
      },
      {
        id: '3',
        imageUrl: 'https://picsum.photos/seed/banner3/800/400',
        title: t('home.banners.new_feature'),
        subtitle: t('home.banners.new_feature_sub'),
      },
      {
        id: '4',
        imageUrl: 'https://picsum.photos/seed/banner4/800/400',
        title: t('home.banners.nature_scenery'),
        subtitle: t('home.banners.nature_scenery_sub'),
      },
    ],
    [t],
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

  const handleShowToast = useCallback(() => {
    showToast(t('home.actions.welcome_back'), 'success');
  }, [showToast, t]);

  const headerPaddingStyle = useMemo(() => ({ paddingTop: insets.top + 10 }), [insets.top]);

  return (
    <AppScreen edges={[]} backgroundColor={COLORS.bg} statusBarStyle="light-content">
      <View style={styles.root}>
        {/* 🚀 COLLAPSIBLE HEADER (Absolute Overlay) ────────────────── */}
        <Animated.View style={[styles.headerWrapper, headerAnimatedStyle]}>
          <View style={[styles.headerContainer, headerPaddingStyle]}>
            <LinearGradient
              colors={COLORS.gradient as string[]}
              start={GRADIENT_START}
              end={GRADIENT_END}
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
            <FeatureCard
              title={t('home.features.social_feed.title')}
              subtitle={t('home.features.social_feed.subtitle')}
              icon={IconSocial}
              color="#6366F1"
              onPress={handleNavigateToDetail}
            />
            <FeatureCard
              title={t('home.features.modal.title')}
              subtitle={t('home.features.modal.subtitle')}
              icon={IconModal}
              color="#EC4899"
              onPress={showModal}
            />
            <FeatureCard
              title={t('home.features.language.title')}
              subtitle={i18n.language === 'en' ? 'English' : 'Tiếng Việt'}
              icon={IconLanguage}
              color="#F59E0B"
              onPress={handleChangeLanguage}
            />
            <FeatureCard
              title={t('home.features.swipe.title')}
              subtitle={t('home.features.swipe.subtitle')}
              icon={IconNotification}
              color="#10B981"
              onPress={handleNavigateToSwipeable}
            />
            <FeatureCard
              title={t('home.features.loading.title')}
              subtitle={t('home.features.loading.subtitle')}
              icon={IconLoading}
              color="#8B5CF6"
              onPress={handleShowLoading}
            />
            <FeatureCard
              title={t('home.features.camera.title')}
              subtitle={t('home.features.camera.subtitle')}
              icon={CameraIcon}
              color="#F43F5E"
              onPress={handleNavigateToCamera}
            />
            <FeatureCard
              title={t('home.features.qr.title')}
              subtitle={t('home.features.qr.subtitle')}
              icon={CameraIcon}
              color="#06B6D4"
              onPress={handleNavigateToQrScanScreen}
            />
            <FeatureCard
              title="OTP Input"
              subtitle="Zero Re-render & SMS Auto-fill"
              icon={IconRegister}
              color="#4F46E5"
              onPress={handleNavigateToOtp}
            />
            <FeatureCard
              title={t('home.features.alert.title')}
              subtitle={t('home.features.alert.subtitle')}
              icon={IconAlert}
              color="#EF4444"
              onPress={handleShowAlert}
            />
            <FeatureCard
              title={t('home.features.notification.title')}
              subtitle={t('home.features.notification.subtitle')}
              icon={IconNotification}
              color="#3B82F6"
              onPress={handleShowToast}
            />
            <FeatureCard
              title={t('home.features.register.title')}
              subtitle={t('home.features.register.subtitle')}
              icon={IconRegister}
              color="#6366F1"
              onPress={goToRegister}
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
