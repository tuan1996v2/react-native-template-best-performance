import { StyleSheet } from 'react-native';
import { s, vs, fs, ms } from '@/theme/Responsive';
import { AppTheme } from '@/theme/Colors';

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: s(20),
      paddingTop: vs(20),
      paddingBottom: vs(16),
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    title: {
      fontSize: fs(28),
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: vs(4),
    },
    subtitle: {
      fontSize: fs(15),
      color: theme.textSecondary,
      lineHeight: vs(22),
    },
    row: {
      flexDirection: 'row',
    },
    justifyCenter: {
      justifyContent: 'center',
      paddingHorizontal: s(16),
    },
    scrollContent: {
      paddingBottom: vs(40),
    },
    section: {
      marginTop: vs(24),
      marginHorizontal: s(16),
      backgroundColor: theme.card,
      borderRadius: ms(20),
      padding: s(16),
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
    },
    sectionHeader: {
      marginBottom: vs(16),
    },
    sectionTitle: {
      fontSize: fs(18),
      fontWeight: '700',
      color: theme.text,
      marginBottom: vs(4),
    },
    sectionDesc: {
      fontSize: fs(13),
      color: theme.textSecondary,
    },
    otpWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: vs(10),
    },

    // --- Stripe Style ---
    stripeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stripeSlot: {
      width: s(42),
      height: vs(52),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    stripeSlotFirst: {
      borderTopLeftRadius: ms(8),
      borderBottomLeftRadius: ms(8),
    },
    stripeSlotLast: {
      borderTopRightRadius: ms(8),
      borderBottomRightRadius: ms(8),
    },
    stripeActiveSlot: {
      backgroundColor: theme.card,
      borderColor: theme.primary,
      borderWidth: 2,
      zIndex: 1,
    },
    stripeChar: {
      fontSize: fs(22),
      fontWeight: '600',
      color: theme.text,
    },
    stripeDash: {
      width: s(12),
      height: vs(2),
      backgroundColor: theme.divider,
      marginHorizontal: s(8),
      borderRadius: 1,
    },

    // --- Apple Style ---
    appleSlot: {
      width: s(44),
      height: vs(56),
      borderRadius: ms(12),
      backgroundColor: theme.card,
      borderWidth: 1.5,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: s(3),
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 2,
    },
    appleActiveSlot: {
      borderColor: theme.primary,
      backgroundColor: theme.actionBg,
    },
    appleChar: {
      fontSize: fs(24),
      fontWeight: '700',
      color: theme.text,
    },

    // --- Dashed Style ---
    dashedSlot: {
      width: s(40),
      height: vs(40),
      marginHorizontal: s(6),
      alignItems: 'center',
      justifyContent: 'center',
    },
    dashedUnderline: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: 1,
      backgroundColor: theme.divider,
    },
    dashedActiveUnderline: {
      backgroundColor: theme.primary,
      height: 2,
    },

    // --- Revolt Style ---
    revoltContainer: {
      flexDirection: 'row',
      gap: s(10),
    },
    revoltSlot: {
      width: s(40),
      height: vs(40),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: ms(8),
      backgroundColor: theme.inputBg,
    },
    revoltActiveSlot: {
      borderColor: theme.info,
      borderWidth: 2,
      backgroundColor: theme.card,
    },
    revoltChar: {
      fontSize: fs(18),
    },
    centerJustify: {
      justifyContent: 'center',
    },
    resendContainer: {
      marginTop: vs(20),
      minHeight: vs(50),
      paddingHorizontal: s(16),
    },
    resendBtn: {
      paddingVertical: vs(8),
      paddingHorizontal: s(16),
    },
    resendText: {
      fontSize: fs(14),
      fontWeight: '600',
      color: theme.primary,
    },
    resendDisabled: {
      color: theme.textMuted,
    },

    // --- Caret ---
    caretContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    caret: {
      width: s(2),
      height: vs(24),
      backgroundColor: theme.primary,
      borderRadius: 1,
    },

    footer: {
      marginTop: vs(40),
      alignItems: 'center',
      paddingBottom: vs(20),
    },
    footerText: {
      fontSize: fs(12),
      color: theme.textMuted,
    },
  });

export default createStyles;
