import { StyleSheet } from 'react-native';
import { s, vs, fs } from '../../theme/Responsive';
import { AppTheme } from '../../theme/Colors';

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    headerContainer: {
      overflow: 'hidden',
      borderBottomLeftRadius: s(30),
      borderBottomRightRadius: s(30),
      paddingBottom: vs(24),
      // Soft glow effect
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.15,
      shadowRadius: 30,
      elevation: 20,
    },
    headerContent: {
      paddingHorizontal: s(24),
    },
    greetingText: {
      fontSize: fs(14),
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    headerTitleText: {
      fontSize: fs(24),
      fontWeight: '800',
      color: theme.white,
      marginTop: vs(2),
      letterSpacing: -0.5,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: s(16),
      marginTop: vs(16),
      paddingHorizontal: s(16),
      height: vs(48),
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    searchInput: {
      flex: 1,
      marginLeft: s(12),
      color: theme.white,
      fontSize: fs(16),
      fontWeight: '500',
    },
    scrollview: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: vs(40),
    },
    bannerSection: {
      marginTop: vs(20),
      paddingHorizontal: 0,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: s(24),
      marginTop: vs(8),
      marginBottom: vs(16),
    },
    sectionTitle: {
      fontSize: fs(20),
      fontWeight: '800',
      color: theme.text,
      letterSpacing: -0.5,
    },
    seeAllText: {
      color: theme.primary,
      fontSize: fs(14),
      fontWeight: '700',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: s(12),
    },
    featureCardContainer: {
      width: '50%',
      height: vs(185),
      padding: s(8),
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    iconContainer: {
      width: s(64),
      height: s(64),
      borderRadius: s(22),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: vs(14),
      // Glass effect for icon
      borderWidth: 1,
      borderColor: theme.glassBorder,
      backgroundColor: theme.glassBg,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.mode === 'light' ? 0.05 : 0.2,
      shadowRadius: 10,
    },
    featureTitle: {
      fontSize: fs(16),
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
    },
    featureSubtitle: {
      fontSize: fs(12),
      color: theme.textSecondary,
      marginTop: vs(4),
      textAlign: 'center',
      fontWeight: '500',
      paddingHorizontal: s(4),
    },
    footerInfo: {
      alignItems: 'center',
      marginTop: vs(48),
      paddingBottom: vs(30),
    },
    footerText: {
      fontSize: fs(13),
      color: theme.textSecondary,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
  });

export default createStyles;
