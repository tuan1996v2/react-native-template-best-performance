import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme/Colors';
import { s, vs, ms, fs } from '@/theme/Responsive';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      position: 'absolute',
      bottom: vs(70),
      right: s(16),
      zIndex: 99999,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(6),
      paddingVertical: vs(5),
      paddingLeft: s(6),
      paddingRight: s(10),
      borderRadius: ms(20),
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor:
        theme.mode === 'dark' ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: vs(3) },
      shadowOpacity: 0.15,
      shadowRadius: ms(8),
      elevation: 6,
    },
    iconWrapper: {
      width: s(24),
      height: s(24),
      borderRadius: s(12),
      backgroundColor: theme.primary + '18',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modeText: {
      fontSize: fs(10),
      fontWeight: '800',
      color: theme.text,
      letterSpacing: 0.6,
    },
  });
