import { StyleSheet } from 'react-native';
import { s, vs, ms, fs } from '@/theme/Responsive';
import { AppTheme } from '@/theme/Colors';

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dismissArea: {
      flex: 1,
    },
    sheet: {
      backgroundColor: theme.card,
      borderTopLeftRadius: ms(24),
      borderTopRightRadius: ms(24),
      paddingTop: vs(12),
      paddingHorizontal: s(24),
      borderTopWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: theme.mode === 'light' ? 0.08 : 0.3,
      shadowRadius: 16,
      elevation: 12,
    },
    grabber: {
      width: s(36),
      height: vs(4),
      backgroundColor: theme.textMuted + '40',
      borderRadius: ms(2),
      marginBottom: vs(16),
    },
    iconWrapper: {
      width: s(56),
      height: s(56),
      borderRadius: s(28),
      backgroundColor: theme.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: vs(12),
    },
    title: {
      fontSize: fs(19),
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    subtitle: {
      fontSize: fs(13),
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: vs(4),
      marginBottom: vs(16),
    },
    infoCard: {
      width: '100%',
      backgroundColor: theme.inputBg,
      borderRadius: ms(14),
      padding: s(16),
      gap: vs(8),
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: vs(20),
    },
    infoText: {
      fontSize: fs(13),
      lineHeight: vs(18),
      color: theme.textSecondary,
    },
    highlightText: {
      fontWeight: '600',
      color: theme.text,
    },
    buttonGroup: {
      width: '100%',
      gap: vs(10),
    },
    primaryButton: {
      width: '100%',
      height: vs(48),
      borderRadius: ms(14),
    },
    secondaryButton: {
      width: '100%',
      height: vs(40),
      justifyContent: 'center',
      alignItems: 'center',
    },
    secondaryButtonText: {
      fontSize: fs(14),
      fontWeight: '600',
      color: theme.textSecondary,
    },
  });

export default createStyles;
