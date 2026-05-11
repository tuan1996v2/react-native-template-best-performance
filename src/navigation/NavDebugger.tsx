import { View, Text, StyleSheet } from 'react-native';
import { useIntlayer } from 'react-intlayer';
import { useNavigationStore } from '../store/useNavigationStore';
import { s, vs, fs } from '../theme/Responsive';

export const NavDebugger = () => {
  const { currentScreen, transitionTime } = useNavigationStore();
  const { content } = useIntlayer('main');
  if (!__DEV__) return null;
  return (
    <View style={styles.debugPanel}>
      <Text style={styles.text}>
        {content.common.screen}: {String(currentScreen)}
      </Text>
      <Text style={[styles.text, transitionTime > 500 ? styles.colorSlow : styles.colorFast]}>
        {content.common.speed_switching(String(transitionTime))}
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
  text: { color: 'white', fontSize: fs(12), fontWeight: 'bold' },
  colorSlow: { color: '#ff6b6b' },
  colorFast: { color: '#51cf66' },
});
