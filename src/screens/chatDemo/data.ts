import type { Contact, GroupRoom } from './types';

// ─── CONTACTS ─────────────────────────────────────────────────────────────
export const CONTACTS: Contact[] = [
  { id: 'u1', name: 'Nguyễn Văn An', emoji: '👨', color: '#6366F1', isOnline: true },
  { id: 'u2', name: 'Trần Thị Bình', emoji: '👩', color: '#EC4899', isOnline: true },
  { id: 'u3', name: 'Lê Hoàng Cường', emoji: '🧑', color: '#F59E0B', isOnline: false },
  { id: 'u4', name: 'Phạm Minh Đức', emoji: '👨‍💻', color: '#10B981', isOnline: true },
  { id: 'u5', name: 'Vũ Quốc Em', emoji: '🧔', color: '#EF4444', isOnline: true },
  { id: 'u6', name: 'Hoàng Anh Fương', emoji: '👩‍🦰', color: '#8B5CF6', isOnline: false },
  { id: 'u7', name: 'Đặng Thị Giang', emoji: '👧', color: '#06B6D4', isOnline: true },
  { id: 'u8', name: 'Bùi Văn Hùng', emoji: '🧑‍🦱', color: '#84CC16', isOnline: false },
];

// ─── GROUP ROOMS ──────────────────────────────────────────────────────────
export const GROUP_ROOMS: GroupRoom[] = [
  {
    id: 'g1',
    name: 'Dự án Alpha 🚀',
    emoji: '🚀',
    color: '#3B82F6',
    memberIds: ['u1', 'u2', 'u3', 'u4', 'u5'],
  },
  {
    id: 'g2',
    name: 'Gia Đình Vui Vẻ',
    emoji: '🏠',
    color: '#10B981',
    memberIds: ['u1', 'u2', 'u6'],
  },
  {
    id: 'g3',
    name: 'Team Backend ⚙️',
    emoji: '⚙️',
    color: '#F59E0B',
    memberIds: ['u3', 'u4', 'u5', 'u7'],
  },
  {
    id: 'g4',
    name: 'Lớp 12A1 Reunion 🎓',
    emoji: '🎓',
    color: '#EC4899',
    memberIds: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8'],
  },
];

// ─── PRIVATE ROOM ID HELPER ───────────────────────────────────────────────
export const privateRoomId = (contactId: string) => `private_${contactId}`;

// ─── RANDOM MESSAGES ──────────────────────────────────────────────────────
export const PRIVATE_MSGS = [
  'Ê ê, có rảnh không?',
  'Check tin nhắn gấp nè!',
  'Gửi tài liệu cho tôi nhé.',
  'Tối nay ăn gì?',
  'Ok bạn, tôi hiểu rồi 👍',
  'Cái này hay quá, xem đi!',
  'Rảnh call tí được không?',
  'Đã nhận, cảm ơn bạn!',
  'Ngày mai gặp nhau nhé.',
  'Bạn ơi, giúp mình cái này với.',
  'Haha đúng rồi đó 😂',
  'Thôi được, tôi sẽ xem lại.',
  'Bao giờ xong vậy?',
  'Oke, tí gặp nhau nhé!',
  'Gửi file cho chị xem nha',
];

export const GROUP_MSGS = [
  'Ae ơi, update tiến độ đi!',
  'Mọi người review PR giúp mình.',
  'Deadline sắp tới rồi nha 🔥',
  'Ai online không? Help!',
  'Deploy lên staging thử đi.',
  'Meeting 15 phút nữa nhé.',
  'Cập nhật task trên board đi mọi người.',
  'Bug hotfix xong rồi, test lại giúp.',
  'Tài liệu mới upload rồi nha.',
  'Confirm lại requirement nhé.',
  'Xong chưa ae, sếp đang hỏi 😅',
  'Push code lên nhánh develop nhé.',
  'Ai có thể pair programming không?',
  'Lỗi này khó quá, cần support!',
  'Cuối tuần team building nhé mọi người!',
];

export const MENTION_MSGS = [
  '@bạn, xem lại cái API này giúp!',
  '@bạn check PR gấp nhé!',
  '@bạn sếp gọi bạn kìa 🏃',
  '@bạn review code đi bạn ơi!',
  '@bạn có thể giải thích cái này không?',
];

export const ADMIN_MSGS = [
  '📢 Thông báo: Bảo trì hệ thống tối nay 22h.',
  '⚠️ Quan trọng: Cập nhật policy mới.',
  '🔔 Nhắc nhở: Nộp báo cáo trước 17h.',
  '📌 Pinned: Link meeting hôm nay.',
];

export const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
