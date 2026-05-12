import { StyleSheet } from 'react-native';
import { ms, s, vs, fs } from '../../../theme/Responsive';
import { AppTheme } from '@/theme/Colors';

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    alertBox: {
      width: s(280),
      backgroundColor: theme.glassBg,
      borderRadius: ms(20),
      overflow: 'hidden',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.glassBorder,
    },
    contentContainer: {
      padding: s(24),
      alignItems: 'center',
    },
    title: {
      fontSize: fs(18),
      fontWeight: '700',
      textAlign: 'center',
      color: theme.text,
    },
    content: {
      marginTop: vs(8),
      textAlign: 'center',
      fontSize: fs(14),
      lineHeight: vs(20),
      color: theme.textSecondary,
    },
    footer: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.divider,
    },
    button: {
      flex: 1,
      height: vs(50),
      justifyContent: 'center',
      alignItems: 'center',
    },
    lastButton: {
      // Add specific styles for the primary action if needed
    },
    buttonPressed: {
      backgroundColor: theme.mode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
    },
    borderRight: {
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: theme.divider,
    },
    btnText: {
      fontSize: fs(16),
      color: theme.info,
      fontWeight: '600',
    },
    cancelBtnText: {
      color: theme.textMuted,
      fontWeight: '400',
    },
  });

export default createStyles;
