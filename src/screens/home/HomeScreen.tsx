import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import useRenderLog from '@/hooks/useRenderLog';
import { Pressable, Text, View, ScrollView } from 'react-native';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import AppPress from '@/components/ui/appPress/AppPress';
import NavigationService from '../../navigation/NavigationService';
import { GlobalLoading } from '../../store/useLoadingStore';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { useStyles } from '../../theme/useStyles';
import { getFCMTokenAndSendToServer } from '@/firebase/fcmService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showPermissionRationale, DEFAULT_RATIONALE_CONFIGS } from '@/libs/permissions';
import { s, vs } from '@/theme/Responsive';

import {
  IconSocial,
  IconModal,
  IconLoading,
  IconAlert,
  IconNotification,
  IconRegister,
  IconTheme,
  IconComment,
  IconNetwork,
  IconMore,
} from '@/assets/icon';

import createStyles from './HomeScreen.styles';
import { useAlertStore } from '@/components/ui/alert/useAlertStore';
import { CameraIcon } from '../camera/icons/CameraIcon';
import { BUILD_VERSION } from '@/env';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';

// ─── TYPES ────────────────────────────────────────────────────
interface BentoCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge?: string;
  color: string;
  onPress: () => void;
}

// ─── BENTO CARD COMPONENT ────────────────────────────────────
const BentoCard = React.memo(
  ({ title, subtitle, icon: Icon, badge, color, onPress }: BentoCardProps) => {
    useRenderLog(`BentoCard[${title}]`);
    const styles = useStyles(createStyles);
    const iconBgStyle = useMemo(() => ({ backgroundColor: color + '15' }), [color]);
    const badgeBgStyle = useMemo(() => ({ backgroundColor: color + '15' }), [color]);
    const badgeTextStyle = useMemo(() => ({ color }), [color]);

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.bentoCard, pressed && styles.bentoCardPressed]}>
        <View style={styles.cardTopRow}>
          <View style={[styles.iconBox, iconBgStyle]}>
            <Icon fill={color} width={s(20)} height={s(20)} />
          </View>
          {Boolean(badge) && (
            <View style={[styles.badgeBox, badgeBgStyle]}>
              <Text style={[styles.badgeText, badgeTextStyle]}>{badge}</Text>
            </View>
          )}
        </View>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </Pressable>
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
  const themePreference = useThemeStore(state => state.themePreference);
  const setThemePreference = useThemeStore(state => state.setThemePreference);
  const theme = ThemeTokens[mode];

  const scrollRef = useRef<ScrollView>(null);
  const [triggerCrash, setTriggerCrash] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
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

  const handleNavigateToChatSimulator = useCallback(() => {
    NavigationService.navigate('ChatSimulatorScreen');
  }, []);

  const handleNavigateToGallery = useCallback(() => {
    NavigationService.navigate('ComponentGalleryScreen');
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
          style: 'destructive',
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
    let nextPref: 'light' | 'dark' | 'system';
    let message: string;

    if (themePreference === 'light') {
      nextPref = 'dark';
      message = 'Đã chuyển sang Dark Mode';
    } else if (themePreference === 'dark') {
      nextPref = 'system';
      message = 'Đã chuyển sang Auto (Theo hệ thống)';
    } else {
      nextPref = 'light';
      message = 'Đã chuyển sang Light Mode';
    }

    setThemePreference(nextPref);
    showToast(message, 'success');
  }, [themePreference, setThemePreference, showToast]);

  const handleShowToast = useCallback(() => {
    showToast(t('home.actions.welcome_back'), 'success');
  }, [showToast, t]);

  const handleTriggerCrash = useCallback(() => {
    setTriggerCrash(true);
  }, []);

  const handleTestPermission = useCallback(() => {
    showPermissionRationale(DEFAULT_RATIONALE_CONFIGS.camera, () => {
      showToast('Đã được người dùng phê duyệt quyền Camera!', 'success');
    });
  }, [showToast]);

  const headerPaddingStyle = useMemo(() => ({ paddingTop: insets.top + vs(8) }), [insets.top]);

  if (triggerCrash) {
    throw new Error('Test crash kích nổ bởi Error Boundary trong HomeScreen!');
  }

  return (
    <AppScreen edges={[]} backgroundColor={theme.background} statusBarStyle="dark-content">
      <View style={styles.root}>
        {/* Modern Minimalist Header */}
        <View style={[styles.headerContainer, headerPaddingStyle]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerBrandRow}>
              <Text style={styles.headerTitle}>Best Performance</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Ready</Text>
              </View>
            </View>
            <Text style={styles.headerSubtitle}>React Native 0.84+ • New Architecture</Text>
          </View>

          <View style={styles.headerActions}>
            <AppPress
              onPress={handleChangeLanguage}
              style={styles.actionButton}
              rippleColor={theme.primary + '33'}>
              <Text style={styles.actionButtonText}>{i18n.language === 'en' ? 'EN' : 'VI'}</Text>
            </AppPress>

            <AppPress
              onPress={handleToggleTheme}
              style={styles.themeActionButton}
              rippleColor={theme.primary + '33'}>
              <IconTheme width={s(15)} height={s(15)} fill={theme.text} />
              <Text style={styles.themeBadgeText}>
                {themePreference === 'system'
                  ? 'AUTO'
                  : themePreference === 'dark'
                  ? 'DARK'
                  : 'LIGHT'}
              </Text>
            </AppPress>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.scrollview}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Tech Specs & Architecture Bar */}
          <View style={styles.specsContainer}>
            <View style={styles.specItem}>
              <Text style={styles.specValue}>0.84+</Text>
              <Text style={styles.specLabel}>Fabric</Text>
            </View>
            <View style={styles.specDivider} />
            <View style={styles.specItem}>
              <Text style={styles.specValue}>Reanimated 4</Text>
              <Text style={styles.specLabel}>Worklets</Text>
            </View>
            <View style={styles.specDivider} />
            <View style={styles.specItem}>
              <Text style={styles.specValue}>Zustand 5</Text>
              <Text style={styles.specLabel}>Granular</Text>
            </View>
            <View style={styles.specDivider} />
            <View style={styles.specItem}>
              <Text style={styles.specValue}>FlashList 2</Text>
              <Text style={styles.specLabel}>120 FPS</Text>
            </View>
          </View>

          {/* 1. DevTools & Profiling */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('home.categories.devtools')}</Text>
            </View>
            <View style={styles.grid}>
              <BentoCard
                title={t('home.features.network.title')}
                subtitle={t('home.features.network.subtitle')}
                icon={IconNetwork}
                badge="DevTools"
                color={theme.mode === 'light' ? '#0EA5E9' : '#38BDF8'}
                onPress={handleNavigateToNetworkSimulator}
              />
              <BentoCard
                title="Error Boundary"
                subtitle="Kích nổ crash test render JS"
                icon={IconAlert}
                badge="Recovery"
                color={theme.mode === 'light' ? '#EF4444' : '#F87171'}
                onPress={handleTriggerCrash}
              />
              <BentoCard
                title="Hộp thoại Xin Quyền"
                subtitle="Mở Rationale Modal chuẩn UX"
                icon={IconNotification}
                badge="Rationale"
                color={theme.mode === 'light' ? '#10B981' : '#34D399'}
                onPress={handleTestPermission}
              />
              <BentoCard
                title={t('home.features.swipe.title')}
                subtitle={t('home.features.swipe.subtitle')}
                icon={IconMore}
                badge="Gesture"
                color={theme.mode === 'light' ? '#8B5CF6' : '#A78BFA'}
                onPress={handleNavigateToSwipeable}
              />
            </View>
          </View>

          {/* 2. High Performance Demos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('home.categories.performance')}</Text>
            </View>
            <View style={styles.grid}>
              <BentoCard
                title={t('home.features.social_feed.title')}
                subtitle={t('home.features.social_feed.subtitle')}
                icon={IconSocial}
                badge="120 FPS"
                color={theme.mode === 'light' ? '#6366F1' : '#818CF8'}
                onPress={handleNavigateToDetail}
              />
              <BentoCard
                title={t('home.features.otp.title')}
                subtitle={t('home.features.otp.subtitle')}
                icon={IconRegister}
                badge="Zero Lag"
                color={theme.mode === 'light' ? '#4F46E5' : '#818CF8'}
                onPress={handleNavigateToOtp}
              />
              <BentoCard
                title={t('home.features.chat_simulator.title')}
                subtitle={t('home.features.chat_simulator.subtitle')}
                icon={IconComment}
                badge="Queue"
                color={theme.mode === 'light' ? '#2563EB' : '#60A5FA'}
                onPress={handleNavigateToChatSimulator}
              />
              <BentoCard
                title={t('home.features.register.title')}
                subtitle={t('home.features.register.subtitle')}
                icon={IconRegister}
                badge="Keyboard"
                color={theme.mode === 'light' ? '#EC4899' : '#F472B6'}
                onPress={goToRegister}
              />
            </View>
          </View>

          {/* 3. Native & Hardware */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('home.categories.hardware')}</Text>
            </View>
            <View style={styles.grid}>
              <BentoCard
                title={t('home.features.camera.title')}
                subtitle={t('home.features.camera.subtitle')}
                icon={CameraIcon}
                badge="Vision v4"
                color={theme.mode === 'light' ? '#F43F5E' : '#FB7185'}
                onPress={handleNavigateToCamera}
              />
              <BentoCard
                title={t('home.features.qr.title')}
                subtitle={t('home.features.qr.subtitle')}
                icon={CameraIcon}
                badge="Scanner"
                color={theme.mode === 'light' ? '#06B6D4' : '#22D3EE'}
                onPress={handleNavigateToQrScanScreen}
              />
            </View>
          </View>

          {/* 4. UI Kit & Core Feedback */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('home.categories.uikit')}</Text>
            </View>
            <View style={styles.grid}>
              <BentoCard
                title={t('home.features.modal.title')}
                subtitle={t('home.features.modal.subtitle')}
                icon={IconModal}
                badge="Sheet"
                color={theme.mode === 'light' ? '#A855F7' : '#C084FC'}
                onPress={showModal}
              />
              <BentoCard
                title={t('home.features.alert.title')}
                subtitle={t('home.features.alert.subtitle')}
                icon={IconAlert}
                badge="Alert"
                color={theme.mode === 'light' ? '#F59E0B' : '#FBBF24'}
                onPress={handleShowAlert}
              />
              <BentoCard
                title={t('home.features.notification.title')}
                subtitle={t('home.features.notification.subtitle')}
                icon={IconNotification}
                badge="Toast"
                color={theme.mode === 'light' ? '#3B82F6' : '#60A5FA'}
                onPress={handleShowToast}
              />
              <BentoCard
                title={t('home.features.loading.title')}
                subtitle={t('home.features.loading.subtitle')}
                icon={IconLoading}
                badge="Loading"
                color={theme.mode === 'light' ? '#10B981' : '#34D399'}
                onPress={handleShowLoading}
              />
              <BentoCard
                title={t('home.features.gallery.title')}
                subtitle={t('home.features.gallery.subtitle')}
                icon={IconMore}
                badge="All UI"
                color={theme.mode === 'light' ? '#EC4899' : '#F472B6'}
                onPress={handleNavigateToGallery}
              />
            </View>
          </View>

          {/* Footer Info */}
          <View style={styles.footerInfo}>
            <Text style={styles.footerText}>{t('common.version', { version: BUILD_VERSION })}</Text>
          </View>
        </ScrollView>
      </View>
    </AppScreen>
  );
};

export default React.memo(HomeScreen);
