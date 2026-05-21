/**
 * ChatToastManager — High-throughput chat notification aggregator
 *
 * Handles >150 messages/minute gracefully, mimicking Zalo's behavior:
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  PRIORITY 1 — Mention / Admin / System                              │
 * │    → Always show immediately, bypass all throttles                  │
 * │                                                                     │
 * │  PRIORITY 2 — Private 1v1                                           │
 * │    • Same sender: throttle 3s (show first, mute rest)               │
 * │    • Multiple senders spamming simultaneously:                      │
 * │      if ≥3 distinct senders active in 4s window                    │
 * │      → collapse to "X người đang nhắn tin cho bạn"                 │
 * │      → cooldown 5s, then reset                                      │
 * │                                                                     │
 * │  PRIORITY 3 — Group chat (per-group, fully independent)             │
 * │    • ≤3 msgs in 5s window → show individually                      │
 * │    • >3 msgs → aggregate: "X người · Y tin · [GroupName]"          │
 * │    • Cooldown 5s per group, then reset                              │
 * │    • Multiple groups spam simultaneously → each handled separately  │
 * └─────────────────────────────────────────────────────────────────────┘
 */

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  isGroup: boolean;
  groupId?: string; // stable room identifier (use this for per-room tracking)
  groupName?: string; // display name
  isMentioned?: boolean;
  isAdmin?: boolean;
  isSystem?: boolean;
}

export type ToastPayload = {
  message: string;
  type: 'success' | 'error' | 'warning';
  duration: number;
  positionDown?: boolean;
};

type ToastListener = (item: ToastPayload) => void;

// ─── Per-room sliding window entry ────────────────────────────────────────
interface WindowEntry {
  senderId: string;
  senderName: string;
  timestamp: number;
}

// ─── Per-room aggregation state ───────────────────────────────────────────
interface RoomState {
  window: WindowEntry[]; // sliding window (last N seconds)
  isAggregating: boolean;
  cooldownUntil: number;
  resetTimer: ReturnType<typeof setTimeout> | null;
}

// ─── Private-burst state (cross-sender) ───────────────────────────────────
interface PrivateBurstState {
  activeSenders: Map<string, number>; // senderId → last message timestamp
  isAggregating: boolean;
  cooldownUntil: number;
  resetTimer: ReturnType<typeof setTimeout> | null;
}

// ─── Tunables ─────────────────────────────────────────────────────────────
const PRIVATE_THROTTLE_MS = 3000; // same sender: mute for 3s after first toast
const PRIVATE_BURST_WINDOW_MS = 4_000; // window to detect multi-sender burst
const PRIVATE_BURST_THRESHOLD = 3; // ≥3 distinct senders → collapse
const PRIVATE_BURST_COOLDOWN_MS = 5_000; // cooldown after private burst toast

const GROUP_WINDOW_MS = 5_000; // sliding window per group
const GROUP_AGGREGATE_THRESHOLD = 3; // >3 msgs in window → aggregate
const GROUP_COOLDOWN_MS = 5_000; // cooldown after aggregate toast

const NORMAL_TOAST_DURATION = 2_500;
const AGGREGATE_TOAST_DURATION = 4_000;
const MENTION_TOAST_DURATION = 4_000;

class ChatToastManager {
  private listeners: Set<ToastListener> = new Set();

  // ── Per-group state (keyed by groupId ?? groupName) ──────────────────────
  private groupStates = new Map<string, RoomState>();

  // ── Private burst state (cross-sender aggregation) ───────────────────────
  private privateBurst: PrivateBurstState = {
    activeSenders: new Map(),
    isAggregating: false,
    cooldownUntil: 0,
    resetTimer: null,
  };

  // ── Per-sender last-toast timestamp (1v1 throttle) ───────────────────────
  private lastPrivateToastTime = new Map<string, number>();

  // ─── Public API ───────────────────────────────────────────────────────────

  addListener(listener: ToastListener) {
    this.listeners.add(listener);
  }

  removeListener(listener: ToastListener) {
    this.listeners.delete(listener);
  }

  onNewMessage(msg: ChatMessage): void {
    // ── PRIORITY 1: High-priority always bypasses everything ──────────────
    if (msg.isMentioned || msg.isAdmin || msg.isSystem) {
      this.handleHighPriority(msg);
      return;
    }

    if (msg.isGroup) {
      this.handleGroup(msg);
    } else {
      this.handlePrivate(msg);
    }
  }

  /** Reset all state (useful for testing / screen unmount) */
  reset(): void {
    // Clear all group timers
    this.groupStates.forEach(state => {
      if (state.resetTimer !== null) clearTimeout(state.resetTimer);
    });
    this.groupStates.clear();

    // Clear private burst timer
    if (this.privateBurst.resetTimer !== null) {
      clearTimeout(this.privateBurst.resetTimer);
    }
    this.privateBurst = {
      activeSenders: new Map(),
      isAggregating: false,
      cooldownUntil: 0,
      resetTimer: null,
    };

    this.lastPrivateToastTime.clear();
  }

  // ─── PRIORITY 1: Mention / Admin / System ─────────────────────────────────
  private handleHighPriority(msg: ChatMessage): void {
    let text: string;
    if (msg.isMentioned) {
      const ctx = msg.groupName ? ` trong ${msg.groupName}` : '';
      text = `🔔 ${msg.senderName} nhắc đến bạn${ctx}: "${msg.text}"`;
    } else if (msg.isAdmin) {
      text = `📢 ${msg.groupName ?? msg.senderName}: ${msg.text}`;
    } else {
      text = `⚙️ Hệ thống: ${msg.text}`;
    }
    this.emit({ message: text, type: 'warning', duration: MENTION_TOAST_DURATION });
  }

