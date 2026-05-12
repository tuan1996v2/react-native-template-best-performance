import React, { useCallback, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useNavigationStore } from '../store/useNavigationStore';
import { s, vs, fs } from '../theme/Responsive';
import { useTranslation } from 'react-i18next';
import AppPress from '@/components/ui/appPress/AppPress';
import { IconLanguage } from '@/assets/icon';

export const NavDebugger = () => {
  const { currentScreen, transitionTime } = useNavigationStore();
  const [isShow, setIsShow] = useState(true);
  const { t } = useTranslation();
  const handlePress = useCallback(() => {
    setIsShow(i => !i);
  }, []);
  if (!__DEV__) return null;
  if (!isShow) {
    return (
      <AppPress onPress={handlePress} style={styles.debugPanelHidden}>
        <IconLanguage />
      </AppPress>
    );
  }
  return (
    <AppPress onPress={handlePress} style={styles.debugPanel}>
      <Text style={styles.text}>
        {t('common.screen')}: {String(currentScreen)}
      </Text>
      <Text style={[styles.text, transitionTime > 500 ? styles.colorSlow : styles.colorFast]}>
        {t('common.speed_switching', { time: transitionTime })}
      </Text>
    </AppPress>
  );
};

const styles = StyleSheet.create({
  debugPanel: {
    position: 'absolute',
    top: vs(60),
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: s(10),
    borderRadius: s(8),
    zIndex: 9999,
  },
  debugPanelHidden: {
    position: 'absolute',
    top: vs(60),
    right: 0,
    backgroundColor: 'transparent',
    // backgroundColor: 'red',
    padding: s(10),
    paddingHorizontal: s(20),
    borderRadius: s(8),
    zIndex: 9999,
  },
  text: { color: 'white', fontSize: fs(12), fontWeight: 'bold' },
  colorSlow: { color: '#ff6b6b' },
  colorFast: { color: '#51cf66' },
});
