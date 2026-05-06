import { StyleSheet, Dimensions } from 'react-native';
import { s, vs, fs } from '../../theme/Responsive';

const { width } = Dimensions.get('window');

// ─── COLOR TOKENS ──────────────────────────────────────────────
export const COLORS = {
  bg: '#F5F0FF',
  primary: '#7C3AED',
  text: '#2D2042',
  textSecondary: '#8E8E93',
  white: '#FFFFFF',
  shadow: '#7C3AED',
  gradient: ['#8B5CF6', '#6D28D9'], // Added back
};

// ─── GRADIENT CONSTANTS ────────────────────────────────────────
export const GRADIENT_START = { x: 0, y: 0 };
export const GRADIENT_END = { x: 1, y: 1 };

const createStyles = () =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: COLORS.bg,
    },
    headerContainer: {
      overflow: 'hidden',
      borderBottomLeftRadius: s(30),
      borderBottomRightRadius: s(30),
      paddingBottom: vs(30),
    },
    headerContent: {
      paddingHorizontal: s(24),
    },
    greetingText: {
      fontSize: fs(16),
      color: 'rgba(255,255,255,0.8)',
      fontWeight: '500',
    },
    headerTitleText: {
      fontSize: fs(24),
      fontWeight: 'bold',
      color: '#fff',
      marginTop: vs(4),
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: s(15),
      marginTop: vs(20),
      paddingHorizontal: s(16),
      height: vs(50),
    },
    searchIcon: {
      fontSize: fs(18),
    },
    searchInput: {
      flex: 1,
      marginLeft: s(10),
      color: '#fff',
      fontSize: fs(15),
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
      marginTop: vs(24),
      marginBottom: vs(16),
    },
    sectionTitle: {
      fontSize: fs(18),
      fontWeight: 'bold',
      color: COLORS.text,
    },
    seeAllText: {
      color: COLORS.primary,
      fontSize: fs(14),
      fontWeight: '600',
    },
    horizontalScroll: {
      paddingLeft: s(24),
      paddingRight: s(8),
    },
    featuredCard: {
      width: width * 0.75,
      height: vs(180),
      borderRadius: s(24),
      overflow: 'hidden',
      elevation: 8,
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: vs(4) },
      shadowOpacity: 0.3,
      shadowRadius: s(8),
    },
    featuredCardSecond: {
      marginLeft: s(16),
    },
    featuredCardGradient: {
      flex: 1,
      padding: s(20),
      justifyContent: 'center',
    },
    featuredTag: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: fs(10),
      fontWeight: 'bold',
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: s(8),
      paddingVertical: vs(4),
      borderRadius: s(8),
      alignSelf: 'flex-start',
    },
    featuredTitle: {
      color: '#fff',
      fontSize: fs(22),
      fontWeight: 'bold',
      marginTop: vs(10),
    },
    featuredSubtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: fs(13),
      marginTop: vs(4),
    },
    featuredBtn: {
      backgroundColor: '#fff',
      paddingHorizontal: s(16),
      paddingVertical: vs(8),
      borderRadius: s(12),
      alignSelf: 'flex-start',
      marginTop: vs(15),
    },
    featuredBtnText: {
      color: COLORS.primary,
      fontWeight: 'bold',
      fontSize: fs(12),
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: s(16),
    },
    featureCardContainer: {
      width: '50%',
      padding: s(8),
    },
    featureCard: {
      backgroundColor: COLORS.white,
      borderRadius: s(20),
      padding: s(16),
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.03)',
      elevation: 4,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: vs(2) },
      shadowOpacity: 0.1,
      shadowRadius: s(4),
    },
    iconContainer: {
      width: s(60),
      height: s(60),
      borderRadius: s(20),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: vs(12),
    },
    featureIcon: {
      fontSize: fs(28),
    },
    featureTitle: {
      fontSize: fs(15),
      fontWeight: 'bold',
      color: COLORS.text,
    },
    featureSubtitle: {
      fontSize: fs(11),
      color: COLORS.textSecondary,
      marginTop: vs(2),
      textAlign: 'center',
    },
    footerInfo: {
      alignItems: 'center',
      marginTop: vs(40),
      paddingBottom: vs(20),
    },
    footerText: {
      fontSize: fs(12),
      color: COLORS.textSecondary,
      fontStyle: 'italic',
    },
  });

export default createStyles;
