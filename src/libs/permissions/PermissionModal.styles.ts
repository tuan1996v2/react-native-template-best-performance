import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme/Colors';
import { s, vs, ms, fs } from '@/theme/Responsive';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      justifyContent: 'flex-end',
      zIndex: 99990,
    },
    sheet: {
      backgroundColor: theme.card,
      borderTopLeftRadius: ms(24),
      borderTopRightRadius: ms(24),
      paddingTop: vs(16),
      paddingHorizontal: s(24),
      paddingBottom: vs(34),
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
    },
    handle: {
      width: s(40),
      height: vs(4),
      borderRadius: ms(2),
      backgroundColor: theme.textMuted + '40',
      marginBottom: vs(20),
    },
    iconWrapper: {
      width: s(64),
      height: s(64),
      borderRadius: s(32),
      backgroundColor: theme.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: vs(16),
    },
    title: {
      fontSize: fs(18),
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
      marginBottom: vs(8),
    },
    description: {
      fontSize: fs(14),
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: fs(21),
      marginBottom: vs(24),
    },
    buttonContainer: {
      width: '100%',
      gap: vs(12),
    },
    confirmButton: {
      width: '100%',
      height: vs(48),
    },
    cancelButton: {
      width: '100%',
      paddingVertical: vs(12),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: ms(12),
      backgroundColor: theme.inputBg,
    },
    cancelButtonText: {
      fontSize: fs(14),
      fontWeight: '600',
      color: theme.textSecondary,
    },
  });
