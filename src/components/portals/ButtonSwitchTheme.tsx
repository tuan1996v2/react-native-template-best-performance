import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import AppPress from '@/components/ui/appPress/AppPress';
import { s, vs } from '@/theme/Responsive';
import { useThemeStore } from '@/store/useThemeStore';
import { useAlertStore } from '../ui/alert/useAlertStore';
import { IconTheme } from '@/assets/icon';

export const ButtonSwitchTheme = () => {
  const mode = useThemeStore(state => state.mode);
  const setMode = useThemeStore(state => state.setMode);
  const showToast = useAlertStore(state => state.showToast);

  const handleToggleTheme = useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    showToast(
      newMode === 'dark' ? 'Switched to Dark Mode 🌙' : 'Switched to Light Mode ☀️',
      'success',
    );
  }, [mode, setMode, showToast]);
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
