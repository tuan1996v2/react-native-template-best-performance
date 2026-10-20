import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import AppPress from '@/components/ui/appPress/AppPress';
import { s, vs } from '@/theme/Responsive';
import { useThemeStore } from '@/store/useThemeStore';
import { useAlertStore } from '../ui/alert/useAlertStore';
import { IconTheme } from '@/assets/icon';

export const ButtonSwitchTheme = () => {
  const themePreference = useThemeStore(state => state.themePreference);
  const setThemePreference = useThemeStore(state => state.setThemePreference);
  const showToast = useAlertStore(state => state.showToast);

  const handleToggleTheme = useCallback(() => {
    let nextPref: 'light' | 'dark' | 'system';
    let message: string;

    if (themePreference === 'light') {
      nextPref = 'dark';
      message = 'Chế độ Tối';
    } else if (themePreference === 'dark') {
      nextPref = 'system';
      message = 'Chế độ Tự động theo Hệ thống';
    } else {
      nextPref = 'light';
      message = 'Chế độ Sáng';
    }

    setThemePreference(nextPref);
    showToast(message, 'success');
  }, [themePreference, setThemePreference, showToast]);
  return (
    <AppPress style={styles.container} onPress={handleToggleTheme}>
      <IconTheme />
    </AppPress>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: vs(60),
    right: s(0),
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: s(10),
    borderRadius: s(8),
    zIndex: 9999,
  },
});
