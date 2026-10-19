import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AppButton from '@/components/ui/appButton/AppButton';
import { useStyles } from '@/theme/useStyles';
import createStyles from './MyModalScreen.styles';
import NavigationService from '@/navigation/NavigationService';
import { IconModal } from '@/assets/icon';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';
import { s, vs } from '@/theme/Responsive';

const MyModalScreen = () => {
  const styles = useStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const mode = useThemeStore(state => state.mode);
  const theme = ThemeTokens[mode] || ThemeTokens.light;

  const handleClose = useCallback(() => {
    NavigationService.back();
  }, []);

  const sheetDynamicStyle = useMemo(
    () => [styles.sheet, { paddingBottom: Math.max(insets.bottom + vs(16), vs(28)) }],
    [styles.sheet, insets.bottom],
  );

  return (
    <View style={styles.backdrop}>
      {/* Tap outside to dismiss modal */}
      <Pressable style={styles.dismissArea} onPress={handleClose} />

      {/* Solid Opaque Bottom Sheet */}
      <View style={sheetDynamicStyle}>
        <View style={styles.grabber} />

        <View style={styles.iconWrapper}>
          <IconModal width={s(28)} height={s(28)} fill={theme.primary} />
        </View>

        <Text style={styles.title}>{t('common.confirm_title')}</Text>
        <Text style={styles.subtitle}>{t('common.confirm_message')}</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            • <Text style={styles.highlightText}>Solid & Opaque:</Text> Nền card đặc sắc nét, không
            bị mờ đục hay lem văn bản nền.
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.highlightText}>Tap Outside:</Text> Chạm vùng tối bên ngoài để đóng
            nhanh tức thì.
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.highlightText}>Zero Re-render:</Text> Hiệu năng phản hồi mượt mà,
            chuẩn Best Performance.
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <AppButton
            onPress={handleClose}
            color={theme.primary}
            bottomColor={theme.primary + 'CC'}
            depth={4}
            style={styles.primaryButton}>
            {t('common.confirm') || 'Đã hiểu'}
          </AppButton>

          <Pressable onPress={handleClose} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>{t('common.close') || 'Đóng lại'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default memo(MyModalScreen);
