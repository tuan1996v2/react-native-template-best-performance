import React, { memo, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import AppButton from '../../components/ui/appButton/AppButton';
import { useTranslation } from 'react-i18next';
import { useStyles } from '../../theme/useStyles';
import createStyles from './MyModalScreen.styles';
import NavigationService from '@/navigation/NavigationService';
import { IconSocial } from '@/assets/icon';

const MyModalScreen = () => {
  const styles = useStyles(createStyles);
  const { t } = useTranslation();

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
            <IconSocial fill="#6366F1" width={48} height={48} />
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
              color="#6366F1"
              bottomColor="#4F46E5"
              depth={6}
              style={styles.primaryButton}>
              {t('common.confirm') || 'Xác nhận'}
            </AppButton>

            <AppButton
              onPress={handleClose}
              color="rgba(241, 245, 249, 0.8)"
              bottomColor="rgba(203, 213, 225, 0.8)"
              textStyle={styles.secondaryButtonText}
              depth={4}
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
