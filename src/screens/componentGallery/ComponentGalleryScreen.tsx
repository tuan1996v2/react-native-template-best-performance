import React, { memo, useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import AppPress from '@/components/ui/appPress/AppPress';
import AppButton from '@/components/ui/appButton/AppButton';
import NavigationService from '@/navigation/NavigationService';
import { useStyles } from '@/theme/useStyles';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';
import { useAlertStore } from '@/components/ui/alert/useAlertStore';
import { GlobalLoading } from '@/store/useLoadingStore';
import { showPermissionRationale, DEFAULT_RATIONALE_CONFIGS } from '@/libs/permissions';
import { useNetworkStore } from '@/libs/requests-inspector';
import { vs } from '@/theme/Responsive';
import createStyles from './ComponentGalleryScreen.styles';

// Component Categories
type Category = 'ALL' | 'BUTTONS' | 'INPUTS' | 'MEDIA' | 'FEEDBACK' | 'DEVTOOLS';

interface ComponentItem {
  id: string;
  name: string;
  category: Category;
  path: string;
  desc: string;
  badge?: string;
  renderPreview: (
    theme: typeof ThemeTokens.light,
    onAction: (msg: string) => void,
  ) => React.ReactNode;
}

const ComponentGalleryScreen = () => {
  const styles = useStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const mode = useThemeStore(state => state.mode);
  const theme = ThemeTokens[mode] || ThemeTokens.light;
  const showToast = useAlertStore(state => state.showToast);
  const showAlert = useAlertStore(state => state.showAlert);

  const [activeCategory, setActiveCategory] = useState<Category>('ALL');

  const handleBack = useCallback(() => {
    NavigationService.back();
  }, []);

  const handleAction = useCallback(
    (msg: string) => {
      showToast(msg, 'success');
    },
    [showToast],
  );

  const headerPaddingStyle = useMemo(() => ({ paddingTop: insets.top + vs(8) }), [insets.top]);

  const componentsList = useMemo<ComponentItem[]>(
    () => [
      // 1. BUTTONS & TOUCHABLES
      {
        id: 'app-button',
        name: 'AppButton (3D Physics)',
        category: 'BUTTONS',
        path: 'src/components/ui/appButton/AppButton.tsx',
        desc: 'Nút bấm 3D depth với spring physics, dynamic shadow và haptic feedback native.',
        badge: 'Zero Lag',
        renderPreview: (th, onAct) => (
          <View style={styles.previewRow}>
            <AppButton
              depth={5}
              color={th.primary}
              onPress={() => onAct('Đã bấm AppButton 3D Depth!')}>
              3D Primary
            </AppButton>
            <AppButton
              depth={3}
              color={th.success}
              onPress={() => onAct('Đã bấm AppButton Success!')}>
              Success
            </AppButton>
          </View>
        ),
      },
      {
        id: 'app-press',
        name: 'AppPress (Touch Ripple)',
        category: 'BUTTONS',
        path: 'src/components/ui/appPress/AppPress.tsx',
        desc: 'Touchable tối ưu cao với Reanimated 4, ripple animation lan toả theo đúng toạ độ chạm thực tế.',
        badge: 'UI Worklet',
        renderPreview: (th, onAct) => (
          <View style={styles.previewRow}>
            <AppPress
              style={styles.rippleLargeBox}
              rippleColor={th.primary + '50'}
              rippleOpacity={0.6}
              rippleDuration={600}
              onPress={() => onAct('Đã kích hoạt hiệu ứng Touch Ripple lan toả!')}>
              <Text style={styles.rippleLargeTitle}>Chạm vào bất kỳ vị trí nào</Text>
              <Text style={styles.rippleLargeSubText}>
                Hiệu ứng Ripple sẽ lan toả từ chính toạ độ ngón tay của bạn
              </Text>
            </AppPress>
          </View>
        ),
      },

      // 2. INPUTS & FORMS
      {
        id: 'otp-input',
        name: 'OTP Input & Timer',
        category: 'INPUTS',
        path: 'src/components/ui/OTP/',
        desc: 'Bộ nhập mã OTP 4 phong cách (Stripe, Apple, Dashed, Revolt), hỗ trợ SMS auto-fill và bộ đếm UI Thread.',
        badge: 'Zero Re-render',
        renderPreview: th => (
          <View style={styles.previewRow}>
            <AppPress
              style={[styles.filterPill, { backgroundColor: th.card }]}
              onPress={() => NavigationService.navigate('OtpDemoScreen')}>
              <Text style={styles.demoItemText}>Mở Màn Hình Demo OTP (4 Styles) →</Text>
            </AppPress>
          </View>
        ),
      },
      {
        id: 'multi-input',
        name: 'AppTextInput & Multi Form',
        category: 'INPUTS',
        path: 'src/components/ui/appTextInput/',
        desc: 'Biểu mẫu nhập liệu tối ưu hóa re-render, tích hợp react-hook-form, kiểm tra lỗi và tự cuộn theo bàn phím.',
        badge: 'Form Hook',
        renderPreview: th => (
          <View style={styles.previewRow}>
            <AppPress
              style={[styles.filterPill, { backgroundColor: th.card }]}
              onPress={() => NavigationService.navigate('RegisterScreen')}>
              <Text style={styles.demoItemText}>Mở Biểu Mẫu Đăng Ký Test Form →</Text>
            </AppPress>
          </View>
        ),
      },

      // 3. MEDIA, SCANNER & HARDWARE
      {
        id: 'qr-barcode-scanner',
        name: 'QR & Barcode Scanner',
        category: 'MEDIA',
        path: 'src/screens/qrScan/',
        desc: 'Quét mã QR và Barcode siêu tốc bằng Vision Camera, quét từ ảnh thư viện, bật tắt đèn flash và giải phóng camera khi blur.',
        badge: 'Vision v4',
        renderPreview: th => (
          <View style={styles.previewRow}>
            <AppPress
              style={[styles.filterPill, { backgroundColor: th.card }]}
              onPress={() => NavigationService.navigate('QrScanScreen')}>
              <Text style={styles.demoItemText}>Khởi Động Trình Quét QR & Barcode →</Text>
            </AppPress>
          </View>
        ),
      },
      {
        id: 'camera-module',
        name: 'Pro Camera Module',
        category: 'MEDIA',
        path: 'src/screens/camera/',
        desc: 'Chụp ảnh độ phân giải cao, quay video kèm bộ đếm giờ UI Thread, chạm lấy nét (Tap-to-focus) và chuyển đổi camera trước/sau.',
        badge: 'Nitro Modules',
        renderPreview: th => (
          <View style={styles.previewRow}>
            <AppPress
              style={[styles.filterPill, { backgroundColor: th.card }]}
              onPress={() => NavigationService.navigate('CameraScreen')}>
              <Text style={styles.demoItemText}>Mở Camera & Ghi Hình Native →</Text>
            </AppPress>
          </View>
        ),
      },
      {
        id: 'swipeable-item',
        name: 'Swipeable Item (Gesture)',
        category: 'MEDIA',
        path: 'src/components/ui/swipeItem/SwipeItem.tsx',
        desc: 'Thao tác vuốt mượt mà kiểu iOS Mail, tích hợp React Native Gesture Handler và FlashList 120 FPS.',
        badge: 'Native Gesture',
        renderPreview: th => (
          <View style={styles.previewRow}>
            <AppPress
              style={[styles.filterPill, { backgroundColor: th.card }]}
              onPress={() => NavigationService.navigate('SwipeableScreen')}>
              <Text style={styles.demoItemText}>Mở Danh Sách Vuốt Xóa Swipeable →</Text>
            </AppPress>
          </View>
        ),
      },
      {
        id: 'skeleton-placeholder',
        name: 'Skeleton Placeholder',
        category: 'MEDIA',
        path: 'src/components/ui/skeleton/Skeleton.tsx',
        desc: 'Khung xương placeholder tải trước dữ liệu với hiệu ứng Shimmer mượt mà không gây nghẽn luồng.',
        badge: 'Shimmer Wave',
        renderPreview: () => (
          <View style={styles.previewColumn}>
            <View style={styles.skeletonBox} />
            <View style={styles.skeletonBox} />
          </View>
        ),
      },

      // 4. FEEDBACK & DIALOGS
      {
        id: 'bottom-sheet-modal',
        name: 'Native Bottom Sheet (MyModal)',
        category: 'FEEDBACK',
        path: 'src/screens/home/MyModalScreen.tsx',
        desc: 'Cửa sổ nổi Bottom Sheet dạng Solid Card, grabber pill, chạm ngoài đóng nhanh và hỗ trợ safe area chuẩn.',
        badge: 'Solid Sheet',
        renderPreview: th => (
          <View style={styles.previewRow}>
            <AppPress
              style={[styles.filterPill, { backgroundColor: th.card }]}
              onPress={() => NavigationService.navigate('MyModalScreen')}>
              <Text style={styles.demoItemText}>Mở Cửa Sổ Bottom Sheet →</Text>
            </AppPress>
          </View>
        ),
      },
      {
        id: 'permission-modal',
        name: 'Universal Permission Modal',
        category: 'FEEDBACK',
        path: 'src/libs/permissions/PermissionModal.tsx',
        desc: 'Hộp thoại giải thích lý do xin quyền (Rationale Modal) trước khi kích hoạt prompt native của hệ điều hành.',
        badge: 'System Modal',
        renderPreview: () => (
          <View style={styles.previewRow}>
            <AppButton
              depth={3}
              color="#A855F7"
              onPress={() => {
                showPermissionRationale(DEFAULT_RATIONALE_CONFIGS.camera, () => {
                  handleAction('Đã phê duyệt quyền Camera thành công!');
                });
              }}>
              Mở Modal Xin Quyền Camera
            </AppButton>
          </View>
        ),
      },
      {
        id: 'toast-container',
        name: 'Toast Container',
        category: 'FEEDBACK',
        path: 'src/components/ui/toast/ToastContainer.tsx',
        desc: 'Hệ thống Toast thông báo toàn cục, hỗ trợ success, error, warning và info với zero render lag.',
        badge: 'Global Portal',
        renderPreview: (th, onAct) => (
          <View style={styles.previewRow}>
            <AppButton
              depth={3}
              color={th.info}
              onPress={() => onAct('Đây là Toast thông báo toàn cục!')}>
              Bật Toast Thử Nghiệm
            </AppButton>
          </View>
        ),
      },
      {
        id: 'custom-alert',
        name: 'CustomAlert (Native Modal)',
        category: 'FEEDBACK',
        path: 'src/components/ui/alert/CustomAlert.tsx',
        desc: 'Hộp thoại xác nhận đa phong cách (cancel, destructive, default), phông nền mờ hiện đại.',
        badge: 'High Polish',
        renderPreview: () => (
          <View style={styles.previewRow}>
            <AppButton
              depth={3}
              color="#F59E0B"
              onPress={() => {
                showAlert({
                  title: 'Xác nhận thử nghiệm',
                  content: 'Đây là Alert mẫu trong Component Gallery!',
                  buttons: [
                    { text: 'Đóng', style: 'cancel' },
                    { text: 'Đồng ý', onPress: () => handleAction('Đã nhấn Đồng ý!') },
                  ],
                });
              }}>
              Mở Custom Alert
            </AppButton>
          </View>
        ),
      },
      {
        id: 'global-loading',
        name: 'GlobalLoadingComponent',
        category: 'FEEDBACK',
        path: 'src/components/ui/loading/GlobalLoadingComponent.tsx',
        desc: 'Màn chắn loading mượt mà toàn cục, điều khiển dễ dàng từ bất kỳ đâu qua store.',
        badge: 'Portal Overlay',
        renderPreview: th => (
          <View style={styles.previewRow}>
            <AppButton
              depth={3}
              color={th.primary}
              onPress={() => {
                GlobalLoading.show('Đang tải dữ liệu mẫu (1.5s)...');
                setTimeout(() => {
                  GlobalLoading.hide();
                  handleAction('Đã tải dữ liệu thành công!');
                }, 1500);
              }}>
              Bật Global Loading (1.5s)
            </AppButton>
          </View>
        ),
      },

      // 5. DEVTOOLS & MONITORING
      {
        id: 'requests-inspector',
        name: 'Requests Inspector (Local Lib)',
        category: 'DEVTOOLS',
        path: 'src/libs/requests-inspector/',
        desc: 'Công cụ soi full traffic HTTP/HTTPS trong app, copy cURL, bóc tách Bearer token, search filter nhanh.',
        badge: 'DevTool VIP',
        renderPreview: () => (
          <View style={styles.previewRow}>
            <AppButton
              depth={3}
              color="#0EA5E9"
              onPress={() => useNetworkStore.getState().setModalVisible(true)}>
              Mở In-App Requests Inspector
            </AppButton>
          </View>
        ),
      },
      {
        id: 'dev-hud',
        name: 'FpsHUD & DevHUD',
        category: 'DEVTOOLS',
        path: 'src/components/portals/FpsHUD.tsx',
        desc: 'Widget nổi hợp nhất đo FPS trực tiếp trên UI Thread + hiển thị tốc độ chuyển trang + copy tên màn hình.',
        badge: 'Reanimated 4',
        renderPreview: th => (
          <View style={styles.previewRow}>
            <AppPress
              style={[styles.filterPill, { backgroundColor: th.card }]}
              onPress={() => handleAction('Widget HUD đang chạy ở góc dưới màn hình!')}>
              <Text style={styles.demoItemText}>Widget HUD (Kéo thả tự do trên màn hình)</Text>
            </AppPress>
          </View>
        ),
      },
      {
        id: 'theme-switch',
        name: 'ButtonSwitchTheme',
        category: 'DEVTOOLS',
        path: 'src/components/portals/ButtonSwitchTheme.tsx',
        desc: 'Floating pill chuyển đổi tức thì 3 chế độ: Sáng, Tối và Tự động theo OS.',
        badge: 'Zustand 5',
        renderPreview: th => (
          <View style={styles.previewRow}>
            <AppPress
              style={[styles.filterPill, { backgroundColor: th.card }]}
              onPress={() => handleAction('Nút đổi theme nằm ở góc phải màn hình!')}>
              <Text style={styles.demoItemText}>Nút Theme Floating (Góc phải dưới)</Text>
            </AppPress>
          </View>
        ),
      },
    ],
    [
      styles.filterPill,
      styles.previewRow,
      styles.previewColumn,
      styles.skeletonBox,
      styles.demoItemText,
      styles.rippleLargeBox,
      styles.rippleLargeSubText,
      styles.rippleLargeTitle,
      showAlert,
      handleAction,
    ],
  );

  const filteredComponents = useMemo(() => {
    if (activeCategory === 'ALL') return componentsList;
    return componentsList.filter(item => item.category === activeCategory);
  }, [activeCategory, componentsList]);

  const categories: { key: Category; label: string }[] = useMemo(
    () => [
      { key: 'ALL', label: 'Tất cả' },
      { key: 'BUTTONS', label: 'Nút Bấm' },
      { key: 'INPUTS', label: 'Biểu Mẫu & OTP' },
      { key: 'MEDIA', label: 'Camera & Quét Mã' },
      { key: 'FEEDBACK', label: 'Hộp Thoại & Quyền' },
      { key: 'DEVTOOLS', label: 'Giám Sát & Soi API' },
    ],
    [],
  );

  return (
    <AppScreen edges={[]} backgroundColor={theme.background} statusBarStyle="dark-content">
      <View style={styles.root}>
        {/* Header */}
        <View style={[styles.header, headerPaddingStyle]}>
          <View style={styles.headerTop}>
            <AppPress onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← {t('common.back') || 'Quay lại'}</Text>
            </AppPress>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{filteredComponents.length} COMPONENT</Text>
            </View>
          </View>

          <Text style={styles.title}>Thư Viện Component</Text>
          <Text style={styles.subtitle}>
            Tổng hợp và tra cứu toàn bộ các UI/UX components trong template
          </Text>
        </View>

        {/* Category Filters */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(cat => {
              const isActive = activeCategory === cat.key;
              const count =
                cat.key === 'ALL'
                  ? componentsList.length
                  : componentsList.filter(c => c.category === cat.key).length;

              return (
                <AppPress
                  key={cat.key}
                  onPress={() => setActiveCategory(cat.key)}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}>
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                    {cat.label}
                  </Text>
                  <Text style={[styles.filterCount, isActive && styles.filterCountActive]}>
                    ({count})
                  </Text>
                </AppPress>
              );
            })}
          </ScrollView>
        </View>

        {/* Components List */}
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {filteredComponents.map(item => (
            <View key={item.id} style={styles.componentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.componentName}>{item.name}</Text>
                </View>
                {Boolean(item.badge) && (
                  <View style={styles.badgeZeroLag}>
                    <Text style={styles.badgeZeroLagText}>{item.badge}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.componentPath}>{item.path}</Text>
              <Text style={styles.componentDesc}>{item.desc}</Text>

              {/* Interactive Live Demo */}
              <View style={styles.previewBox}>
                <Text style={styles.previewLabel}>Interactive Demo</Text>
                {item.renderPreview(theme, handleAction)}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </AppScreen>
  );
};

export default memo(ComponentGalleryScreen);
