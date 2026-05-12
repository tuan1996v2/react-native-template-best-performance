import { StyleSheet, Dimensions } from 'react-native';
import { s, vs, fs } from '../../theme/Responsive';

const { width } = Dimensions.get('window');

// ─── COLOR TOKENS (Futuristic/iOS 26 Style) ───────────────────────
export const COLORS = {
  bg: '#F8FAFC',
  primary: '#6366F1', // Indigo 500
  secondary: '#EC4899', // Pink 500
  accent: '#10B981', // Emerald 500
  text: '#0F172A', // Slate 900
  textSecondary: '#64748B', // Slate 500
  white: '#FFFFFF',
  shadow: 'rgba(99, 102, 241, 0.2)',
  glass: 'rgba(255, 255, 255, 0.85)',
  border: 'rgba(255, 255, 255, 0.3)',
  gradient: ['#6366F1', '#A855F7', '#EC4899'], // Indigo to Purple to Pink
};

export const GRADIENT_START = { x: 0, y: 0 };
export const GRADIENT_END = { x: 1, y: 1 };

const createStyles = () =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: COLORS.bg,
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
      shadowColor: COLORS.primary,
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
      color: '#fff',
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
      color: '#fff',
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
      color: COLORS.text,
      letterSpacing: -0.5,
    },
    seeAllText: {
      color: COLORS.primary,
      fontSize: fs(14),
      fontWeight: '700',
    },
    horizontalScroll: {
      paddingLeft: s(24),
      paddingRight: s(8),
    },
    featuredCard: {
      width: width * 0.8,
      height: vs(200),
      borderRadius: s(32),
      overflow: 'hidden',
      elevation: 10,
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
    },
    featuredCardSecond: {
      marginLeft: s(16),
    },
    featuredCardGradient: {
      flex: 1,
      padding: s(24),
      justifyContent: 'center',
    },
    featuredTag: {
      color: '#fff',
      fontSize: fs(10),
      fontWeight: '800',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      paddingHorizontal: s(10),
      paddingVertical: vs(5),
      borderRadius: s(10),
      alignSelf: 'flex-start',
      overflow: 'hidden',
    },
    featuredTitle: {
      color: '#fff',
      fontSize: fs(24),
      fontWeight: '900',
      marginTop: vs(12),
      lineHeight: fs(28),
    },
    featuredSubtitle: {
      color: 'rgba(255, 255, 255, 0.85)',
      fontSize: fs(14),
      marginTop: vs(6),
      fontWeight: '500',
    },
    featuredBtn: {
      backgroundColor: '#fff',
      paddingHorizontal: s(20),
      paddingVertical: vs(10),
      borderRadius: s(14),
      alignSelf: 'flex-start',
      marginTop: vs(18),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    featuredBtnText: {
      color: COLORS.primary,
      fontWeight: '800',
      fontSize: fs(13),
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
      borderColor: 'rgba(255, 255, 255, 0.5)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    featureTitle: {
      fontSize: fs(16),
      fontWeight: '700',
      color: COLORS.text,
      textAlign: 'center',
    },
    featureSubtitle: {
      fontSize: fs(12),
      color: COLORS.textSecondary,
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
      color: COLORS.textSecondary,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
  });

export default createStyles;
