import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme/Colors';
import { s, vs, ms, fs } from '@/theme/Responsive';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: vs(110),
      left: s(16),
      zIndex: 99998,
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        theme.mode === 'dark' ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)',
      paddingHorizontal: s(10),
      paddingVertical: vs(5),
      borderRadius: ms(20),
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: vs(2) },
      shadowOpacity: 0.15,
      shadowRadius: ms(6),
      elevation: 5,
    },
    dot: {
      width: s(7),
      height: s(7),
      borderRadius: s(3.5),
      marginRight: s(5),
    },
    fpsInput: {
      fontSize: fs(11),
      fontWeight: '800',
      fontFamily: 'Courier',
      color: theme.text,
      paddingVertical: 0,
      paddingHorizontal: 0,
      includeFontPadding: false,
      minWidth: s(48),
    },
    divider: {
      width: 1,
      height: vs(12),
      backgroundColor: theme.divider,
      marginHorizontal: s(6),
    },
    screenName: {
      fontSize: fs(11),
      fontWeight: '700',
      color: theme.text,
      maxWidth: s(90),
    },
    speedBadge: {
      marginLeft: s(5),
      paddingHorizontal: s(5),
      paddingVertical: vs(1),
      borderRadius: ms(6),
      backgroundColor: theme.inputBg,
    },
    speedText: {
      fontSize: fs(9),
      fontWeight: '800',
      fontFamily: 'Courier',
    },
    colorFast: {
      color: '#10B981',
    },
    colorSlow: {
      color: '#EF4444',
    },
  });
