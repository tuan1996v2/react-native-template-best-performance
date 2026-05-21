import { StyleSheet } from 'react-native';
import { s, vs, ms, fs } from '@/theme/Responsive';
import type { AppTheme } from '@/theme/Colors';

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    // ─── ROOT ──────────────────────────────────────────────────
    root: {
      flex: 1,
      backgroundColor: theme.background,
    },

    // ─── HEADER ────────────────────────────────────────────────
    headerContainer: {
      paddingHorizontal: s(20),
      paddingBottom: vs(16),
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: {
      fontSize: fs(24),
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: fs(13),
      color: 'rgba(255,255,255,0.7)',
      marginTop: vs(2),
    },
    controlsRow: {
      flexDirection: 'row',
      marginTop: vs(14),
      gap: s(8),
    },

    // ─── CONTROL BUTTONS ───────────────────────────────────────
    controlButton: {
      flex: 1,
      paddingVertical: vs(10),
      paddingHorizontal: s(12),
      borderRadius: ms(12),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    },
    textClose: { fontSize: fs(24), color: '#FFF', fontWeight: '600' },
    controlButtonActive: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderColor: 'rgba(255,255,255,0.4)',
    },
    controlButtonInactive: {
      backgroundColor: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(255,255,255,0.12)',
    },
    controlButtonText: {
      fontSize: fs(12),
      fontWeight: '700',
      color: '#FFFFFF',
    },
    controlButtonSubtext: {
      fontSize: fs(10),
      color: 'rgba(255,255,255,0.6)',
      marginTop: vs(2),
    },

    // ─── STAT BAR ──────────────────────────────────────────────
    statBar: {
      flexDirection: 'row',
      paddingHorizontal: s(20),
      paddingVertical: vs(10),
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
      gap: s(6),
    },
    statBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: s(10),
      paddingVertical: vs(4),
      borderRadius: ms(20),
      gap: s(4),
    },
    statBadgeText: {
      fontSize: fs(12),
      fontWeight: '700',
    },
    statLabel: {
      fontSize: fs(11),
      color: theme.textMuted,
    },

    // ─── CHAT ROOMS LIST ───────────────────────────────────────
    chatList: {
      flex: 1,
    },
    chatListContent: {
      paddingBottom: vs(100),
    },

    // ─── SECTION HEADER ────────────────────────────────────────
    sectionHeader: {
      paddingHorizontal: s(20),
      paddingTop: vs(16),
      paddingBottom: vs(8),
    },
    sectionTitle: {
      fontSize: fs(13),
      fontWeight: '700',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },

    // ─── CHAT ROOM ITEM ────────────────────────────────────────
    chatRoomItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: s(20),
      paddingVertical: vs(12),
      backgroundColor: theme.card,
    },
    chatRoomItemActive: {
      backgroundColor: theme.mode === 'light' ? '#EEF2FF' : '#1E1B4B',
    },
    avatarContainer: {
      width: ms(50),
      height: ms(50),
      borderRadius: ms(25),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: s(14),
    },
    avatarEmoji: {
      fontSize: fs(24),
      fontFamily: 'System',
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: ms(14),
      height: ms(14),
      borderRadius: ms(7),
      backgroundColor: '#10B981',
      borderWidth: 2,
      borderColor: theme.card,
    },
    chatRoomInfo: {
      flex: 1,
    },
    chatRoomNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chatRoomName: {
      fontSize: fs(15),
      fontWeight: '700',
      color: theme.text,
    },
    chatRoomTime: {
      fontSize: fs(11),
      color: theme.textMuted,
    },
    chatRoomLastMessage: {
      fontSize: fs(13),
      color: theme.textSecondary,
      marginTop: vs(3),
    },
    unreadBadge: {
      minWidth: ms(20),
      height: ms(20),
      borderRadius: ms(10),
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: s(8),
      paddingHorizontal: s(6),
    },
    unreadBadgeText: {
      fontSize: fs(11),
      fontWeight: '800',
      color: '#FFFFFF',
    },

    // ─── SEPARATOR ─────────────────────────────────────────────
    separator: {
      height: 1,
      backgroundColor: theme.divider,
      marginLeft: s(84),
    },

    // ─── FLOATING ACTION BUTTON ────────────────────────────────
    fab: {
      position: 'absolute',
      bottom: vs(30),
      right: s(20),
      width: ms(56),
      height: ms(56),
      borderRadius: ms(28),
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    fabIcon: {
      fontSize: fs(24),
      color: '#FFFFFF',
    },

    // ─── EMPTY STATE ───────────────────────────────────────────
    emptyState: {
      alignItems: 'center',
      paddingTop: vs(60),
      paddingHorizontal: s(40),
    },
    emptyEmoji: {
      fontSize: fs(48),
      marginBottom: vs(12),
    },
    emptyTitle: {
      fontSize: fs(18),
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: fs(13),
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: vs(6),
      lineHeight: fs(18),
    },
  });

export default createStyles;
