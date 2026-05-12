import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useQrScanner } from '../hooks/useQrScanner';
import createStyles from './QrScanScreen.styles';
import { useStyles } from '@/theme/useStyles';
import { PermissionView } from '../components/PermissionView';
import { ScannerHeader } from '../components/ScannerHeader';
import { CameraViewfinder } from '@/components/ui/cameraViewfinder/CameraViewfinder';
import { ScannerControls } from '../components/ScannerControls';
import { ScanResult } from '../components/ScanResult';
import { ScanHistory } from '../components/ScanHistory';

export default function QrScanScreen() {
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const {
    isCameraPermissionGranted,
    isScanning,
    scannedData,
    flashEnabled,
    scanHistory,
    startScanning,
    stopScanning,
    toggleFlashlight,
    releaseCamera,
    pickImage,
    clearHistory,
    checkCameraPermission,
  } = useQrScanner();

  if (!isCameraPermissionGranted) {
    return (
      <SafeAreaView style={styles.container}>
        <PermissionView onGrant={checkCameraPermission} />
      </SafeAreaView>
    );
  }

  return (
    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={styles.container}>
      <ScannerHeader isScanning={isScanning} />

      <CameraViewfinder isScanning={isScanning} />

      <ScannerControls
        isScanning={isScanning}
        flashEnabled={flashEnabled}
        onToggleScan={isScanning ? stopScanning : startScanning}
        onToggleFlash={toggleFlashlight}
        onReleaseCamera={releaseCamera}
        onPickImage={pickImage}
      />

      <ScanResult scannedData={scannedData} />

      <ScanHistory scanHistory={scanHistory} onClear={clearHistory} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('qr_scan.footer_hint')}</Text>
      </View>
    </ScrollView>
  );
}
