// ─── CHAT DEMO TYPES ──────────────────────────────────────────────────────

export interface Contact {
  id: string;
  name: string;
  emoji: string;
  color: string;
  isOnline: boolean;
}

export interface GroupRoom {
  id: string;
  name: string;
  emoji: string;
  color: string;
  memberIds: string[];
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderEmoji: string;
  senderColor: string;
  text: string;
  timestamp: number;
  isGroup: boolean;
  isMentioned?: boolean;
  isAdmin?: boolean;
}

export type Room = { kind: 'private'; contact: Contact } | { kind: 'group'; group: GroupRoom };

export interface RoomMeta {
  roomId: string;
  unread: number;
  lastMessage: string;
  lastSenderName: string;
  lastTimestamp: number;
  isActive: boolean; // đang nhận tin nhắn mới
}
