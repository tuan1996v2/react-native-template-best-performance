import React from 'react';
import { View, Text, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '../screen/QrScanScreen.styles';

interface PermissionViewProps {
  onGrant: () => void;
}

export const PermissionView: React.FC<PermissionViewProps> = ({ onGrant }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.permissionContainer}>
      <Text style={styles.permissionText}>{t('qr_scan.permission_required')}</Text>
      <Text style={styles.permissionSubtext}>{t('qr_scan.permission_subtext')}</Text>
      <Button title={t('qr_scan.grant_permission')} onPress={onGrant} color="#007AFF" />
    </View>
  );
};
