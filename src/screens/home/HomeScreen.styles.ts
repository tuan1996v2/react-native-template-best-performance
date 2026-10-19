import { StyleSheet } from 'react-native';
import { s, vs, ms, fs } from '../../theme/Responsive';
import { AppTheme } from '../../theme/Colors';

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerContainer: {
      paddingHorizontal: s(16),
      paddingBottom: vs(12),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.card,
    },
    headerLeft: {
      flex: 1,
    },
    headerBrandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(8),
    },
    headerTitle: {
      fontSize: fs(20),
      fontWeight: '800',
      color: theme.text,
      letterSpacing: -0.4,
    },
    liveBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#10B98118',
      paddingHorizontal: s(6),
      paddingVertical: vs(2),
      borderRadius: ms(6),
      gap: s(4),
    },
    liveDot: {
      width: s(6),
      height: s(6),
      borderRadius: s(3),
      backgroundColor: '#10B981',
    },
    liveText: {
      fontSize: fs(10),
      fontWeight: '700',
      color: '#10B981',
    },
    headerSubtitle: {
      fontSize: fs(12),
      color: theme.textSecondary,
      marginTop: vs(2),
      fontWeight: '500',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(8),
    },
    actionButton: {
      paddingHorizontal: s(10),
      height: vs(32),
      borderRadius: ms(8),
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButtonPressed: {
      opacity: 0.7,
    },
    actionButtonText: {
      fontSize: fs(12),
      fontWeight: '700',
      color: theme.text,
    },
    specsContainer: {
      flexDirection: 'row',
      marginHorizontal: s(16),
      marginTop: vs(12),
      marginBottom: vs(12),
      paddingVertical: vs(10),
      paddingHorizontal: s(12),
      backgroundColor: theme.card,
      borderRadius: ms(12),
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    specItem: {
      alignItems: 'center',
      flex: 1,
    },
    specValue: {
      fontSize: fs(12),
      fontWeight: '800',
      color: theme.text,
    },
    specLabel: {
      fontSize: fs(10),
      fontWeight: '500',
      color: theme.textSecondary,
      marginTop: vs(2),
    },
    specDivider: {
      width: 1,
      height: vs(18),
      backgroundColor: theme.divider,
    },
    scrollview: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: vs(40),
    },
    section: {
      marginTop: vs(12),
      paddingHorizontal: s(16),
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: vs(8),
    },
    sectionTitle: {
      fontSize: fs(12),
      fontWeight: '700',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: vs(10),
    },
    bentoCard: {
      width: '48.5%',
      backgroundColor: theme.card,
      borderRadius: ms(14),
      padding: s(12),
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: 'space-between',
      minHeight: vs(122),
    },
    bentoCardPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.985 }],
    },
    cardTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: vs(10),
    },
    iconBox: {
      width: s(36),
      height: s(36),
      borderRadius: ms(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeBox: {
      paddingHorizontal: s(6),
      paddingVertical: vs(2),
      borderRadius: ms(5),
    },
    badgeText: {
      fontSize: fs(9),
      fontWeight: '700',
    },
    cardTitle: {
      fontSize: fs(13),
      fontWeight: '700',
      color: theme.text,
      letterSpacing: -0.2,
    },
    cardSubtitle: {
      fontSize: fs(11),
      color: theme.textSecondary,
      lineHeight: vs(15),
      marginTop: vs(2),
    },
    footerInfo: {
      alignItems: 'center',
      marginTop: vs(28),
      paddingBottom: vs(20),
    },
    footerText: {
      fontSize: fs(11),
      color: theme.textSecondary,
      fontWeight: '500',
    },
  });

export default createStyles;
