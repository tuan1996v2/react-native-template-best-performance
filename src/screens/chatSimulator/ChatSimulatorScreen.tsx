import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyles } from '@/theme/useStyles';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';
import { chatToastManager } from '@/components/ui/toast/ChatToastManager';
import NavigationService from '@/navigation/NavigationService';
import createStyles from './ChatSimulatorScreen.styles';
import { vs, s, ms, fs } from '@/theme/Responsive';
import { StyleSheet } from 'react-native';
const PRIVATE_CONTACTS = [
  {
    id: 'p1',
    name: 'Nguyễn Văn A',
    emoji: '👨',
    color: '#6366F1',
    lastMsg: 'Oke, tí gặp nhau nhé!',
  },
  {
    id: 'p2',
    name: 'Trần Thị B',
    emoji: '👩',
    color: '#EC4899',
    lastMsg: 'Gửi file cho chị xem nha',
  },
  {
    id: 'p3',
    name: 'Lê Hoàng C',
    emoji: '🧑',
    color: '#F59E0B',
    lastMsg: 'Anh rảnh không? Call tí',
  },
  {
    id: 'p4',
    name: 'Phạm Minh D',
    emoji: '👨‍💻',
    color: '#10B981',
    lastMsg: 'Bug fix xong chưa bro?',
  },
  { id: 'p5', name: 'Vũ Quốc E', emoji: '🧔', color: '#EF4444', lastMsg: 'Mai họp 9h sáng nha' },
  { id: 'p6', name: 'Hoàng Anh F', emoji: '👩‍🦰', color: '#8B5CF6', lastMsg: 'Cảm ơn bạn nhiều!' },
];

const GROUP_ROOMS = [
  {
    id: 'g1',
    name: 'Dự án Alpha',
    emoji: '🚀',
    color: '#3B82F6',
    members: ['p1', 'p2', 'p3', 'p4', 'p5'],
    lastMsg: 'Deadline ngày mai rồi!',
  },
  {
    id: 'g2',
    name: 'Gia Đình Vui Vẻ',
    emoji: '🏠',
    color: '#10B981',
    members: ['p1', 'p2', 'p6'],
    lastMsg: 'Cuối tuần về quê nhé',
  },
  {
    id: 'g3',
    name: 'Team Backend',
    emoji: '⚙️',
    color: '#F59E0B',
    members: ['p3', 'p4', 'p5'],
    lastMsg: 'Deploy staging OK chưa?',
  },
  {
    id: 'g4',
    name: 'Lớp 12A1 Reunion',
    emoji: '🎓',
    color: '#EC4899',
    members: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
    lastMsg: 'Hẹn gặp nhau cuối tháng!',
  },
];

const PRIVATE_MSGS = [
  'Ê ê, có rảnh không?',
  'Check tin nhắn gấp nè!',
  'Gửi tài liệu cho tôi nhé.',
  'Tối nay ăn gì?',
  'Ok bạn, tôi hiểu rồi 👍',
  'Rảnh call tí được không?',
  'Đã nhận, cảm ơn bạn!',
  'Ngày mai gặp nhau nhé.',
];
const GROUP_MSGS = [
  'Ae ơi, update tiến độ đi!',
  'Mọi người review PR giúp mình.',
  'Deadline sắp tới rồi nha 🔥',
  'Ai online không? Help!',
  'Deploy lên staging thử đi.',
  'Meeting 15 phút nữa nhé.',
  'Bug hotfix xong rồi, test lại giúp.',
  'Xong chưa ae, sếp đang hỏi 😅',
];
const MENTION_MSGS = [
  '@bạn, xem lại cái API này giúp!',
  '@bạn check PR gấp nhé!',
  '@bạn sếp gọi bạn kìa �',
  '@bạn review code đi bạn ơi!',
];
const ADMIN_MSGS = [
  '📢 Bảo trì hệ thống tối nay 22h.',
  '⚠️ Cập nhật policy mới.',
  '🔔 Nộp báo cáo trước 17h.',
];

const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// ─── LOG ENTRY ─────────────────────────────────────────────────────────────
interface LogEntry {
  id: string;
  time: string;
  text: string;
  type: 'private' | 'group' | 'mention' | 'admin' | 'system';
}

