import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useStyles } from '@/theme/useStyles';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';
import AppButton from '@/components/ui/appButton/AppButton';
import { IconAlert, IconNotification } from '@/assets/icon';
import { s } from '@/theme/Responsive';
import { PermissionModalRef, PermissionRationaleConfig } from './types';
import { createStyles } from './PermissionModal.styles';

export const PermissionModal = forwardRef<PermissionModalRef>((_, ref) => {
  const styles = useStyles(createStyles);
  const mode = useThemeStore(state => state.mode);
  const currentTheme = ThemeTokens[mode] || ThemeTokens.light;

  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<PermissionRationaleConfig | null>(null);
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);
  const [cancelCallback, setCancelCallback] = useState<(() => void) | null>(null);

  const translateY = useSharedValue(500);
  const backdropOpacity = useSharedValue(0);

  const hideModal = useCallback(() => {
    translateY.value = withTiming(500, { duration: 250 });
    backdropOpacity.value = withTiming(0, { duration: 200 }, isFinished => {
      if (isFinished) {
        runOnJS(setVisible)(false);
      }
    });
  }, [translateY, backdropOpacity]);

  useImperativeHandle(
    ref,
    () => ({
      show: (newConfig, onConfirm, onCancel) => {
        setConfig(newConfig);
        setConfirmCallback(() => onConfirm);
        if (onCancel) {
          setCancelCallback(() => onCancel);
        }
        setVisible(true);
        backdropOpacity.value = withTiming(1, { duration: 200 });
        translateY.value = withSpring(0, { damping: 18, stiffness: 120 });
      },
      hide: hideModal,
    }),
    [hideModal, backdropOpacity, translateY],
  );

  const handleConfirm = useCallback(() => {
    hideModal();
    if (confirmCallback) {
      confirmCallback();
    }
  }, [hideModal, confirmCallback]);

  const handleCancel = useCallback(() => {
    hideModal();
    if (cancelCallback) {
      cancelCallback();
    }
  }, [hideModal, cancelCallback]);

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!visible || !config) {
    return null;
  }

  const renderIcon = () => {
    if (config.icon) {
      return config.icon;
    }
    if (config.type === 'notification') {
      return <IconNotification width={s(32)} height={s(32)} fill={currentTheme.primary} />;
    }
    return <IconAlert width={s(32)} height={s(32)} fill={currentTheme.primary} />;
  };

  return (
    <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={handleCancel} />
      <Animated.View style={[styles.sheet, animatedSheetStyle]}>
        <View style={styles.handle} />
        <View style={styles.iconWrapper}>{renderIcon()}</View>

        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.description}>{config.description}</Text>

        <View style={styles.buttonContainer}>
          <AppButton
            title={config.confirmText || 'Tiếp tục'}
            onPress={handleConfirm}
            color={currentTheme.primary}
            style={styles.confirmButton}
          />

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.8}>
            <Text style={styles.cancelButtonText}>{config.cancelText || 'Để sau'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
});

PermissionModal.displayName = 'PermissionModal';

export default React.memo(PermissionModal);
