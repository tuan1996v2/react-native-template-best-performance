import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Clipboard } from 'react-native';
import { useStyles } from '@/theme/useStyles';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';
import AppButton from '@/components/ui/appButton/AppButton';
import { toast } from '@/components/ui/alert/useAlertStore';
import NavigationService from '@/navigation/NavigationService';
import IconAlert from '@/assets/icon/IconAlert';
import { FallbackProps } from './types';
import { createStyles } from './FallbackComponent.styles';
import { s } from '@/theme/Responsive';

const FallbackComponent: React.FC<FallbackProps> = ({ error, resetError, stackTrace }) => {
  const styles = useStyles(createStyles);
  const mode = useThemeStore(state => state.mode);
  const currentTheme = ThemeTokens[mode] || ThemeTokens.light;
  const [showDetails, setShowDetails] = useState(false);

  const handleCopy = useCallback(() => {
    const errorDetails = `[CRASH REPORT]\nError: ${error.name}: ${error.message}\n\nStack:\n${
      stackTrace || error.stack || 'No stack trace available'
    }`;
    if (Clipboard && typeof Clipboard.setString === 'function') {
      Clipboard.setString(errorDetails);
    }
    toast.success('Đã sao chép chi tiết lỗi vào bộ nhớ tạm!');
  }, [error, stackTrace]);

  const handleGoHome = useCallback(() => {
    resetError();
    try {
      NavigationService.navigate('HomeScreen');
    } catch {
      // Ignore if navigation is not ready
    }
  }, [resetError]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <IconAlert width={s(32)} height={s(32)} fill={currentTheme.error} />
        </View>

        <Text style={styles.title}>Đã xảy ra lỗi không mong muốn</Text>
        <Text style={styles.subtitle}>
          Rất tiếc vì sự cố này! Chúng tôi đã ghi nhận mã lỗi để xử lý. Bạn có thể thử lại hoặc quay
          về trang chủ.
        </Text>

        <View style={styles.errorBox}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
            <Text style={styles.errorMessage}>
              {error.name}: {error.message}
            </Text>
            {showDetails && (
              <Text style={styles.stackTrace}>
                {stackTrace || error.stack || 'Không có stack trace'}
              </Text>
            )}
          </ScrollView>
        </View>

        <View style={styles.buttonGroup}>
          <AppButton
            title="Thử lại"
            onPress={resetError}
            color={currentTheme.primary}
            style={styles.primaryButton}
          />

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGoHome}
            activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>Quay về trang chủ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setShowDetails(prev => !prev)}
            activeOpacity={0.8}>
            <Text style={styles.copyButtonText}>
              {showDetails ? 'Ẩn chi tiết stack trace' : 'Xem chi tiết stack trace'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleCopy} activeOpacity={0.8}>
            <Text style={styles.copyButtonText}>Sao chép mã lỗi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(FallbackComponent);
