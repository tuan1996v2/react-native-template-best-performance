import React, { memo, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import AppButton from '../../components/ui/appButton/AppButton';
import { useTranslation } from 'react-i18next';
import { useStyles } from '../../theme/useStyles';
import createStyles from './MyModalScreen.styles';
import NavigationService from '@/navigation/NavigationService';
import { IconSocial } from '@/assets/icon';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';

const MyModalScreen = () => {
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const mode = useThemeStore(state => state.mode);
  const theme = ThemeTokens[mode];

  const handleClose = useCallback(() => {
    NavigationService.back();
  }, []);

  return (
    <AppScreen edges={['bottom']} backgroundColor="transparent">
      <View style={styles.container}>
        {/* Thanh gạt giả lập (Grabber) cho cảm giác Modal xịn */}
        <View style={styles.grabber} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.iconWrapper}>
            <IconSocial fill={theme.primary} width={48} height={48} />
          </View>

          <Text style={styles.subtitle}>System Update</Text>
          <Text style={styles.title}>{t('common.confirm_title') || 'Thông báo hệ thống'}</Text>

          <View style={styles.card}>
            <Text style={styles.description}>
              Giao diện Modal đã được nâng cấp lên chuẩn **iOS 26** với phong cách Glassmorphism.
              Mọi tương tác đều được tối ưu hóa để mang lại cảm giác mượt mà và cao cấp nhất.
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <AppButton
              onPress={handleClose}
              color={theme.primary}
              bottomColor={theme.primary + 'CC'}
              depth={6}
              style={styles.primaryButton}>
              {t('common.confirm') || 'Xác nhận'}
            </AppButton>

            <AppButton
              onPress={handleClose}
              color={theme.mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}
              bottomColor="transparent"
              textStyle={styles.secondaryButtonText}
              depth={0}
              style={styles.secondaryButton}>
              {t('common.close') || 'Để sau'}
            </AppButton>
          </View>
        </ScrollView>
      </View>
    </AppScreen>
  );
};

export default memo(MyModalScreen);
