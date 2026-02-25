import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../components/ui/appButton/AppButton'; 
import { useTranslation } from 'react-i18next';
import { useStyles } from '../../theme/useStyles';
import { AppTheme } from '../../theme/Colors';
import createStyles from './MyModalScreen.styles';

const MyModalScreen = () => {
  const navigation = useNavigation();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <AppScreen edges={['bottom']} backgroundColor="transparent">
      {/* Thanh gạt giả lập (Grabber) cho cảm giác Modal xịn */}
      <View style={styles.grabber} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('common.confirm_title') || 'Thông báo hệ thống'}</Text>
        
        <View style={styles.card}>
          <Text style={styles.description}>
            Đây là nội dung hiển thị bên trong Modal. 
            Mọi thứ đã được tối ưu hiệu năng bằng useStyles và React.memo.
            Bạn có thể vuốt xuống để đóng Modal này trên iOS.
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <AppButton
            onPress={handleClose}
            color="#e74c3c"
            bottomColor="#c0392b"
            depth={6}
            style={styles.button}
          >
            {t('common.close') || 'Đóng lại'}
          </AppButton>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

export default memo(MyModalScreen);