  // ─── PRIORITY 2: Private 1v1 ──────────────────────────────────────────────
  private handlePrivate(msg: ChatMessage): void {
    const now = Date.now();

    // ── Step A: Update private burst tracker ──────────────────────────────
    this.privateBurst.activeSenders.set(msg.senderId, now);

    // Evict senders outside the burst window
    this.privateBurst.activeSenders.forEach((ts, id) => {
      if (now - ts > PRIVATE_BURST_WINDOW_MS) {
        this.privateBurst.activeSenders.delete(id);
      }
    });

    const activeSenderCount = this.privateBurst.activeSenders.size;

    // ── Step B: Check if we're in private burst cooldown ─────────────────
    if (now < this.privateBurst.cooldownUntil) {
      // Silently swallow — burst toast already shown
      return;
    }

    // ── Step C: Detect multi-sender burst → collapse ──────────────────────
    if (activeSenderCount >= PRIVATE_BURST_THRESHOLD && !this.privateBurst.isAggregating) {
      this.privateBurst.isAggregating = true;
      this.privateBurst.cooldownUntil = now + PRIVATE_BURST_COOLDOWN_MS;

      const text = `💬 ${activeSenderCount} người đang nhắn tin cho bạn`;
      this.emit({ message: text, type: 'success', duration: AGGREGATE_TOAST_DURATION });

      // Schedule reset
      if (this.privateBurst.resetTimer !== null) clearTimeout(this.privateBurst.resetTimer);
      this.privateBurst.resetTimer = setTimeout(() => {
        this.privateBurst.isAggregating = false;
        this.privateBurst.cooldownUntil = 0;
        this.privateBurst.activeSenders.clear();
        this.privateBurst.resetTimer = null;
        this.lastPrivateToastTime.clear(); // allow fresh toasts after burst ends
      }, PRIVATE_BURST_COOLDOWN_MS);

      return;
    }

    // ── Step D: Single-sender throttle ────────────────────────────────────
    const lastTime = this.lastPrivateToastTime.get(msg.senderId) ?? 0;
    if (now - lastTime < PRIVATE_THROTTLE_MS) {
      // Same sender spamming — mute
      return;
    }

    this.lastPrivateToastTime.set(msg.senderId, now);
    const text = `💬 ${msg.senderName}: ${msg.text}`;
    this.emit({ message: text, type: 'success', duration: NORMAL_TOAST_DURATION });
  }

  // ─── PRIORITY 3: Group chat (per-group, fully independent) ────────────────
  private handleGroup(msg: ChatMessage): void {
    const now = Date.now();
    const roomKey = msg.groupId ?? msg.groupName ?? 'unknown_group';

    // ── Get or create per-room state ──────────────────────────────────────
    if (!this.groupStates.has(roomKey)) {
      this.groupStates.set(roomKey, {
        window: [],
        isAggregating: false,
        cooldownUntil: 0,
        resetTimer: null,
      });
    }
    const state = this.groupStates.get(roomKey)!;

    // ── Evict old entries from sliding window ─────────────────────────────
    const cutoff = now - GROUP_WINDOW_MS;
    let evict = 0;
    while (evict < state.window.length && state.window[evict].timestamp < cutoff) {
      evict++;
    }
    if (evict > 0) state.window.splice(0, evict);

    // ── Push current message ──────────────────────────────────────────────
    state.window.push({ senderId: msg.senderId, senderName: msg.senderName, timestamp: now });

    // ── Check cooldown ────────────────────────────────────────────────────
    if (now < state.cooldownUntil) {
      // In cooldown — swallow silently
      return;
    }

    const windowSize = state.window.length;

    if (windowSize <= GROUP_AGGREGATE_THRESHOLD) {
      // ── Normal: show individual toast ────────────────────────────────────
      if (state.isAggregating) {
        // Just came out of aggregation but cooldown expired — reset flag
        state.isAggregating = false;
      }
      const groupLabel = msg.groupName ? `[${msg.groupName}] ` : '';
      const text = `${groupLabel}${msg.senderName}: ${msg.text}`;
      this.emit({ message: text, type: 'success', duration: NORMAL_TOAST_DURATION });
    } else {
      // ── Aggregate: enter aggregation mode ────────────────────────────────
      if (state.isAggregating) {
        // Already aggregating → swallow
        return;
      }

      state.isAggregating = true;
      state.cooldownUntil = now + GROUP_COOLDOWN_MS;

      // Count unique senders in window
      const uniqueSenders = new Set(state.window.map(e => e.senderId));
      const groupName = msg.groupName ?? 'nhóm';
      const text =
        uniqueSenders.size === 1
          ? `[${groupName}] ${msg.senderName} vừa gửi ${windowSize} tin nhắn`
          : `[${groupName}] ${uniqueSenders.size} người · ${windowSize} tin nhắn mới`;

      this.emit({ message: text, type: 'success', duration: AGGREGATE_TOAST_DURATION });

      // Schedule reset after cooldown
      if (state.resetTimer !== null) clearTimeout(state.resetTimer);
      state.resetTimer = setTimeout(() => {
        state.isAggregating = false;
        state.cooldownUntil = 0;
        state.window = [];
        state.resetTimer = null;
      }, GROUP_COOLDOWN_MS);
    }
  }

  // ─── Emit to all listeners ────────────────────────────────────────────────
  private emit(payload: ToastPayload): void {
    this.listeners.forEach(listener => listener(payload));
  }
}

export const chatToastManager = new ChatToastManager();
