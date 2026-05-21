import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';
import { s, vs, ms, fs } from '@/theme/Responsive';
import type { ChatMessage } from './types';

// ─── HELPERS ──────────────────────────────────────────────────────────────
const formatTime = (ts: number) => {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

// ─── BUBBLE COMPONENT ─────────────────────────────────────────────────────
interface BubbleProps {
  msg: ChatMessage;
  prevMsg: ChatMessage | null;
  isGroup: boolean;
  theme: AppTheme;
}

const MY_ID = 'me';

const MessageBubble = React.memo(({ msg, prevMsg, isGroup, theme }: BubbleProps) => {
  const isMe = msg.senderId === MY_ID;
  const isSystem = msg.senderId === 'system' || msg.isAdmin;
  const showAvatar = isGroup && !isMe && (prevMsg?.senderId !== msg.senderId || !prevMsg);
  const showName = isGroup && !isMe && showAvatar;

  if (isSystem) {
    return (
      <View style={styles.systemRow}>
        <View style={[styles.systemBubble, { backgroundColor: theme.inputBg }]}>
          <Text style={[styles.systemText, { color: theme.textMuted }]}>{msg.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowOther]}>
      {/* Avatar (group only, other side) */}
      {isGroup && !isMe && (
        <View style={styles.avatarSlot}>
          {showAvatar ? (
            <View style={[styles.bubbleAvatar, { backgroundColor: msg.senderColor + '25' }]}>
              <Text style={styles.bubbleAvatarEmoji}>{msg.senderEmoji}</Text>
            </View>
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </View>
      )}

      <View
        style={[styles.bubbleContent, isMe ? styles.bubbleContentMe : styles.bubbleContentOther]}>
        {showName && (
          <Text style={[styles.senderName, { color: msg.senderColor }]}>{msg.senderName}</Text>
        )}
        <View
          style={[
            styles.bubble,
            isMe
              ? [styles.bubbleMe, { backgroundColor: theme.primary }]
              : [styles.bubbleOther, { backgroundColor: theme.card, borderColor: theme.divider }],
            msg.isMentioned && styles.bubbleMention,
          ]}>
          <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : { color: theme.text }]}>
            {msg.text}
          </Text>
        </View>
        <Text style={[styles.bubbleTime, { color: theme.textMuted }, isMe && styles.bubbleTimeMe]}>
          {formatTime(msg.timestamp)}
        </Text>
      </View>
    </View>
  );
});

// ─── CHAT ROOM SCREEN ─────────────────────────────────────────────────────
interface ChatRoomScreenProps {
  roomId: string;
  roomName: string;
  roomEmoji: string;
  roomColor: string;
  isGroup: boolean;
  messages: ChatMessage[];
  onBack: () => void;
  onMarkRead: (roomId: string) => void;
}

const ChatRoomScreen = ({
  roomId,
  roomName,
  roomEmoji,
  roomColor,
  isGroup,
  messages,
  onBack,
  onMarkRead,
}: ChatRoomScreenProps) => {
  const insets = useSafeAreaInsets();
  const mode = useThemeStore(state => state.mode);
  const theme = ThemeTokens[mode];
  const listRef = useRef<FlatList>(null);

  // Mark as read when opened
  useEffect(() => {
    onMarkRead(roomId);
  }, [roomId, onMarkRead]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      const t = setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 80);
      return () => clearTimeout(t);
    }
  }, [messages.length]);

  const renderItem = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => {
      const prevMsg = index > 0 ? messages[index - 1] : null;
      return <MessageBubble msg={item} prevMsg={prevMsg} isGroup={isGroup} theme={theme} />;
    },
    [messages, isGroup, theme],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  const emptyComponent = useMemo(
    () => (
      <View style={styles.emptyChat}>
        <Text style={styles.emptyChatEmoji}>{roomEmoji}</Text>
        <Text style={[styles.emptyChatText, { color: theme.textMuted }]}>
          Chưa có tin nhắn nào.{'\n'}Đang chờ mô phỏng...
        </Text>
      </View>
    ),
    [roomEmoji, theme.textMuted],
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* ─── HEADER ─────────────────────────────────────────── */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + vs(8),
            backgroundColor: theme.card,
            borderBottomColor: theme.divider,
          },
        ]}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={12}>
          <Text style={[styles.backIcon, { color: theme.primary }]}>‹</Text>
        </Pressable>
        <View style={[styles.headerAvatar, { backgroundColor: roomColor + '25' }]}>
          <Text style={styles.headerAvatarEmoji}>{roomEmoji}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: theme.text }]} numberOfLines={1}>
            {roomName}
          </Text>
          <Text style={[styles.headerSub, { color: theme.textMuted }]}>
            {isGroup ? 'Nhóm chat' : 'Đang hoạt động'}
          </Text>
        </View>
      </View>

      {/* ─── MESSAGES ───────────────────────────────────────── */}
      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={emptyComponent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={15}
        windowSize={10}
        initialNumToRender={20}
      />

      {/* ─── INPUT BAR (decorative) ──────────────────────────── */}
      <View
        style={[
          styles.inputBar,
          {
            paddingBottom: insets.bottom + vs(8),
            backgroundColor: theme.card,
            borderTopColor: theme.divider,
          },
        ]}>
        <View style={[styles.inputBox, { backgroundColor: theme.inputBg }]}>
          <Text style={[styles.inputPlaceholder, { color: theme.textMuted }]}>
            Nhập tin nhắn...
          </Text>
        </View>
        <View style={[styles.sendBtn, { backgroundColor: theme.primary }]}>
          <Text style={styles.sendIcon}>➤</Text>
        </View>
      </View>
    </View>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingBottom: vs(12),
    borderBottomWidth: 1,
  },
  backBtn: {
    marginRight: s(8),
    paddingHorizontal: s(4),
  },
  backIcon: {
    fontSize: fs(32),
    fontWeight: '300',
    lineHeight: fs(36),
  },
  headerAvatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(10),
  },
  headerAvatarEmoji: { fontSize: fs(20) },
  headerInfo: { flex: 1 },
  headerName: { fontSize: fs(16), fontWeight: '700' },
  headerSub: { fontSize: fs(12), marginTop: vs(1) },

  // List
  listContent: {
    paddingHorizontal: s(12),
    paddingTop: vs(12),
    paddingBottom: vs(8),
    flexGrow: 1,
  },

  // Bubble row
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: vs(4),
    alignItems: 'flex-end',
  },
  bubbleRowMe: { justifyContent: 'flex-end' },
  bubbleRowOther: { justifyContent: 'flex-start' },

  // Avatar slot (group)
  avatarSlot: { width: ms(34), marginRight: s(6) },
  bubbleAvatar: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleAvatarEmoji: { fontSize: fs(15) },
  avatarPlaceholder: { width: ms(30) },

  // Bubble content
  bubbleContent: { maxWidth: '72%' },
  bubbleContentMe: { alignItems: 'flex-end' },
  bubbleContentOther: { alignItems: 'flex-start' },

  senderName: {
    fontSize: fs(11),
    fontWeight: '600',
    marginBottom: vs(2),
    marginLeft: s(4),
  },

  bubble: {
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    borderRadius: ms(18),
  },
  bubbleMe: {
    borderBottomRightRadius: ms(4),
  },
  bubbleOther: {
    borderWidth: 1,
    borderBottomLeftRadius: ms(4),
  },
  bubbleMention: {
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  bubbleText: {
    fontSize: fs(14),
    lineHeight: fs(20),
  },
  bubbleTextMe: {
    color: '#FFFFFF',
  },
  bubbleTime: {
    fontSize: fs(10),
    marginTop: vs(2),
    marginHorizontal: s(4),
  },
  bubbleTimeMe: { textAlign: 'right' },

  // System message
  systemRow: {
    alignItems: 'center',
    marginVertical: vs(6),
  },
  systemBubble: {
    paddingHorizontal: s(14),
    paddingVertical: vs(5),
    borderRadius: ms(12),
  },
  systemText: {
    fontSize: fs(11),
    textAlign: 'center',
  },

  // Empty
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: vs(80),
  },
  emptyChatEmoji: { fontSize: fs(48), marginBottom: vs(12) },
  emptyChatText: {
    fontSize: fs(14),
    textAlign: 'center',
    lineHeight: fs(22),
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingTop: vs(10),
    borderTopWidth: 1,
    gap: s(8),
  },
  inputBox: {
    flex: 1,
    height: vs(40),
    borderRadius: ms(20),
    paddingHorizontal: s(16),
    justifyContent: 'center',
  },
  inputPlaceholder: { fontSize: fs(14) },
  sendBtn: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: { fontSize: fs(16), color: '#FFF' },
});

export default React.memo(ChatRoomScreen);
