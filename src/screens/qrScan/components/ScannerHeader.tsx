import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../screen/QrScanScreen.styles';

interface ScannerHeaderProps {
  isScanning: boolean;
}

export const ScannerHeader: React.FC<ScannerHeaderProps> = ({ isScanning }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" translucent />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>{t('qr_scan.title')}</Text>
        <View style={styles.headerSubtitle}>
          <View
            style={[
              styles.statusDot,
              isScanning ? styles.statusDotScanning : styles.statusDotReady,
            ]}
          />
          <Text style={styles.statusTextHeader}>
            {isScanning ? t('qr_scan.scanning') : t('qr_scan.ready')}
          </Text>
        </View>
      </View>
    </>
  );
};
