import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { type BarcodeResult } from '@pushpendersingh/react-native-scanner';
import { styles } from '../screen/QrScanScreen.styles';

interface ScanHistoryProps {
  scanHistory: BarcodeResult[];
  onClear: () => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({ scanHistory, onClear }) => {
  const { t } = useTranslation();

  if (scanHistory.length === 0) return null;

  return (
    <View style={styles.history}>
      <View style={styles.resultHeader}>
        <Text style={styles.historyTitle}>{t('qr_scan.history')}</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearButton}>{t('qr_scan.clear')}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        style={styles.historyList}>
        {scanHistory.map((item, index) => (
          <View key={`${item.data}-${index}`} style={styles.historyItem}>
            <Text style={styles.historyType}>{item.type}</Text>
            <Text style={styles.historyData} numberOfLines={1}>
              {item.data}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
