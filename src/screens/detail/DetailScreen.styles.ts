import { StyleSheet } from 'react-native';
import { s, vs, fs } from '../../theme/Responsive';
import { AppTheme } from '../../theme/Colors';

// ─── CONSTANTS ────────────────────────────────────────────────
export const HEADER_HEIGHT = vs(56);
export const STORIES_HEIGHT = vs(98);

// Pre-compute gradient props (tránh inline objects gây re-render)
export const GRADIENT_START = { x: 0, y: 0 } as const;
export const GRADIENT_END = { x: 1, y: 1 } as const;

export const STORY_RING_COLORS_FULL = ['#8B5CF6', '#EC4899', '#F59E0B'] as const;
export const STORY_RING_COLORS = ['#8B5CF6', '#EC4899'] as const;

// ─── STYLES ───────────────────────────────────────────────────
const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.background,
    },
    gradient: {
      flex: 1,
    },

    // Collapsible header overlay
    collapsibleHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    },
    headerGradient: {
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    // Header inner
    headerInner: {
      height: HEADER_HEIGHT,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: s(20),
    },
    headerLeft: { backgroundColor: 'transparent' },
    headerTitle: {
      fontSize: fs(26),
      fontWeight: '800',
      color: theme.text,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: fs(13),
      color: theme.textMuted,
      marginTop: vs(2),
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(14),
    },
    headerIcon: {
      fontSize: fs(22),
    },
    notificationDot: {
      position: 'absolute',
      top: vs(-2),
      right: s(38),
      width: s(8),
      height: s(8),
      borderRadius: s(4),
      backgroundColor: theme.liked,
      zIndex: 10,
      borderWidth: 1.5,
      borderColor: theme.headerBg,
    },
    headerAvatarWrap: {
      width: s(34),
      height: s(34),
      borderRadius: s(17),
      backgroundColor: theme.accent,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerAvatarText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: fs(15),
    },

    // Stories
    storiesBar: {
      height: STORIES_HEIGHT,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    storiesContent: {
      paddingHorizontal: s(16),
      paddingVertical: vs(14),
      gap: s(14),
      alignItems: 'flex-start',
    },
    storyItem: {
      alignItems: 'center',
      width: s(58),
    },
    storyRing: {
      width: s(52),
      height: s(52),
      borderRadius: s(26),
      justifyContent: 'center',
      alignItems: 'center',
    },
    storyAvatarInner: {
      width: s(46),
      height: s(46),
      borderRadius: s(23),
      backgroundColor: theme.card,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.background,
    },
    storyAddIcon: {
      fontSize: fs(22),
      color: theme.accentLight,
      fontWeight: '300',
    },
    storyEmoji: {
      fontSize: fs(22),
    },
    storyAvatarImage: {
      width: s(46),
      height: s(46),
      borderRadius: s(23),
    },
    storyName: {
      fontSize: fs(11),
      color: theme.textSecondary,
      marginTop: vs(5),
    },

    // FAB
    fabContainer: {
      position: 'absolute',
      bottom: vs(32),
      right: s(20),
    },
    fabTouchable: {
      borderRadius: s(28),
      backgroundColor: 'transparent',
      elevation: 8,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: vs(4) },
      shadowOpacity: 0.45,
      shadowRadius: s(12),
    },
    fab: {
      width: s(56),
      height: s(56),
      borderRadius: s(28),
      justifyContent: 'center',
      alignItems: 'center',
    },
    fabIcon: {
      fontSize: fs(22),
      color: '#fff',
    },
  });

export default createStyles;
