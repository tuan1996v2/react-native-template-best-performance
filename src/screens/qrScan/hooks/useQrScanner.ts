import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import BarcodeScanner, { type BarcodeResult } from '@pushpendersingh/react-native-scanner';
import { launchImageLibrary } from 'react-native-image-picker';

export const useQrScanner = () => {
  const { t } = useTranslation();
  const [isCameraPermissionGranted, setIsCameraPermissionGranted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<BarcodeResult | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scanHistory, setScanHistory] = useState<BarcodeResult[]>([]);

  const checkCameraPermission = useCallback(async () => {
    try {
      const hasPermission = await BarcodeScanner.hasCameraPermission();
      if (hasPermission) {
        setIsCameraPermissionGranted(true);
        return;
      }

      const granted = await BarcodeScanner.requestCameraPermission();
      if (granted) {
        setIsCameraPermissionGranted(true);
        Alert.alert(t('common.success'), t('qr_scan.messages.permission_granted'));
      } else {
        setIsCameraPermissionGranted(false);
        Alert.alert(
          t('qr_scan.messages.permission_denied_title'),
          t('qr_scan.messages.permission_denied_msg'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('qr_scan.messages.try_again'), onPress: checkCameraPermission },
          ],
        );
      }
    } catch (error) {
      console.error('Error checking camera permission:', error);
      Alert.alert('Error', 'Failed to check camera permission');
    }
  }, [t]);

  const handleBarcodeScanned = useCallback((results: BarcodeResult[]) => {
    console.log('Barcode / QR Code scanned:', results);
    if (results.length > 0) {
      const firstResult = results[0];
      setScannedData(firstResult ?? null);
      setScanHistory(
        prev => [firstResult, ...prev].filter(Boolean).slice(0, 20) as BarcodeResult[],
      );
      stopScanning();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanning = useCallback(async () => {
    try {
      await BarcodeScanner.startScanning(handleBarcodeScanned);
      setIsScanning(true);
      console.log('Scanning started');
    } catch (error) {
      console.error('Error starting scanner:', error);
      Alert.alert('Error', error.message || 'Failed to start scanning');
    }
  }, [handleBarcodeScanned]);

  const stopScanning = useCallback(async () => {
    try {
      await BarcodeScanner.stopScanning();
      setIsScanning(false);
      console.log('Scanning stopped');
    } catch (error) {
      console.error('Error stopping scanner:', error);
    }
  }, []);

  const toggleFlashlight = useCallback(async () => {
    try {
      if (flashEnabled) {
        await BarcodeScanner.disableFlashlight();
        setFlashEnabled(false);
        console.log('Flashlight disabled');
      } else {
        await BarcodeScanner.enableFlashlight();
        setFlashEnabled(true);
        console.log('Flashlight enabled');
      }
    } catch (error) {
      console.error('Error toggling flashlight:', error);
      Alert.alert('Error', 'Could not toggle flashlight');
    }
  }, [flashEnabled]);

  const releaseCamera = useCallback(async () => {
    try {
      await BarcodeScanner.releaseCamera();
      setIsScanning(false);
      setFlashEnabled(false);
      console.log('Camera released');
    } catch (error) {
      console.error('Error releasing camera:', error);
    }
  }, []);

  const pickImage = useCallback(async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorMessage) {
        console.error('ImagePicker Error: ', result.errorMessage);
        Alert.alert('Error', result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset && asset.uri) {
          console.log('Scanning image:', asset.uri);
          try {
            const barcodes = await BarcodeScanner.scanImage(asset.uri);
            handleBarcodeScanned(barcodes);
            if (barcodes.length === 0) {
              Alert.alert(t('qr_scan.messages.no_qr_found'), t('qr_scan.messages.no_qr_found_msg'));
            }
          } catch (e) {
            console.error('Scan Error:', e);
            Alert.alert('Error', t('qr_scan.messages.scan_error'));
          }
        }
      }
    } catch (e) {
      console.error('Pick Image Error:', e);
    }
  }, [handleBarcodeScanned, t]);

  const clearHistory = useCallback(() => {
    console.log('clear history', scanHistory);
    setScanHistory([]);
    setScannedData(null);
  }, [scanHistory]);

  useEffect(() => {
    checkCameraPermission();
    return () => {
      if (isScanning) {
        BarcodeScanner.stopScanning();
      }
    };
  }, [checkCameraPermission, isScanning]);

  return {
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
  };
};
