import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CONTACTS,
  GROUP_ROOMS,
  PRIVATE_MSGS,
  GROUP_MSGS,
  MENTION_MSGS,
  ADMIN_MSGS,
  privateRoomId,
  rand,
} from './data';
import type { ChatMessage, RoomMeta } from './types';

// ─── MAX MESSAGES PER ROOM (tránh memory leak) ────────────────────────────
const MAX_MESSAGES_PER_ROOM = 200;

// ─── AGGREGATION: nếu 1 phòng gửi > N tin trong 5s → gom lại ─────────────
const AGGREGATE_THRESHOLD = 5;
const AGGREGATE_WINDOW_MS = 5000;

interface AggregateState {
  count: number;
  senders: Set<string>;
  windowStart: number;
  isAggregating: boolean;
  cooldownUntil: number;
}

export const useChatSimulator = () => {
  // messages: roomId → ChatMessage[]
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  // roomMeta: roomId → RoomMeta
  const [roomMeta, setRoomMeta] = useState<Record<string, RoomMeta>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [totalReceived, setTotalReceived] = useState(0);

  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const aggregateRef = useRef<Record<string, AggregateState>>({});

  // ── Cleanup on unmount ──
  useEffect(
    () => () => {
      intervalsRef.current.forEach(clearInterval);
      timeoutsRef.current.forEach(clearTimeout);
    },
    [],
  );

  // ─── CORE: add a message to a room ──────────────────────────────────────
  const addMessage = useCallback((msg: ChatMessage) => {
    const roomId = msg.roomId;

    // ── Aggregation logic ──
    const now = Date.now();
    if (!aggregateRef.current[roomId]) {
      aggregateRef.current[roomId] = {
        count: 0,
        senders: new Set(),
        windowStart: now,
        isAggregating: false,
        cooldownUntil: 0,
      };
    }
    const agg = aggregateRef.current[roomId];

    // Reset window if expired
    if (now - agg.windowStart > AGGREGATE_WINDOW_MS) {
      agg.count = 0;
      agg.senders = new Set();
      agg.windowStart = now;
      agg.isAggregating = false;
    }

    agg.count++;
    agg.senders.add(msg.senderId);

    // If in cooldown → swallow (don't add to messages, just update meta)
    const inCooldown = now < agg.cooldownUntil;

    if (!inCooldown) {
      if (agg.count > AGGREGATE_THRESHOLD && !agg.isAggregating) {
        // Enter aggregation: replace with a summary message
        agg.isAggregating = true;
        agg.cooldownUntil = now + AGGREGATE_WINDOW_MS;

        const summaryMsg: ChatMessage = {
          id: `agg_${roomId}_${now}`,
          roomId,
          senderId: 'system',
          senderName: 'Hệ thống',
          senderEmoji: '📦',
          senderColor: '#64748B',
          text: `${agg.senders.size} người vừa gửi ${agg.count} tin nhắn mới`,
          timestamp: now,
          isGroup: msg.isGroup,
          isAdmin: true,
        };

        setMessages(prev => {
          const existing = prev[roomId] ?? [];
          const updated = [...existing, summaryMsg].slice(-MAX_MESSAGES_PER_ROOM);
          return { ...prev, [roomId]: updated };
        });
      } else if (!agg.isAggregating) {
        // Normal: add message
        setMessages(prev => {
          const existing = prev[roomId] ?? [];
          const updated = [...existing, msg].slice(-MAX_MESSAGES_PER_ROOM);
          return { ...prev, [roomId]: updated };
        });
      }
      // if isAggregating && !inCooldown → cooldown just expired, reset
      if (agg.isAggregating && now >= agg.cooldownUntil) {
        agg.isAggregating = false;
        agg.count = 0;
        agg.senders = new Set();
        agg.windowStart = now;
        // Add this message normally
        setMessages(prev => {
          const existing = prev[roomId] ?? [];
          const updated = [...existing, msg].slice(-MAX_MESSAGES_PER_ROOM);
          return { ...prev, [roomId]: updated };
        });
      }
    }

    // Always update room meta (unread, last message, active indicator)
    setRoomMeta(prev => {
      const existing = prev[roomId];
      return {
        ...prev,
        [roomId]: {
          roomId,
          unread: (existing?.unread ?? 0) + 1,
          lastMessage: msg.text,
          lastSenderName: msg.senderName,
          lastTimestamp: now,
          isActive: true,
        },
      };
    });

    // Deactivate "isActive" after 2s
    const t = setTimeout(() => {
      setRoomMeta(prev => {
        const cur = prev[roomId];
        if (!cur) return prev;
        return { ...prev, [roomId]: { ...cur, isActive: false } };
      });
    }, 2000);
    timeoutsRef.current.push(t);

    setTotalReceived(n => n + 1);
  }, []);

  // ─── SIMULATE PRIVATE CHAT ───────────────────────────────────────────────
  const simulatePrivate = useCallback(
    (contactIdx: number, count: number, intervalMs: number) => {
      const contact = CONTACTS[contactIdx];
      if (!contact) return;
      const roomId = privateRoomId(contact.id);
      let sent = 0;

      const id = setInterval(() => {
        const msg: ChatMessage = {
          id: `${roomId}_${Date.now()}_${Math.random()}`,
          roomId,
          senderId: contact.id,
          senderName: contact.name,
          senderEmoji: contact.emoji,
          senderColor: contact.color,
          text: rand(PRIVATE_MSGS),
          timestamp: Date.now(),
          isGroup: false,
        };
        addMessage(msg);
        sent++;
        if (sent >= count) clearInterval(id);
      }, intervalMs);

      intervalsRef.current.push(id);
    },
    [addMessage],
  );

  // ─── SIMULATE GROUP CHAT ─────────────────────────────────────────────────
  const simulateGroup = useCallback(
    (
      groupIdx: number,
      count: number,
      intervalMs: number,
      mentionChance = 0.1,
      adminChance = 0.05,
    ) => {
      const group = GROUP_ROOMS[groupIdx];
      if (!group) return;
      const roomId = group.id;
      const members = CONTACTS.filter(c => group.memberIds.includes(c.id));
      let sent = 0;

      const id = setInterval(() => {
        const sender = rand(members);
        const r = Math.random();
        const isMention = r < mentionChance;
        const isAdmin = !isMention && r < mentionChance + adminChance;

        let text: string;
        if (isMention) text = rand(MENTION_MSGS);
        else if (isAdmin) text = rand(ADMIN_MSGS);
        else text = rand(GROUP_MSGS);

        const msg: ChatMessage = {
          id: `${roomId}_${Date.now()}_${Math.random()}`,
          roomId,
          senderId: sender.id,
          senderName: sender.name,
          senderEmoji: sender.emoji,
          senderColor: sender.color,
          text,
          timestamp: Date.now(),
          isGroup: true,
          isMentioned: isMention,
          isAdmin,
        };
        addMessage(msg);
        sent++;
        if (sent >= count) clearInterval(id);
      }, intervalMs);

      intervalsRef.current.push(id);
    },
    [addMessage],
  );

  // ─── START FULL SIMULATION ───────────────────────────────────────────────
  const startSimulation = useCallback(() => {
    if (isSimulating) return;
    setIsSimulating(true);
    aggregateRef.current = {};

    const delay = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timeoutsRef.current.push(t);
    };

    // Wave 1: 3 private chats fire simultaneously
    delay(() => simulatePrivate(0, 8, 600), 0);
    delay(() => simulatePrivate(1, 5, 700), 500);
    delay(() => simulatePrivate(2, 6, 500), 1200);

    // Wave 2: Group Alpha spams hard (triggers aggregation)
    delay(() => simulateGroup(0, 25, 180, 0.12, 0.05), 2000);

    // Wave 3: Another group joins
    delay(() => simulateGroup(1, 12, 350, 0.08, 0.04), 4000);

    // Wave 4: More private chats during group spam
    delay(() => simulatePrivate(3, 4, 800), 5000);
    delay(() => simulatePrivate(4, 5, 600), 5800);
    delay(() => simulatePrivate(5, 3, 900), 6500);

    // Wave 5: Intense burst from group 3
    delay(() => simulateGroup(2, 18, 150, 0.15, 0.08), 7500);

    // Wave 6: Group 4 (lớp reunion) joins late
    delay(() => simulateGroup(3, 10, 400, 0.06, 0.03), 9000);

    // Wave 7: Final private burst
    delay(() => simulatePrivate(6, 4, 500), 10500);
    delay(() => simulatePrivate(7, 3, 700), 11000);

    // End
    delay(() => setIsSimulating(false), 14000);
  }, [isSimulating, simulatePrivate, simulateGroup]);

  // ─── STOP ────────────────────────────────────────────────────────────────
  const stopSimulation = useCallback(() => {
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
    setIsSimulating(false);
  }, []);

  // ─── RESET ───────────────────────────────────────────────────────────────
  const resetSimulation = useCallback(() => {
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current = [];
    timeoutsRef.current = [];
    aggregateRef.current = {};
    setIsSimulating(false);
    setMessages({});
    setRoomMeta({});
    setTotalReceived(0);
  }, []);

  // ─── MARK ROOM AS READ ───────────────────────────────────────────────────
  const markRoomRead = useCallback((roomId: string) => {
    setRoomMeta(prev => {
      const cur = prev[roomId];
      if (!cur) return prev;
      return { ...prev, [roomId]: { ...cur, unread: 0 } };
    });
  }, []);

  return {
    messages,
    roomMeta,
    isSimulating,
    totalReceived,
    startSimulation,
    stopSimulation,
    resetSimulation,
    markRoomRead,
  };
};
