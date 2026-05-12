import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { type BarcodeResult } from '@pushpendersingh/react-native-scanner';
import createStyles from '../screen/QrScanScreen.styles';
import { useStyles } from '@/theme/useStyles';

interface ScanResultProps {
  scannedData: BarcodeResult | null;
}

export const ScanResult: React.FC<ScanResultProps> = ({ scannedData }) => {
  const styles = useStyles(createStyles);
  const { t } = useTranslation();

  if (!scannedData) return null;

  return (
    <View style={styles.result}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>{t('qr_scan.last_scanned')}</Text>
      </View>
      <View style={styles.resultContent}>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>{t('qr_scan.type')}</Text>
          <Text style={styles.resultValue}>{scannedData.type}</Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>{t('qr_scan.data')}</Text>
          <Text style={styles.resultValue} numberOfLines={3}>
            {scannedData.data}
          </Text>
        </View>
        {scannedData.bounds && (
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{t('qr_scan.size')}</Text>
            <Text style={styles.resultValue}>
              {scannedData.bounds.width.toFixed(0)} x {scannedData.bounds.height.toFixed(0)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
