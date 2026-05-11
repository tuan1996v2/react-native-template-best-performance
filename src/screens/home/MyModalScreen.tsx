import React, { memo, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import AppButton from '../../components/ui/appButton/AppButton';
import { useIntlayer } from 'react-intlayer';
import { useStyles } from '../../theme/useStyles';
import createStyles from './MyModalScreen.styles';
import NavigationService from '@/navigation/NavigationService';

const MyModalScreen = () => {
  const styles = useStyles(createStyles);
  const { content } = useIntlayer('main');

  const handleClose = useCallback(() => {
    NavigationService.back();
  }, []);

  return (
    <AppScreen edges={['bottom']} backgroundColor="transparent">
      {/* Thanh gạt giả lập (Grabber) cho cảm giác Modal xịn */}
      <View style={styles.grabber} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{content.common.confirm_title}</Text>

        <View style={styles.card}>
          <Text style={styles.description}>
            Đây là nội dung hiển thị bên trong Modal. Mọi thứ đã được tối ưu hiệu năng bằng
            useStyles và React.memo. Bạn có thể vuốt xuống để đóng Modal này trên iOS.
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <AppButton
            onPress={handleClose}
            color="#e74c3c"
            bottomColor="#c0392b"
            depth={6}
            style={styles.button}>
            {content.common.close}
          </AppButton>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

export default memo(MyModalScreen);
