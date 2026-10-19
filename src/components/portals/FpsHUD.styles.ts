import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme/Colors';
import { s, vs, ms, fs } from '@/theme/Responsive';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: vs(60),
      left: s(16),
      zIndex: 99998,
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        theme.mode === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
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
      width: s(8),
      height: s(8),
      borderRadius: s(4),
      marginRight: s(6),
    },
    fpsInput: {
      fontSize: fs(12),
      fontWeight: '700',
      fontFamily: 'Courier',
      color: theme.text,
      paddingVertical: 0,
      paddingHorizontal: 0,
      includeFontPadding: false,
      minWidth: s(50),
    },
    label: {
      fontSize: fs(10),
      fontWeight: '600',
      color: theme.textSecondary,
      marginLeft: s(2),
    },
  });