const LOG_COLORS = {
  private: '#6366F1',
  group: '#3B82F6',
  mention: '#F59E0B',
  admin: '#EF4444',
  system: '#64748B',
};

const LOG_ICONS = {
  private: '💬',
  group: '👥',
  mention: '🔔',
  admin: '📢',
  system: '⚙️',
};

// ─── MANUAL TEST SCENARIOS ─────────────────────────────────────────────────
// Each scenario is a self-contained test case for a specific toast behavior
interface Scenario {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  emoji: string;
  run: (addLog: (e: LogEntry) => void) => void;
}

const buildScenarios = (
  addLog: (e: LogEntry) => void,
  intervalsRef: React.RefObject<ReturnType<typeof setInterval>[]>,
  timeoutsRef: React.RefObject<ReturnType<typeof setTimeout>[]>,
): Scenario[] => {
  const schedule = (fn: () => void, delayMs: number) => {
    const t = setTimeout(fn, delayMs);
    timeoutsRef.current?.push(t);
  };

  const firePrivate = (contact: (typeof PRIVATE_CONTACTS)[number], text?: string) => {
    const msg = text ?? rand(PRIVATE_MSGS);
    chatToastManager.onNewMessage({
      id: `${contact.id}_${Date.now()}`,
      senderId: contact.id,
      senderName: contact.name,
      text: msg,
      isGroup: false,
    });
    addLog({
      id: `${Date.now()}_${Math.random()}`,
      time: new Date().toLocaleTimeString('vi', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      text: `[1v1] ${contact.name}: ${msg}`,
      type: 'private',
    });
  };

  const fireGroup = (
    group: (typeof GROUP_ROOMS)[number],
    sender: (typeof PRIVATE_CONTACTS)[number],
    text?: string,
    isMention = false,
    isAdmin = false,
  ) => {
    const msg = text ?? rand(GROUP_MSGS);
    chatToastManager.onNewMessage({
      id: `${group.id}_${Date.now()}`,
      senderId: sender.id,
      senderName: sender.name,
      text: msg,
      isGroup: true,
      groupId: group.id,
      groupName: group.name,
      isMentioned: isMention,
      isAdmin,
    });
    const type = isMention ? 'mention' : isAdmin ? 'admin' : 'group';
    addLog({
      id: `${Date.now()}_${Math.random()}`,
      time: new Date().toLocaleTimeString('vi', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      text: `[${group.name}] ${sender.name}: ${msg}`,
      type,
    });
  };

  return [
    // ── S1: Single private message ──────────────────────────────────────────
    {
      id: 's1',
      label: '1 tin 1v1',
      sublabel: 'Tin nhắn đơn lẻ',
      color: '#6366F1',
      emoji: '💬',
      run: () => firePrivate(PRIVATE_CONTACTS[0]),
    },
    // ── S2: Same sender spam → throttle ────────────────────────────────────
    {
      id: 's2',
      label: 'Spam 1 người',
      sublabel: 'Throttle 3s cùng sender',
      color: '#8B5CF6',
      emoji: '🔇',
      run: () => {
        const c = PRIVATE_CONTACTS[1];
        [0, 400, 800, 1200, 1600].forEach(d => schedule(() => firePrivate(c), d));
      },
    },
    // ── S3: Multi-sender burst → collapse ──────────────────────────────────
    {
      id: 's3',
      label: '3+ người 1v1',
      sublabel: 'Gom "X người nhắn tin"',
      color: '#EC4899',
      emoji: '👥',
      run: () => {
        [0, 200, 400, 600, 800].forEach((d, i) =>
          schedule(() => firePrivate(PRIVATE_CONTACTS[i % PRIVATE_CONTACTS.length]), d),
        );
      },
    },
    // ── S4: Single group message ────────────────────────────────────────────
    {
      id: 's4',
      label: '1 tin nhóm',
      sublabel: 'Tin nhắn nhóm đơn lẻ',
      color: '#3B82F6',
      emoji: '🚀',
      run: () => fireGroup(GROUP_ROOMS[0], PRIVATE_CONTACTS[0]),
    },
    // ── S5: Group spam → aggregate ─────────────────────────────────────────
    {
      id: 's5',
      label: 'Spam nhóm',
      sublabel: 'Gom "X người · Y tin"',
      color: '#0EA5E9',
      emoji: '💥',
      run: () => {
        const g = GROUP_ROOMS[0];
        const members = PRIVATE_CONTACTS.filter(c => g.members.includes(c.id));
        for (let i = 0; i < 12; i++) {
          schedule(() => fireGroup(g, rand(members)), i * 150);
        }
      },
    },
    // ── S6: 2 groups spam simultaneously ───────────────────────────────────
    {
      id: 's6',
      label: '2 nhóm cùng lúc',
      sublabel: 'Mỗi nhóm độc lập',
      color: '#10B981',
      emoji: '⚡',
      run: () => {
        const g1 = GROUP_ROOMS[0];
        const g2 = GROUP_ROOMS[2];
        const m1 = PRIVATE_CONTACTS.filter(c => g1.members.includes(c.id));
        const m2 = PRIVATE_CONTACTS.filter(c => g2.members.includes(c.id));
        for (let i = 0; i < 8; i++) {
          schedule(() => fireGroup(g1, rand(m1)), i * 200);
          schedule(() => fireGroup(g2, rand(m2)), i * 200 + 100);
        }
      },
    },
    // ── S7: Mention (always shows) ─────────────────────────────────────────
    {
      id: 's7',
      label: 'Mention @bạn',
      sublabel: 'Bypass mọi throttle',
      color: '#F59E0B',
      emoji: '🔔',
      run: () => {
        const g = GROUP_ROOMS[0];
        const sender = PRIVATE_CONTACTS[0];
        fireGroup(g, sender, rand(MENTION_MSGS), true, false);
      },
    },
    // ── S8: Admin message ──────────────────────────────────────────────────
    {
      id: 's8',
      label: 'Admin thông báo',
      sublabel: 'Bypass mọi throttle',
      color: '#EF4444',
      emoji: '📢',
      run: () => {
        const g = GROUP_ROOMS[0];
        const sender = PRIVATE_CONTACTS[0];
        fireGroup(g, sender, rand(ADMIN_MSGS), false, true);
      },
    },
    // ── S9: Full chaos — everything at once ────────────────────────────────
    {
      id: 's9',
      label: 'Full Chaos 🔥',
      sublabel: '>150 msg/min tất cả loại',
      color: '#DC2626',
      emoji: '🌪️',
      run: () => {
        // Wave 1: 3 private chats
        [0, 300, 600].forEach((d, i) => {
          const c = PRIVATE_CONTACTS[i];
          [0, 500, 1000, 1500, 2000].forEach(dd => schedule(() => firePrivate(c), d + dd));
        });
        // Wave 2: Group Alpha spam
        const g1 = GROUP_ROOMS[0];
        const m1 = PRIVATE_CONTACTS.filter(c => g1.members.includes(c.id));
        for (let i = 0; i < 20; i++) schedule(() => fireGroup(g1, rand(m1)), 1000 + i * 180);
        // Wave 3: Group Backend spam
        const g3 = GROUP_ROOMS[2];
        const m3 = PRIVATE_CONTACTS.filter(c => g3.members.includes(c.id));
        for (let i = 0; i < 15; i++) schedule(() => fireGroup(g3, rand(m3)), 3000 + i * 200);
        // Wave 4: Mentions during chaos
        schedule(
          () => fireGroup(GROUP_ROOMS[0], PRIVATE_CONTACTS[1], rand(MENTION_MSGS), true),
          2500,
        );
        schedule(
          () => fireGroup(GROUP_ROOMS[0], PRIVATE_CONTACTS[2], rand(MENTION_MSGS), true),
          5000,
        );
        // Wave 5: More private senders
        [3, 4, 5].forEach((ci, i) => {
          [0, 600, 1200].forEach(dd =>
            schedule(() => firePrivate(PRIVATE_CONTACTS[ci]), 4000 + i * 200 + dd),
          );
        });
      },
    },
    // ── S10: Mention during group spam (mention must pierce through) ────────
    {
      id: 's10',
      label: 'Mention trong spam',
      sublabel: 'Mention xuyên qua aggregation',
      color: '#7C3AED',
      emoji: '🎯',
      run: () => {
        const g = GROUP_ROOMS[0];
        const members = PRIVATE_CONTACTS.filter(c => g.members.includes(c.id));
        // Spam first to trigger aggregation
        for (let i = 0; i < 8; i++) schedule(() => fireGroup(g, rand(members)), i * 150);
        // Then fire mention — should still show
        schedule(() => fireGroup(g, PRIVATE_CONTACTS[0], rand(MENTION_MSGS), true), 1500);
      },
    },
  ];
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
const ChatSimulatorScreen = () => {
  const styles = useStyles(createStyles);
  const insets = useSafeAreaInsets();
  const mode = useThemeStore(state => state.mode);
  const theme = ThemeTokens[mode];

  const [isSimulating, setIsSimulating] = useState(false);
  const [totalSent, setTotalSent] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      intervalsRef.current.forEach(clearInterval);
      timeoutsRef.current.forEach(clearTimeout);
      chatToastManager.reset();
    },
    [],
  );

  const addLog = useCallback((entry: LogEntry) => {
    setLogs(prev => [entry, ...prev].slice(0, 80));
    setTotalSent(n => n + 1);
  }, []);

  const scenarios = useMemo(() => buildScenarios(addLog, intervalsRef, timeoutsRef), [addLog]);

  // ── Full auto simulation ──
  const handleStartSimulation = useCallback(() => {
    if (isSimulating) return;
    setIsSimulating(true);
    setUnreadCounts({});
    setLogs([]);
    setTotalSent(0);
    chatToastManager.reset();

    const s9scenario = scenarios.find(sc => sc.id === 's9');
    s9scenario?.run(addLog);

    const t = setTimeout(() => setIsSimulating(false), 14000);
    timeoutsRef.current.push(t);
  }, [isSimulating, scenarios, addLog]);

  const handleStop = useCallback(() => {
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current = [];
    timeoutsRef.current = [];
    setIsSimulating(false);
    chatToastManager.reset();
  }, []);

  const handleReset = useCallback(() => {
    handleStop();
    setUnreadCounts({});
    setLogs([]);
    setTotalSent(0);
  }, [handleStop]);

  const headerPaddingStyle = useMemo(() => ({ paddingTop: insets.top + vs(10) }), [insets.top]);

  const renderChatRoom = useCallback(
    ({
      item,
      isGroup = false,
    }: {
      item: (typeof PRIVATE_CONTACTS)[number] | (typeof GROUP_ROOMS)[number];
      isGroup?: boolean;
    }) => {
      const unread = unreadCounts[item.id] || 0;
      const isActive = false;
      return (
        <Pressable style={[styles.chatRoomItem, isActive && styles.chatRoomItemActive]}>
          <View style={[styles.avatarContainer, { backgroundColor: item.color + '20' }]}>
            <Text style={styles.avatarEmoji}>{item.emoji}</Text>
            {!isGroup && <View style={styles.onlineIndicator} />}
          </View>
          <View style={styles.chatRoomInfo}>
            <View style={styles.chatRoomNameRow}>
              <Text style={styles.chatRoomName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.chatRoomTime}>{isActive ? 'Vừa xong' : '12:30'}</Text>
            </View>
            <Text style={styles.chatRoomLastMessage} numberOfLines={1}>
              {item.lastMsg}
            </Text>
          </View>
          {unread > 0 && (
            <View
              style={[
                styles.unreadBadge,
                // eslint-disable-next-line react-native/no-inline-styles
                { backgroundColor: isGroup ? theme.primary : '#EF4444' },
              ]}>
              <Text style={styles.unreadBadgeText}>{unread > 99 ? '99+' : unread}</Text>
            </View>
          )}
        </Pressable>
      );
    },
    [unreadCounts, styles, theme.primary],
  );

  const renderSeparator = useCallback(() => <View style={styles.separator} />, [styles.separator]);

  type ListItem =
    | { type: 'section'; title: string; key: string }
    | { type: 'private'; data: (typeof PRIVATE_CONTACTS)[number]; key: string }
    | { type: 'group'; data: (typeof GROUP_ROOMS)[number]; key: string };

  const listData: ListItem[] = useMemo(
    () => [
      { type: 'section' as const, title: 'NHÓM CHAT', key: 'sec_group' },
      ...GROUP_ROOMS.map(g => ({ type: 'group' as const, data: g, key: g.id })),
      { type: 'section' as const, title: 'TIN NHẮN RIÊNG', key: 'sec_private' },
      ...PRIVATE_CONTACTS.map(p => ({ type: 'private' as const, data: p, key: p.id })),
    ],
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'section')
        return (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
          </View>
        );
      if (item.type === 'group') return renderChatRoom({ item: item.data, isGroup: true });
      return renderChatRoom({ item: item.data, isGroup: false });
    },
    [renderChatRoom, styles.sectionHeader, styles.sectionTitle],
  );

  const keyExtractor = useCallback((item: ListItem) => item.key, []);

  return (
    <AppScreen edges={['bottom']} backgroundColor={theme.background} statusBarStyle="light-content">
      <View style={styles.root}>
        {/* ─── HEADER ──────────────────────────────────────────── */}
        <LinearGradient
          colors={theme.gradient as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={[styles.headerContainer, headerPaddingStyle]}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>🧪 Toast Simulator</Text>
                <Text style={styles.headerSubtitle}>
                  {isSimulating ? '🔴 Đang chạy...' : 'Test thủ công hoặc chạy tự động'}
                </Text>
              </View>
              <Pressable onPress={() => NavigationService.back()} hitSlop={12}>
                <Text style={styles.textClose}>✕</Text>
              </Pressable>
            </View>
            <View style={styles.controlsRow}>
              <Pressable
                style={[
                  styles.controlButton,
                  isSimulating ? styles.controlButtonInactive : styles.controlButtonActive,
                ]}
                onPress={handleStartSimulation}
                disabled={isSimulating}>
                <Text style={styles.controlButtonText}>▶ Auto</Text>
                <Text style={styles.controlButtonSubtext}>Full chaos</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.controlButton,
                  isSimulating ? styles.controlButtonActive : styles.controlButtonInactive,
                ]}
                onPress={handleStop}
                disabled={!isSimulating}>
                <Text style={styles.controlButtonText}>⏹ Dừng</Text>
                <Text style={styles.controlButtonSubtext}>Stop all</Text>
              </Pressable>
              <Pressable
                style={[styles.controlButton, styles.controlButtonInactive]}
                onPress={handleReset}>
                <Text style={styles.controlButtonText}>↺ Reset</Text>
                <Text style={styles.controlButtonSubtext}>Xoá log</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>

        {/* ─── STAT BAR ────────────────────────────────────────── */}
        <View
          style={[
            styles.statBar,
            { backgroundColor: theme.card, borderBottomColor: theme.divider },
          ]}>
          <View style={[styles.statBadge, { backgroundColor: theme.primary + '18' }]}>
            <Text style={[styles.statBadgeText, { color: theme.primary }]}>{totalSent}</Text>
            <Text style={styles.statLabel}>đã gửi</Text>
          </View>
          <View style={[styles.statBadge, { backgroundColor: theme.success + '18' }]}>
            <Text style={[styles.statBadgeText, { color: theme.success }]}>
              {logs.filter(l => l.type === 'private').length}
            </Text>
            <Text style={styles.statLabel}>1v1</Text>
          </View>
          <View style={[styles.statBadge, { backgroundColor: theme.info + '18' }]}>
            <Text style={[styles.statBadgeText, { color: theme.info }]}>
              {logs.filter(l => l.type === 'group').length}
            </Text>
            <Text style={styles.statLabel}>nhóm</Text>
          </View>
          <View style={[styles.statBadge, { backgroundColor: theme.warning + '18' }]}>
            <Text style={[styles.statBadgeText, { color: theme.warning }]}>
              {logs.filter(l => l.type === 'mention' || l.type === 'admin').length}
            </Text>
            <Text style={styles.statLabel}>priority</Text>
          </View>
        </View>

        {/* ─── MANUAL TEST BUTTONS ─────────────────────────────── */}
        <View style={localStyles.scenarioSection}>
          <Text style={[localStyles.scenarioTitle, { color: theme.textMuted }]}>TEST THỦ CÔNG</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={localStyles.scenarioRow}>
            {scenarios.map(sc => (
              <Pressable
                key={sc.id}
                style={({ pressed }) => [
                  localStyles.scenarioBtn,
                  { backgroundColor: sc.color + '18', borderColor: sc.color + '55' },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => sc.run(addLog)}>
                <Text style={localStyles.scenarioBtnEmoji}>{sc.emoji}</Text>
                <Text style={[localStyles.scenarioBtnLabel, { color: sc.color }]}>{sc.label}</Text>
                <Text style={[localStyles.scenarioBtnSub, { color: theme.textMuted }]}>
                  {sc.sublabel}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ─── LOG + ROOM LIST ─────────────────────────────────── */}
        <View style={localStyles.body}>
          {/* Log panel */}
          <View
            style={[
              localStyles.logPanel,
              { backgroundColor: theme.card, borderColor: theme.divider },
            ]}>
            <Text style={[localStyles.logTitle, { color: theme.textMuted }]}>
              LOG ({logs.length})
            </Text>
            <ScrollView style={localStyles.logScroll} showsVerticalScrollIndicator={false}>
              {logs.length === 0 ? (
                <Text style={[localStyles.logEmpty, { color: theme.textMuted }]}>
                  Chưa có log...
                </Text>
              ) : (
                logs.map(entry => (
                  <View key={entry.id} style={localStyles.logEntry}>
                    <Text style={[localStyles.logIcon]}>{LOG_ICONS[entry.type]}</Text>
                    <View style={localStyles.logEntryContent}>
                      <Text style={[localStyles.logTime, { color: theme.textMuted }]}>
                        {entry.time}
                      </Text>
                      <Text
                        style={[localStyles.logText, { color: LOG_COLORS[entry.type] }]}
                        numberOfLines={2}>
                        {entry.text}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>

          {/* Room list */}
          <FlatList
            style={styles.chatList}
            contentContainerStyle={styles.chatListContent}
            data={listData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={renderSeparator}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </AppScreen>
  );
};

// ─── LOCAL STYLES ──────────────────────────────────────────────────────────
const localStyles = StyleSheet.create({
  scenarioSection: {
    paddingTop: vs(10),
    paddingBottom: vs(6),
  },
  scenarioTitle: {
    fontSize: fs(10),
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: s(16),
    marginBottom: vs(6),
  },
  scenarioRow: {
    paddingHorizontal: s(12),
    gap: s(8),
    paddingBottom: vs(4),
  },
  scenarioBtn: {
    width: s(110),
    paddingVertical: vs(10),
    paddingHorizontal: s(10),
    borderRadius: ms(12),
    borderWidth: 1,
    alignItems: 'center',
    gap: vs(3),
  },
  scenarioBtnEmoji: { fontSize: fs(22) },
  scenarioBtnLabel: { fontSize: fs(12), fontWeight: '700', textAlign: 'center' },
  scenarioBtnSub: { fontSize: fs(10), textAlign: 'center', lineHeight: fs(14) },

  body: {
    flex: 1,
    flexDirection: 'row',
  },
  logPanel: {
    width: s(160),
    borderRightWidth: 1,
    paddingTop: vs(8),
  },
  logTitle: {
    fontSize: fs(10),
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: s(10),
    marginBottom: vs(4),
  },
  logScroll: { flex: 1 },
  logEmpty: { fontSize: fs(11), textAlign: 'center', paddingTop: vs(20) },
  logEntry: {
    flexDirection: 'row',
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    alignItems: 'flex-start',
    gap: s(4),
  },
  logIcon: { fontSize: fs(12), marginTop: vs(1) },
  logEntryContent: { flex: 1 },
  logTime: { fontSize: fs(9) },
  logText: { fontSize: fs(11), fontWeight: '500', lineHeight: fs(15) },
});

export default React.memo(ChatSimulatorScreen);
