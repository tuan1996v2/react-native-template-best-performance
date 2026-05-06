import { Platform, PermissionsAndroid } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import {
  getMessaging,
  getToken,
  onTokenRefresh,
  requestPermission,
  onMessage,
  setBackgroundMessageHandler,
  onNotificationOpenedApp,
  getInitialNotification,
  AuthorizationStatus,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import NavigationService from '@/navigation/NavigationService';
import { toast } from '@/components/portals/alert/useAlertStore';

// ─── SINGLETON (tránh gọi getMessaging() nhiều lần) ──────────
const messaging = getMessaging();

const CHANNEL_ID = 'default_channel_id_v2';

// 1. Tạo Channel
export const createDefaultNotificationChannel = async () => {
  try {
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'Default Channel',
      sound: 'default',
      importance: AndroidImportance.HIGH,
    });
    console.log('[FCM] ✅ Channel created');
  } catch (error) {
    console.error('[FCM] ❌ Channel error:', error);
  }
};

// 2. Xin quyền Android 13+
const requestAndroidPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

// 3. Lấy Token
export const getFCMTokenAndSendToServer = async (setDeviceToken?: (token: string) => void) => {
  try {
    const permissionGranted = await requestAndroidPermission();

    if (!permissionGranted) {
      console.log('[FCM] ❌ Không có quyền POST_NOTIFICATIONS');
      return;
    }

    const token = await getToken(messaging);
    if (token) {
      setDeviceToken?.(token);
      console.log('[FCM] 🎯 Token:', token);
    }
  } catch (error) {
    console.error('[FCM] ❌ Token error:', error);
    toast.error('Lỗi khi lấy token thông báo');
  }
};

// 4. Hiển thị thông báo khi đang mở App (Foreground)
const showLocalNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  if (!remoteMessage?.notification) return;

  try {
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId: CHANNEL_ID,
        pressAction: { id: 'default' },
        importance: AndroidImportance.HIGH,
      },
      data: remoteMessage.data,
    });
  } catch (error) {
    console.log('[FCM] ❌ Local notification error:', error);
  }
};

// 5. Xử lý điều hướng khi bấm vào thông báo
const handleNotificationAction = (remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
  if (!remoteMessage) return;

  const data = remoteMessage.data || remoteMessage;
  const screen = data?.screen;

  console.log('[FCM] 👆 Action:', screen || 'Default');

  if (screen) {
    NavigationService.navigate(screen, { data });
  } else {
    NavigationService.navigate('NotificationScreen');
  }
};

// 6. Setup tổng thể
export const setupFCM = async () => {
  await createDefaultNotificationChannel();

  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;

  if (!enabled) return;

  // 🔄 Token refresh — gửi token mới lên server khi Firebase rotate
  onTokenRefresh(messaging, newToken => {
    console.log('[FCM] 🔄 Token refreshed:', newToken);
    // TODO: Gửi newToken lên server API của bạn
  });

  // Lắng nghe Foreground
  onMessage(messaging, async remoteMessage => {
    console.log('[FCM] 🔔 Foreground message');
    await showLocalNotification(remoteMessage);
  });

  // Lắng nghe Background (Firebase)
  setBackgroundMessageHandler(messaging, async () => {
    console.log('[FCM] 💤 Background message');
  });

  // Lắng nghe tương tác Foreground (Notifee)
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      handleNotificationAction(detail.notification);
    }
  });

  // 🔧 Background event handler (BẮT BUỘC cho Notifee)
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      handleNotificationAction(detail.notification);
    }
  });

  // App mở từ background
  onNotificationOpenedApp(messaging, remoteMessage => {
    handleNotificationAction(remoteMessage);
  });

  // App mở từ trạng thái tắt hẳn (Killed)
  getInitialNotification(messaging).then(remoteMessage => {
    if (remoteMessage) handleNotificationAction(remoteMessage);
  });
};
