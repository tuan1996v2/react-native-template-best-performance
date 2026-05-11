import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '../screen/QrScanScreen.styles';
import AppButton from '@/components/ui/appButton/AppButton';

interface ScannerControlsProps {
  isScanning: boolean;
  flashEnabled: boolean;
  onToggleScan: () => void;
  onToggleFlash: () => void;
  onReleaseCamera: () => void;
  onPickImage: () => void;
}

export const ScannerControls: React.FC<ScannerControlsProps> = ({
  isScanning,
  flashEnabled,
  onToggleScan,
  onToggleFlash,
  onReleaseCamera,
  onPickImage,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.controls}>
      <AppButton onPress={onToggleScan}>
        {isScanning ? t('qr_scan.stop_scan') : t('qr_scan.start_scan')}
      </AppButton>

      {isScanning && (
        <AppButton onPress={onToggleFlash}>
          {flashEnabled ? t('qr_scan.flash_on') : t('qr_scan.flash_off')}
        </AppButton>
      )}

      <AppButton onPress={onReleaseCamera}>{t('qr_scan.release_camera')}</AppButton>

      <AppButton onPress={onPickImage}>{t('qr_scan.scan_gallery')}</AppButton>
    </View>
  );
};
