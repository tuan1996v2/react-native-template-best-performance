import { StyleSheet, Dimensions } from 'react-native';
import { s, vs, ms, fs } from '../../theme/Responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_GAP = s(2);

// ─── COLOR TOKENS ──────────────────────────────────────────────
export const C = {
  card: '#1E1B3A',
  cardBorder: 'rgba(139, 92, 246, 0.15)',
  accent: '#8B5CF6',
  accentLight: '#A78BFA',
  textPrimary: '#F1F0F5',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  liked: '#F43F5E',
  divider: 'rgba(139, 92, 246, 0.1)',
  verified: '#3B82F6',
  actionBg: 'rgba(139, 92, 246, 0.08)',
  actionBorder: 'rgba(139, 92, 246, 0.12)',
};

// ─── IMAGE GRID CONSTANTS (Facebook-style) ────────────────────
// Chiều rộng thực tế = SCREEN_WIDTH - padding card (16 * 2)
const GRID_WIDTH = SCREEN_WIDTH - s(32);
const HALF_WIDTH = (GRID_WIDTH - IMAGE_GAP) / 2;
const GRID_HEIGHT_SINGLE = vs(280);
const GRID_HEIGHT_MULTI = vs(300);

export { GRID_WIDTH, HALF_WIDTH, IMAGE_GAP, GRID_HEIGHT_SINGLE, GRID_HEIGHT_MULTI };

// ─── STYLES ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Card
  card: {
    paddingHorizontal: s(16),
    paddingTop: vs(16),
    backgroundColor: 'transparent',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  avatarRing: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    borderWidth: 2,
    borderColor: C.accent,
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(2),
  },
  avatar: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
  },
  headerInfo: {
    flex: 1,
    marginLeft: s(12),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  userName: {
    fontSize: fs(15),
    fontWeight: '700',
    color: C.textPrimary,
  },
  verifiedBadge: {
    fontSize: fs(12),
    color: C.verified,
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderRadius: s(8),
    overflow: 'hidden',
    paddingHorizontal: s(4),
    paddingVertical: vs(1),
    fontWeight: '700',
  },
  handleTime: {
    fontSize: fs(13),
    color: C.textMuted,
    marginTop: vs(2),
  },
  menuDots: {
    fontSize: fs(18),
    color: C.textMuted,
    paddingHorizontal: s(8),
    letterSpacing: 1,
  },

  // Content
  contentText: {
    fontSize: fs(15),
    lineHeight: fs(22),
    color: C.textSecondary,
    marginBottom: vs(12),
  },

  // ─── FACEBOOK-STYLE IMAGE GRID ──────────────────────────────
  imageContainer: {
    borderRadius: s(12),
    overflow: 'hidden',
    marginBottom: vs(12),
    borderWidth: 1,
    borderColor: C.cardBorder,
  },
  // 1 ảnh: full-width, high
  singleImage: {
    width: '100%',
    height: GRID_HEIGHT_SINGLE,
    backgroundColor: C.card,
  },
  // 2 ảnh: 2 cột bằng nhau
  twoImagesRow: {
    flexDirection: 'row',
    height: GRID_HEIGHT_MULTI / 1.3,
  },
  twoImagesItem: {
    flex: 1,
    overflow: 'hidden',
  },
  twoImagesGap: {
    width: IMAGE_GAP,
  },
  // 3 ảnh: 1 ảnh lớn bên trái + 2 ảnh nhỏ chồng bên phải
  threeImagesContainer: {
    flexDirection: 'row',
    height: GRID_HEIGHT_MULTI,
  },
  threeImagesLeft: {
    flex: 1,
    overflow: 'hidden',
  },
  threeImagesRight: {
    flex: 1,
    marginLeft: IMAGE_GAP,
  },
  threeImagesRightTop: {
    flex: 1,
    overflow: 'hidden',
  },
  threeImagesRightGap: {
    height: IMAGE_GAP,
  },
  // 3 ảnh: ảnh dưới bên phải
  threeImagesRightBottom: {
    flex: 1,
    overflow: 'hidden',
  },
  // 4+ ảnh: 2×2 grid
  fourImagesContainer: {
    height: GRID_HEIGHT_MULTI,
  },
  fourImagesTopRow: {
    flexDirection: 'row',
    flex: 1,
  },
  fourImagesBottomRow: {
    flexDirection: 'row',
    flex: 1,
    marginTop: IMAGE_GAP,
  },
  fourImagesItem: {
    flex: 1,
    overflow: 'hidden',
  },
  fourImagesGap: {
    width: IMAGE_GAP,
  },
  // Ảnh fill toàn bộ cell
  imageFill: {
    width: '100%',
    height: '100%',
    backgroundColor: C.card,
  },
  // Overlay +N
  remainingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingText: {
    color: '#FFFFFF',
    fontSize: fs(32),
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Like summary
  likeSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
    gap: s(8),
  },
  likeDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeDotRed: {
    width: s(18),
    height: s(18),
    borderRadius: s(9),
    borderWidth: 2,
    borderColor: '#1E1B3A',
    backgroundColor: C.liked,
  },
  likeDotAccent: {
    width: s(18),
    height: s(18),
    borderRadius: s(9),
    borderWidth: 2,
    borderColor: '#1E1B3A',
    backgroundColor: C.accent,
    marginLeft: s(-4),
  },
  likeDotYellow: {
    width: s(18),
    height: s(18),
    borderRadius: s(9),
    borderWidth: 2,
    borderColor: '#1E1B3A',
    backgroundColor: '#F59E0B',
    marginLeft: s(-4),
  },
  likeSummaryText: {
    fontSize: fs(13),
    color: C.textMuted,
  },
  likeSummaryBold: {
    fontWeight: '700',
    color: C.textSecondary,
  },

  // Action bar
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    paddingVertical: vs(6),
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(14),
    borderRadius: s(24),
    backgroundColor: C.actionBg,
    borderWidth: 1,
    borderColor: C.actionBorder,
    gap: s(6),
  },
  actionBtnLiked: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.2)',
  },
  actionIcon: {
    fontSize: fs(16),
  },
  actionIconLiked: {
    // emoji inherits color automatically
  },
  actionLabel: {
    fontSize: fs(13),
    fontWeight: '600',
    color: C.textMuted,
  },
  actionLabelLiked: {
    color: C.liked,
  },
  actionSpacer: {
    flex: 1,
  },
  bookmarkBtn: {
    padding: s(8),
    borderRadius: s(20),
    backgroundColor: C.actionBg,
    borderWidth: 1,
    borderColor: C.actionBorder,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: C.divider,
    marginTop: vs(12),
  },
});

export default styles;
