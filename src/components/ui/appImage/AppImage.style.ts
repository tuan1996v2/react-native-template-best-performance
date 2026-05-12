import { AppTheme } from '@/theme/Colors';
import { fs } from '@/theme/Responsive';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      overflow: 'hidden',
      backgroundColor: theme.background,
    },
    absoluteFull: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    errorContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
    },
    errorText: {
      color: theme.textMuted,
      fontSize: fs(12),
      fontWeight: '500',
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
