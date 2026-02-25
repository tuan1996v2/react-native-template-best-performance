import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigationStore } from '../store/useNavigationStore';
import { s, vs, fs } from '../theme/Responsive';
import { useTranslation } from 'react-i18next';

export const NavDebugger = () => {
  const { currentScreen, transitionTime } = useNavigationStore();
  const {t}=useTranslation()
  if (!__DEV__) return null;
  return (
    <View style={styles.debugPanel}>
      <Text style={styles.text}>{t('common.screen')}: {String(currentScreen)}</Text>
      <Text style={[styles.text, { color: transitionTime > 500 ? '#ff6b6b' : '#51cf66' }]}>
        {t('common.speed_switching', { time: transitionTime })}
      </Text>
    </View>
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
  text: { color: 'white', fontSize: fs(12), fontWeight: 'bold' }
});