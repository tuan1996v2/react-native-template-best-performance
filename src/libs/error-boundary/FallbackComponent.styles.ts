import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme/Colors';
import { s, vs, ms, fs } from '@/theme/Responsive';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: s(20),
    },
    card: {
      width: '100%',
      backgroundColor: theme.card,
      borderRadius: ms(20),
      padding: ms(24),
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: vs(8) },
      shadowOpacity: 0.08,
      shadowRadius: ms(16),
      elevation: 6,
    },
    iconContainer: {
      width: s(64),
      height: s(64),
      borderRadius: s(32),
      backgroundColor: theme.error + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: vs(16),
    },
    title: {
      fontSize: fs(20),
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
      marginBottom: vs(8),
    },
    subtitle: {
      fontSize: fs(14),
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: fs(20),
      marginBottom: vs(20),
    },
    errorBox: {
      width: '100%',
      backgroundColor: theme.inputBg,
      borderRadius: ms(12),
      padding: ms(12),
      marginBottom: vs(20),
      maxHeight: vs(160),
    },
    errorMessage: {
      fontSize: fs(13),
      fontFamily: 'Courier',
      color: theme.error,
      fontWeight: '600',
      marginBottom: vs(6),
    },
    stackTrace: {
      fontSize: fs(11),
      fontFamily: 'Courier',
      color: theme.textMuted,
      lineHeight: fs(16),
    },
    buttonGroup: {
      width: '100%',
      gap: vs(12),
    },
    primaryButton: {
      width: '100%',
      height: vs(48),
    },
    secondaryButton: {
      width: '100%',
      paddingVertical: vs(12),
      borderRadius: ms(12),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.inputBg,
    },
    secondaryButtonText: {
      fontSize: fs(14),
      fontWeight: '600',
      color: theme.text,
    },
    copyButtonText: {
      fontSize: fs(13),
      color: theme.primary,
      fontWeight: '600',
    },
  });
