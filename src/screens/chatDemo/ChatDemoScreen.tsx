import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';
import { s, vs, ms, fs } from '@/theme/Responsive';
import NavigationService from '@/navigation/NavigationService';
import { CONTACTS, GROUP_ROOMS, privateRoomId } from './data';
import { useChatSimulator } from './useChatSimulator';
import ChatRoomScreen from './ChatRoomScreen';
import type { RoomMeta } from './types';

// ─── TIME FORMATTER ───────────────────────────────────────────────────────
const formatTime = (ts: number | undefined) => {
  if (!ts) return '';
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) return 'Vừa xong';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} phút`;
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

// ─── ROOM LIST ITEM ───────────────────────────────────────────────────────
interface RoomItemProps {
  id: string;
  name: string;
  emoji: string;
  color: string;
  isGroup: boolean;
  isOnline?: boolean;
  meta: RoomMeta | undefined;
  onPress: () => void;
  theme: typeof ThemeTokens.light;
  badgeColor: string;
}

const RoomItem = React.memo(
  ({ name, emoji, color, isGroup, isOnline, meta, onPress, theme, badgeColor }: RoomItemProps) => {
    const unread = meta?.unread ?? 0;
    const isActive = meta?.isActive ?? false;
    const lastMsg = meta?.lastMessage ?? (isGroup ? 'Chưa có tin nhắn' : 'Nhấn để xem');
    const lastSender = meta?.lastSenderName;
    const preview = isGroup && lastSender ? `${lastSender}: ${lastMsg}` : lastMsg;

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.roomItem,
          { backgroundColor: theme.card },
          isActive && { backgroundColor: theme.mode === 'light' ? '#EEF2FF' : '#1E1B4B' },
          pressed && { opacity: 0.85 },
        ]}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: color + '22' }]}>
          <Text style={styles.avatarEmoji}>{emoji}</Text>
          {!isGroup && isOnline && <View style={[styles.onlineDot, { borderColor: theme.card }]} />}
          {isGroup && (
            <View style={[styles.groupBadge, { backgroundColor: color }]}>
              <Text style={styles.groupBadgeText}>G</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.roomInfo}>
          <View style={styles.roomNameRow}>
            <Text
              style={[styles.roomName, { color: theme.text }, unread > 0 && styles.roomNameBold]}
              numberOfLines={1}>
              {name}
            </Text>
            <Text style={[styles.roomTime, { color: theme.textMuted }]}>
              {formatTime(meta?.lastTimestamp)}
            </Text>
          </View>
          <Text
            style={[
              styles.roomPreview,
              { color: unread > 0 ? theme.textSecondary : theme.textMuted },
              unread > 0 && styles.roomPreviewBold,
            ]}
            numberOfLines={1}>
            {preview}
          </Text>
        </View>

        {/* Unread badge */}
        {unread > 0 && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{unread > 99 ? '99+' : unread}</Text>
          </View>
        )}
      </Pressable>
    );
  },
);

// ─── LIST ITEM TYPE ───────────────────────────────────────────────────────
type ListItem =
  | { kind: 'section'; title: string; key: string }
  | {
      kind: 'room';
      key: string;
      id: string;
      name: string;
      emoji: string;
      color: string;
      isGroup: boolean;
      isOnline?: boolean;
    };

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────
const ChatDemoScreen = () => {
  const insets = useSafeAreaInsets();
  const mode = useThemeStore(state => state.mode);
  const theme = ThemeTokens[mode];

  const {
    messages,
    roomMeta,
    isSimulating,
    totalReceived,
    startSimulation,
    stopSimulation,
    resetSimulation,
    markRoomRead,
  } = useChatSimulator();

  // Active room (null = list view)
  const [activeRoom, setActiveRoom] = useState<{
    roomId: string;
    name: string;
    emoji: string;
    color: string;
    isGroup: boolean;
  } | null>(null);

  // ── Open a room ──
  const openRoom = useCallback(
    (roomId: string, name: string, emoji: string, color: string, isGroup: boolean) => {
      setActiveRoom({ roomId, name, emoji, color, isGroup });
      markRoomRead(roomId);
    },
    [markRoomRead],
  );

  const closeRoom = useCallback(() => setActiveRoom(null), []);

  // ── Stats ──
  const totalUnread = useMemo(
    () => Object.values(roomMeta).reduce((sum, m) => sum + m.unread, 0),
    [roomMeta],
  );
  const activeRoomCount = useMemo(
    () => Object.values(roomMeta).filter(m => m.unread > 0).length,
    [roomMeta],
  );

  // ── List data ──
  const listData: ListItem[] = useMemo(
    () => [
      { kind: 'section', title: 'NHÓM CHAT', key: 'sec_group' },
      ...GROUP_ROOMS.map(g => ({
        kind: 'room' as const,
        key: g.id,
        id: g.id,
        name: g.name,
        emoji: g.emoji,
        color: g.color,
        isGroup: true,
      })),
      { kind: 'section', title: 'TIN NHẮN RIÊNG', key: 'sec_private' },
      ...CONTACTS.map(c => ({
        kind: 'room' as const,
        key: privateRoomId(c.id),
        id: privateRoomId(c.id),
        name: c.name,
        emoji: c.emoji,
        color: c.color,
        isGroup: false,
        isOnline: c.isOnline,
      })),
    ],
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.kind === 'section') {
        return (
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{item.title}</Text>
          </View>
        );
      }
      return (
        <RoomItem
          id={item.id}
          name={item.name}
          emoji={item.emoji}
          color={item.color}
          isGroup={item.isGroup}
          isOnline={item.isOnline}
          meta={roomMeta[item.id]}
          onPress={() => openRoom(item.id, item.name, item.emoji, item.color, item.isGroup)}
          theme={theme}
          badgeColor={item.isGroup ? theme.primary : '#EF4444'}
        />
      );
    },
    [roomMeta, openRoom, theme],
  );

  const keyExtractor = useCallback((item: ListItem) => item.key, []);

  const renderSeparator = useCallback(
    () => <View style={[styles.separator, { backgroundColor: theme.divider }]} />,
    [theme.divider],
  );

  const headerPaddingStyle = useMemo(() => ({ paddingTop: insets.top + vs(10) }), [insets.top]);

  // ─── CHAT ROOM VIEW ──────────────────────────────────────────────────────
  if (activeRoom) {
    return (
      <AppScreen
        edges={['bottom']}
        backgroundColor={theme.background}
        statusBarStyle="dark-content">
        <ChatRoomScreen
          roomId={activeRoom.roomId}
          roomName={activeRoom.name}
          roomEmoji={activeRoom.emoji}
          roomColor={activeRoom.color}
          isGroup={activeRoom.isGroup}
          messages={messages[activeRoom.roomId] ?? []}
          onBack={closeRoom}
          onMarkRead={markRoomRead}
        />
      </AppScreen>
    );
  }

  // ─── LIST VIEW ───────────────────────────────────────────────────────────
  return (
    <AppScreen edges={['bottom']} backgroundColor={theme.background} statusBarStyle="light-content">
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        {/* ─── HEADER ──────────────────────────────────────── */}
        <LinearGradient
          colors={theme.gradient as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={[styles.headerContainer, headerPaddingStyle]}>
            {/* Title row */}
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>💬 Tin Nhắn</Text>
                <Text style={styles.headerSubtitle}>
                  {isSimulating ? '🔴 Đang nhận tin nhắn...' : 'Mô phỏng ứng dụng chat'}
                </Text>
              </View>
              <Pressable onPress={() => NavigationService.back()} hitSlop={12}>
                <Text style={styles.closeBtn}>✕</Text>
              </Pressable>
            </View>

            {/* Control buttons */}
            <View style={styles.controlRow}>
              <Pressable
                style={[styles.ctrlBtn, isSimulating ? styles.ctrlBtnDim : styles.ctrlBtnActive]}
                onPress={startSimulation}
                disabled={isSimulating}>
                <Text style={styles.ctrlBtnIcon}>▶</Text>
                <Text style={styles.ctrlBtnLabel}>Bắt đầu</Text>
              </Pressable>

              <Pressable
                style={[styles.ctrlBtn, isSimulating ? styles.ctrlBtnActive : styles.ctrlBtnDim]}
                onPress={stopSimulation}
                disabled={!isSimulating}>
                <Text style={styles.ctrlBtnIcon}>⏹</Text>
                <Text style={styles.ctrlBtnLabel}>Dừng</Text>
              </Pressable>

              <Pressable style={[styles.ctrlBtn, styles.ctrlBtnDim]} onPress={resetSimulation}>
                <Text style={styles.ctrlBtnIcon}>↺</Text>
                <Text style={styles.ctrlBtnLabel}>Reset</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>

        {/* ─── STAT BAR ────────────────────────────────────── */}
        <View
          style={[
            styles.statBar,
            { backgroundColor: theme.card, borderBottomColor: theme.divider },
          ]}>
          <StatChip
            value={totalReceived}
            label="tin nhắn"
            color={theme.primary}
            bg={theme.primary + '18'}
          />
          <StatChip
            value={totalUnread}
            label="chưa đọc"
            color={theme.error}
            bg={theme.error + '18'}
          />
          <StatChip
            value={activeRoomCount}
            label="phòng"
            color={theme.warning}
            bg={theme.warning + '18'}
          />
          <StatChip
            value={Object.values(roomMeta).filter(m => m.isActive).length}
            label="đang nhận"
            color={theme.success}
            bg={theme.success + '18'}
          />
        </View>

        {/* ─── ROOM LIST ───────────────────────────────────── */}
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={listData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          maxToRenderPerBatch={20}
          windowSize={10}
        />
      </View>
    </AppScreen>
  );
};

// ─── STAT CHIP ────────────────────────────────────────────────────────────
const StatChip = React.memo(
  ({ value, label, color, bg }: { value: number; label: string; color: string; bg: string }) => (
    <View style={[styles.statChip, { backgroundColor: bg }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  ),
);

// ─── STYLES ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
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
    color: 'rgba(255,255,255,0.75)',
    marginTop: vs(2),
  },
  closeBtn: {
    fontSize: fs(22),
    color: '#FFF',
    fontWeight: '600',
  },

  // Controls
  controlRow: {
    flexDirection: 'row',
    marginTop: vs(14),
    gap: s(8),
  },
  ctrlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(10),
    borderRadius: ms(12),
    gap: s(6),
    borderWidth: 1,
  },
  ctrlBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderColor: 'rgba(255,255,255,0.45)',
  },
  ctrlBtnDim: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderColor: 'rgba(255,255,255,0.14)',
  },
  ctrlBtnIcon: {
    fontSize: fs(14),
    color: '#FFF',
    fontWeight: '700',
  },
  ctrlBtnLabel: {
    fontSize: fs(12),
    color: '#FFF',
    fontWeight: '600',
  },

  // Stat bar
  statBar: {
    flexDirection: 'row',
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    gap: s(6),
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(5),
    borderRadius: ms(20),
    gap: s(4),
  },
  statValue: {
    fontSize: fs(13),
    fontWeight: '800',
  },
  statLabel: {
    fontSize: fs(10),
    color: '#94A3B8',
  },

  // Section
  sectionHeader: {
    paddingHorizontal: s(20),
    paddingTop: vs(14),
    paddingBottom: vs(6),
  },
  sectionTitle: {
    fontSize: fs(11),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  // Room item
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingVertical: vs(11),
  },
  avatar: {
    width: ms(52),
    height: ms(52),
    borderRadius: ms(26),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(12),
  },
  avatarEmoji: { fontSize: fs(26) },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: ms(13),
    height: ms(13),
    borderRadius: ms(7),
    backgroundColor: '#10B981',
    borderWidth: 2,
  },
  groupBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: ms(16),
    height: ms(16),
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupBadgeText: {
    fontSize: fs(8),
    fontWeight: '800',
    color: '#FFF',
  },
  roomInfo: { flex: 1 },
  roomNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roomName: {
    fontSize: fs(15),
    fontWeight: '500',
    flex: 1,
    marginRight: s(8),
  },
  roomNameBold: { fontWeight: '700' },
  roomTime: { fontSize: fs(11) },
  roomPreview: {
    fontSize: fs(13),
    marginTop: vs(2),
  },
  roomPreviewBold: { fontWeight: '500' },
  badge: {
    minWidth: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(5),
    marginLeft: s(8),
  },
  badgeText: {
    fontSize: fs(11),
    fontWeight: '800',
    color: '#FFF',
  },

  // Separator
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: s(80),
  },

  // List
  list: { flex: 1 },
  listContent: { paddingBottom: vs(40) },
});

export default React.memo(ChatDemoScreen);
