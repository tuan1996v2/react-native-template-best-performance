import { StyleSheet } from 'react-native';
import { s, vs, ms, fs } from '../../theme/Responsive';

// ─── COLORS (export cho component dùng chung) ─────────────────
export const COLORS = {
  bgGradientStart: '#0F0C29',
  bgGradientMid: '#1A1A3E',
  bgGradientEnd: '#24243E',
  headerBg: 'rgba(15, 12, 41, 0.96)',
  card: '#1E1B3A',
  cardBorder: 'rgba(139, 92, 246, 0.15)',
  accent: '#8B5CF6',
  accentLight: '#A78BFA',
  textPrimary: '#F1F0F5',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  liked: '#F43F5E',
  divider: 'rgba(139, 92, 246, 0.1)',
  fabGradientStart: '#8B5CF6',
  fabGradientEnd: '#6D28D9',
  fabShadow: '#7C3AED',
  verified: '#3B82F6',
};

// ─── CONSTANTS ────────────────────────────────────────────────
export const HEADER_HEIGHT = vs(56);
export const STORIES_HEIGHT = vs(98);

// Pre-compute gradient props (tránh inline objects gây re-render)
export const GRADIENT_START = { x: 0, y: 0 } as const;
export const GRADIENT_END = { x: 1, y: 1 } as const;
export const BG_GRADIENT_COLORS = [COLORS.bgGradientStart, COLORS.bgGradientMid, COLORS.bgGradientEnd];
export const HEADER_GRADIENT_COLORS = [COLORS.headerBg, COLORS.headerBg];
export const FAB_GRADIENT_COLORS = [COLORS.fabGradientStart, COLORS.fabGradientEnd];

export const STORY_RING_COLORS_FULL = ['#8B5CF6', '#EC4899', '#F59E0B'] as const;
export const STORY_RING_COLORS = ['#8B5CF6', '#EC4899'] as const;

// ─── STYLES ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bgGradientStart,
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
    borderBottomColor: COLORS.divider,
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
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: fs(13),
    color: COLORS.textMuted,
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
    backgroundColor: COLORS.liked,
    zIndex: 10,
    borderWidth: 1.5,
    borderColor: COLORS.headerBg,
  },
  headerAvatarWrap: {
    width: s(34),
    height: s(34),
    borderRadius: s(17),
    backgroundColor: COLORS.accent,
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
    borderBottomColor: COLORS.divider,
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
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.bgGradientStart,
  },
  storyAddIcon: {
    fontSize: fs(22),
    color: COLORS.accentLight,
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
    color: COLORS.textSecondary,
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
    shadowColor: COLORS.fabShadow,
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

export default styles;
