import React, { useCallback, useEffect, useMemo } from 'react';
import useRenderLog from '@/hooks/useRenderLog';
import { ScrollView, StyleSheet, Text, TextInput, View, Dimensions } from 'react-native';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import NavigationService from '../../navigation/NavigationService';
import AppPress from '../../components/ui/appPress/AppPress';
import { GlobalLoading } from '../../store/useLoadingStore';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { useStyles } from '../../theme/useStyles';
import { getFCMTokenAndSendToServer } from '@/firebase/fcmService';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SuperBanner, { type BannerItem } from '@/components/ui/superBanner/SuperBanner';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

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

const { width } = Dimensions.get('window');

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
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    // const onPressIn = () => (scale.value = withSpring(0.96));
    // const onPressOut = () => (scale.value = withSpring(1));

    const iconBgStyle = useMemo(() => ({ backgroundColor: color + '15' }), [color]);

    return (
      <Animated.View style={[styles.featureCardContainer, animatedStyle]}>
        <AppButton depth={5} bottomColor={COLORS.shadow} color="#fff" onPress={onPress}>
          <View style={styles.center}>
            <View style={[styles.iconContainer, iconBgStyle]}>
              <Icon fill={color} width={32} height={32} />
            </View>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureSubtitle} numberOfLines={1}>
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
    console.log('SwipeableScreen');
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

  const headerPaddingStyle = useMemo(() => ({ paddingTop: insets.top + 20 }), [insets.top]);

  return (
    <AppScreen edges={[]} backgroundColor="transparent" statusBarStyle="light-content">
      <View style={styles.root}>
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
              <IconSearch fill="#fff" width={20} height={20} />
              <TextInput
                placeholder={t('home.search_placeholder')}
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.searchInput}
              />
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollview}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.bannerSection}>
            <SuperBanner data={bannerData} />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.featured_features')}</Text>
            <Text style={styles.seeAllText}>{t('common.see_all')}</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
            decelerationRate="fast"
            snapToInterval={width * 0.75 + 16}>
            <View style={styles.featuredCard}>
              <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.featuredCardGradient}>
                <Text style={styles.featuredTag}>NEW CHOICE</Text>
                <Text style={styles.featuredTitle}>{t('home.features.social_media_feed')}</Text>
                <Text style={styles.featuredSubtitle}>{t('home.features.experience_modern')}</Text>
                <AppPress onPress={handleNavigateToDetail} style={styles.featuredBtn}>
                  <Text style={styles.featuredBtnText}>{t('home.features.try_now')}</Text>
                </AppPress>
              </LinearGradient>
            </View>

            <View style={[styles.featuredCard, styles.featuredCardSecond]}>
              <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.featuredCardGradient}>
                <Text style={styles.featuredTag}>OPTIMIZED</Text>
                <Text style={styles.featuredTitle}>{t('home.features.performance_list')}</Text>
                <Text style={styles.featuredSubtitle}>{t('home.features.using_flashlist')}</Text>
                <AppPress onPress={handleNavigateToDetail} style={styles.featuredBtn}>
                  <Text style={styles.featuredBtnText}>{t('home.features.discover')}</Text>
                </AppPress>
              </LinearGradient>
            </View>
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.system_utilities')}</Text>
          </View>

          <View style={styles.grid}>
            <FeatureCard
              title={t('home.features.social_feed.title')}
              subtitle={t('home.features.social_feed.subtitle')}
              icon={IconSocial}
              color="#8B5CF6"
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
              color="#10B981"
              onPress={handleShowLoading}
            />
            <FeatureCard
              title={t('home.features.camera.title')}
              subtitle={t('home.features.camera.subtitle')}
              icon={CameraIcon}
              color="#10B981"
              onPress={handleNavigateToCamera}
            />
            <FeatureCard
              title={t('home.features.qr.title')}
              subtitle={t('home.features.qr.subtitle')}
              icon={CameraIcon}
              color="#10B981"
              onPress={handleNavigateToQrScanScreen}
            />
            <FeatureCard
              title="OTP Input"
              subtitle="Beautiful & Customizable"
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
              color="#3B82F6"
              onPress={goToRegister}
            />
          </View>

          <View style={styles.footerInfo}>
            <Text style={styles.footerText}>{t('common.version', { version: '1.0.0' })}</Text>
          </View>
        </ScrollView>
      </View>
    </AppScreen>
  );
};

export default React.memo(HomeScreen);
