import React, { useCallback, useEffect, useMemo } from 'react';
import useRenderLog from '@/hooks/useRenderLog';
import { ScrollView, StyleSheet, Text, TextInput, View, Dimensions } from 'react-native';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import NavigationService from '../../navigation/NavigationService';
import AppPress from '../../components/ui/appPress/AppPress';
import { GlobalLoading } from '../../store/useLoadingStore';
import { useIntlayer, useLocale } from 'react-intlayer';
import { useAlertStore } from '../../components/portals/alert/useAlertStore';
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
        <AppPress onPress={onPress} style={styles.featureCard} rippleColor="rgba(0,0,0,0.05)">
          <View style={[styles.iconContainer, iconBgStyle]}>
            <Icon fill={color} width={32} height={32} />
          </View>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.featureSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </AppPress>
      </Animated.View>
    );
  },
);

// ─── MAIN SCREEN ──────────────────────────────────────────────
const HomeScreen = () => {
  useRenderLog('HomeScreen');
  const { content } = useIntlayer('main');
  const { setLocale, locale } = useLocale();
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
        title: content.home.banners.explore_world,
        subtitle: content.home.banners.explore_world_sub,
      },
      {
        id: '2',
        imageUrl: 'https://picsum.photos/seed/banner2/800/400',
        title: content.home.banners.hot_deal,
        subtitle: content.home.banners.hot_deal_sub,
      },
      {
        id: '3',
        imageUrl: 'https://picsum.photos/seed/banner3/800/400',
        title: content.home.banners.new_feature,
        subtitle: content.home.banners.new_feature_sub,
      },
      {
        id: '4',
        imageUrl: 'https://picsum.photos/seed/banner4/800/400',
        title: content.home.banners.nature_scenery,
        subtitle: content.home.banners.nature_scenery_sub,
      },
    ],
    [content],
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

  const handleShowLoading = useCallback(() => {
    GlobalLoading.show(content.home.actions.saving_data);
    setTimeout(() => {
      GlobalLoading.hide();
    }, 2000);
  }, [content]);

  const handleShowAlert = useCallback(() => {
    showAlert({
      title: content.home.actions.delete_chat_title,
      content: content.home.actions.delete_chat_confirm,
      buttons: [
        { text: content.common.cancel, style: 'cancel', onPress: () => {} },
        {
          text: content.home.actions.delete_now,
          onPress: () => showToast(content.home.actions.deleted_success, 'success'),
        },
      ],
    });
  }, [showAlert, showToast, content]);

  const handleChangeLanguage = useCallback(() => {
    const newLang = locale === 'en' ? 'vi' : 'en';
    setLocale(newLang);
    showToast(
      newLang === 'en' ? content.home.actions.switched_to_en : content.home.actions.switched_to_vi,
      'success',
    );
  }, [showToast, content, locale, setLocale]);

  const handleShowToast = useCallback(() => {
    showToast(content.home.actions.welcome_back, 'success');
  }, [showToast, content]);

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
              <Text style={styles.greetingText}>{content.home.greeting}</Text>
              <Text style={styles.headerTitleText}>{content.home.explore_today}</Text>
            </View>

            <View style={styles.searchContainer}>
              <IconSearch fill="#fff" width={20} height={20} />
              <TextInput
                placeholder={content.home.search_placeholder}
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
            <Text style={styles.sectionTitle}>{content.home.featured_features}</Text>
            <Text style={styles.seeAllText}>{content.common.see_all}</Text>
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
                <Text style={styles.featuredTitle}>{content.home.features.social_media_feed}</Text>
                <Text style={styles.featuredSubtitle}>
                  {content.home.features.experience_modern}
                </Text>
                <AppPress onPress={handleNavigateToDetail} style={styles.featuredBtn}>
                  <Text style={styles.featuredBtnText}>{content.home.features.try_now}</Text>
                </AppPress>
              </LinearGradient>
            </View>

            <View style={[styles.featuredCard, styles.featuredCardSecond]}>
              <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.featuredCardGradient}>
                <Text style={styles.featuredTag}>OPTIMIZED</Text>
                <Text style={styles.featuredTitle}>{content.home.features.performance_list}</Text>
                <Text style={styles.featuredSubtitle}>{content.home.features.using_flashlist}</Text>
                <AppPress onPress={handleNavigateToDetail} style={styles.featuredBtn}>
                  <Text style={styles.featuredBtnText}>{content.home.features.discover}</Text>
                </AppPress>
              </LinearGradient>
            </View>
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{content.home.system_utilities}</Text>
          </View>

          <View style={styles.grid}>
            <FeatureCard
              title={content.home.features.social_feed.title}
              subtitle={content.home.features.social_feed.subtitle}
              icon={IconSocial}
              color="#8B5CF6"
              onPress={handleNavigateToDetail}
            />
            <FeatureCard
              title={content.home.features.modal.title}
              subtitle={content.home.features.modal.subtitle}
              icon={IconModal}
              color="#EC4899"
              onPress={showModal}
            />
            <FeatureCard
              title={content.home.features.language.title}
              subtitle={locale === 'en' ? 'English' : 'Tiếng Việt'}
              icon={IconLanguage}
              color="#F59E0B"
              onPress={handleChangeLanguage}
            />
            <FeatureCard
              title={content.home.features.swipe.title}
              subtitle={content.home.features.swipe.subtitle}
              icon={IconNotification}
              color="#10B981"
              onPress={handleNavigateToSwipeable}
            />
            <FeatureCard
              title={content.home.features.loading.title}
              subtitle={content.home.features.loading.subtitle}
              icon={IconLoading}
              color="#10B981"
              onPress={handleShowLoading}
            />
            <FeatureCard
              title={content.home.features.camera.title}
              subtitle={content.home.features.camera.subtitle}
              icon={CameraIcon}
              color="#10B981"
              onPress={handleNavigateToCamera}
            />
            <FeatureCard
              title={content.home.features.alert.title}
              subtitle={content.home.features.alert.subtitle}
              icon={IconAlert}
              color="#EF4444"
              onPress={handleShowAlert}
            />
            <FeatureCard
              title={content.home.features.notification.title}
              subtitle={content.home.features.notification.subtitle}
              icon={IconNotification}
              color="#3B82F6"
              onPress={handleShowToast}
            />

            <FeatureCard
              title={content.home.features.register.title}
              subtitle={content.home.features.register.subtitle}
              icon={IconRegister}
              color="#3B82F6"
              onPress={goToRegister}
            />
          </View>

          <View style={styles.footerInfo}>
            <Text style={styles.footerText}>{content.common.version('1.0.0')}</Text>
          </View>
        </ScrollView>
      </View>
    </AppScreen>
  );
};

export default React.memo(HomeScreen);
