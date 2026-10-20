import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import AppPress from '@/components/ui/appPress/AppPress';
import { s } from '@/theme/Responsive';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';
import { useAlertStore } from '../ui/alert/useAlertStore';
import { IconTheme } from '@/assets/icon';

import { useStyles } from '@/theme/useStyles';
import { createStyles } from './ButtonSwitchTheme.styles';

export const ButtonSwitchTheme = () => {
  const styles = useStyles(createStyles);
  const mode = useThemeStore(state => state.mode);
  const themePreference = useThemeStore(state => state.themePreference);
  const setThemePreference = useThemeStore(state => state.setThemePreference);
  const showToast = useAlertStore(state => state.showToast);

  const theme = ThemeTokens[mode] || ThemeTokens.light;

  const handleToggleTheme = useCallback(() => {
    let nextPref: 'light' | 'dark' | 'system';
    let message: string;

    if (themePreference === 'light') {
      nextPref = 'dark';
      message = 'Chế độ Tối (Dark)';
    } else if (themePreference === 'dark') {
      nextPref = 'system';
      message = 'Chế độ Tự động (Hệ thống)';
    } else {
      nextPref = 'light';
      message = 'Chế độ Sáng (Light)';
    }

    setThemePreference(nextPref);
    showToast(message, 'success');
  }, [themePreference, setThemePreference, showToast]);

  const modeLabel =
    themePreference === 'system' ? 'AUTO' : themePreference === 'dark' ? 'DARK' : 'LIGHT';

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <AppPress
        style={styles.container}
        rippleColor={theme.primary + '33'}
        onPress={handleToggleTheme}>
        <View style={styles.iconWrapper}>
          <IconTheme width={s(15)} height={s(15)} fill={theme.primary} />
        </View>
        <Text style={styles.modeText}>{modeLabel}</Text>
      </AppPress>
    </View>
  );
};
