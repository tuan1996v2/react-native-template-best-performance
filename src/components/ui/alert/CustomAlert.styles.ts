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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertBox: {
      width: s(290),
      backgroundColor: theme.card,
      borderRadius: ms(16),
      overflow: 'hidden',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: theme.mode === 'light' ? 0.12 : 0.35,
      shadowRadius: 16,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    contentContainer: {
      paddingHorizontal: s(20),
      paddingTop: vs(22),
      paddingBottom: vs(18),
      alignItems: 'center',
    },
    title: {
      fontSize: fs(17),
      fontWeight: '700',
      textAlign: 'center',
      color: theme.text,
      letterSpacing: -0.3,
    },
    content: {
      marginTop: vs(8),
      textAlign: 'center',
      fontSize: fs(13),
      lineHeight: vs(18),
      color: theme.textSecondary,
      paddingHorizontal: s(4),
    },
    footer: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.divider,
      height: vs(48),
    },
    button: {
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    lastButton: {},
    buttonPressed: {
      backgroundColor: theme.mode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)',
    },
    borderRight: {
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: theme.divider,
    },
    btnText: {
      fontSize: fs(16),
      color: theme.primary,
      fontWeight: '600',
    },
    cancelBtnText: {
      color: theme.textSecondary,
      fontWeight: '400',
    },
    destructiveBtnText: {
      color: theme.error,
      fontWeight: '600',
    },
  });

export default createStyles;
