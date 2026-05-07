# 🚀 Tuấn's React Native Template

> *"Đời dev không khổ, chỉ là chưa có template xịn thôi!"* — Tuấn, Mobile Developer

[![React Native](https://img.shields.io/badge/React%20Native-0.84.0-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Zustand](https://img.shields.io/badge/Zustand-5.x-orange?style=for-the-badge)](https://zustand-demo.pmnd.rs)
[![Node](https://img.shields.io/badge/Node-%3E%3D%2022.11.0-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)

---

## 👋 Xin chào! Tôi là Tuấn

Một **Mobile Developer** đam mê React Native, thích code sạch, ghét code lặp, và luôn ám ảnh bởi câu hỏi: *"Làm sao để project mới không phải setup lại từ đầu?"*

Template này là **tâm huyết** của tôi — sinh ra từ hàng trăm giờ code, vô số lần "tại sao lại crash", và rất nhiều cốc cà phê ☕. Mục tiêu: **clone về, chạy thẳng, code ngay** — không drama, không config hell.

---

## ✨ Tính năng nổi bật

| Tính năng | Mô tả | Trạng thái |
|-----------|-------|:----------:|
| 🎨 **Dark/Light Theme** | Hệ thống theme token hoàn chỉnh với `useStyles` hook, đổi theme mượt như bơ | ✅ |
| 📱 **Responsive Scaling** | Scale tự động theo iPhone 14 (390x844), hỗ trợ `s()`, `vs()`, `ms()`, `fs()` | ✅ |
| 🌍 **Đa ngôn ngữ (i18n)** | Tiếng Việt 🇻🇳 + English 🇺🇸, tự detect ngôn ngữ thiết bị | ✅ |
| 🔥 **Firebase Push Notification** | FCM Modular API v23 + Notifee, foreground/background/killed + token refresh | ✅ |
| 🧭 **Navigation v8** | React Navigation Static API + Performance Tracker đo ms chuyển màn | ✅ |
| ⚡ **Zustand State Management** | 3 store sẵn sàng: Loading, Navigation, Theme — gọi được cả ngoài component | ✅ |
| 🔔 **Toast & Alert System** | Custom alert + toast (success/error/warning) — không phụ thuộc thư viện | ✅ |
| 💀 **Skeleton Loading** | Component skeleton đẹp mắt, plug-and-play | ✅ |
| 🧱 **UI Kit sẵn sàng** | AppButton (3D depth), AppPress (ripple), AppTextInput, AppImage (3-layer progressive) | ✅ |
| 🖼️ **SVG Icon System** | Tích hợp bộ icon SVG tự quản lý (`react-native-svg`), giải quyết triệt để lỗi font iOS | ✅ |
| 🎬 **Professional Stories** | Hệ thống Story giống Instagram: progress bar Reanimated, carousel mượt mà, tap-to-next | ✅ |
| 🖼️ **SuperGallery** | Xem ảnh full-screen zoom+swipe, zero re-render với `useImperativeHandle` | ✅ |
| 🎠 **SuperBanner** | Auto-play carousel với parallax + scale animation, pagination dots | ✅ |
| 🚀 **Performance Optimized** | `useAnimatedScrollHandler`, `memo` comparators, pre-computed styles, Reanimated 4 | ✅ |
| 🔍 **Render Tracking** | `useRenderLog` hook — phát hiện re-render thừa trong dev mode | ✅ |
| 🏗️ **Multi-Environment Build** | Script tự động switch Dev/Prod (Firebase config, app name, version) | ✅ |
| 🛠️ **Reactotron Debug** | Tích hợp sẵn Reactotron cho networking, state, async storage | ✅ |
| 📐 **ESLint + Prettier + Husky** | Lint staged, auto-fix import, sắp xếp import, format khi commit | ✅ |
| ⌨️ **Keyboard Controller** | Xử lý keyboard trên cả Android + iOS một cách nhất quán | ✅ |
| 🎬 **Boot Splash** | Splash screen native, ẩn khi navigation ready | ✅ |
| 💾 **MMKV Storage** | Storage nhanh gấp 30x AsyncStorage | ✅ |
| 🖐️ **Swipeable Items** | Hệ thống vuốt chạm mượt mà (Left/Right/Full Swipe) — xử lý 100% trên UI thread | ✅ |
| 📸 **Pro Camera System** | Camera module zero-re-render, focus on tap, background gallery save | ✅ |

---

## 📁 Cấu trúc Source Code

```
template/
├── App.tsx                    # 🏠 Entry point — đơn giản, sạch sẽ
├── index.js                   # 📌 Đăng ký app
├── build.sh                   # 🏗️ Script build multi-env (dev/prod)
├── firebase.json              # 🔥 Firebase config (RNFB đọc từ root)
├── ReactotronConfig.js        # 🛠️ Config debug tool
│
├── src/
│   ├── api/                   # 🌐 API Layer
│   │   ├── apiClient.ts       #     Axios client (interceptors, token, v.v.)
│   │   └── endpoints.ts       #     Danh sách API endpoints
│   │
│   ├── assets/                # 🎨 Tài nguyên tĩnh
│   │   ├── animations/        #     Lottie hoặc animations
│   │   ├── bootsplash/        #     Assets cho splash screen
│   │   ├── fonts/             #     Custom fonts
│   │   ├── icon/              #     ✨ SVG Icon System (react-native-svg)
│   │   ├── images/            #     Hình ảnh
│   │   └── logo.png           #     Logo app
│   │
│   ├── components/            # 🧩 Components tái sử dụng
│   │   ├── portals/           #     Components "bay" trên mọi màn hình
│   │   │   ├── AppProvider.tsx         # Provider tổng (SafeArea, i18n, FCM, ...)
│   │   │   ├── GlobalLoadingComponent  # Loading overlay toàn app
│   │   │   └── alert/                  # Custom Alert + Toast system
│   │   │       ├── CustomAlert.tsx
│   │   │       ├── Message.tsx
│   │   │       ├── ToastContainer.tsx
│   │   │       └── useAlertStore.ts    # Zustand store cho alert/toast
│   │   │
│   │   └── ui/                #     UI Kit
│   │       ├── appButton/     #     Button 3D với depth effect
│   │       ├── appPress/      #     Pressable với ripple animation
│   │       ├── appTextInput/  #     Text input tùy chỉnh
│   │       ├── appImage/      #     Image 3-layer (skeleton → thumbnail → full)
│   │       ├── skeleton/      #     Skeleton loading placeholder
│   │       ├── superGallery/  #     🖼️ Full-screen image viewer (zoom + swipe)
│   │       ├── superBanner/   #     Carousel auto-play với parallax
│   │       └── swipeItem/     #     🖐️ Swipeable Item (Gesture + Reanimated)
│   │
│   ├── env/                   # ⚙️ Cấu hình môi trường
│   │   ├── index.tsx          #     Export ENV, BASE_URL, IS_DEV, ...
│   │   ├── config/            #     Firebase configs
│   │   │   ├── development/   #     GoogleService-Info.plist + google-services.json (DEV)
│   │   │   └── production/    #     GoogleService-Info.plist + google-services.json (PROD)
│   │   └── scripts/           #     Scripts auto-switch environment
│   │
│   ├── firebase/              # 🔥 Firebase services
│   │   └── fcmService.ts      #     FCM Modular API — token, permission, notification
│   │
│   ├── hooks/                 # 🪝 Custom Hooks
│   │   └── useRenderLog.ts    #     🔍 Debug: theo dõi re-render count
│   │
│   ├── i18n/                  # 🌍 Đa ngôn ngữ
│   │   ├── i18n.tsx           #     Config i18next + auto-detect language
│   │   └── locales/
│   │       ├── vi.json        #     🇻🇳 Tiếng Việt
│   │       └── en.json        #     🇺🇸 English
│   │
│   ├── navigation/            # 🧭 Điều hướng
│   │   ├── AppNavigation.tsx  #     Stack navigator (Static API v8)
│   │   ├── NavigationService  #     navigate(), push(), replace(), back() — gọi ở mọi nơi
│   │   └── NavDebugger.tsx    #     Widget debug hiển thị tên màn hình + thời gian chuyển
│   │
│   ├── screens/               # 📱 Màn hình
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx      # Trang chủ — banner, feature grid, demo hub
│   │   │   └── MyModalScreen.tsx   # Modal screen mẫu (transparent + fade)
│   │   └── detail/
│   │       ├── DetailScreen.tsx    # Social Feed — collapsible header, Animated.FlatList
│   │       ├── HeavyItem.tsx       # SocialPostCard — optimized với memo comparator
│   │       └── StoryScreen.tsx     # 🎬 Story viewer chuyên nghiệp (Animated progress, Carousel)
│   │
│   ├── store/                 # 🗃️ State Management (Zustand)
│   │   ├── useLoadingStore    #     Global loading state (gọi được ngoài component)
│   │   ├── useNavigationStore #     Track màn hình hiện tại + thời gian chuyển
│   │   └── useThemeStore      #     Dark/Light mode toggle
│   │
│   ├── theme/                 # 🎨 Design System
│   │   ├── Colors.ts          #     Theme tokens (light/dark)
│   │   ├── Responsive.ts      #     Scale functions: s(), vs(), ms(), fs()
│   │   └── useStyles.ts       #     Hook tạo styles reactive theo theme
│   │
│   ├── types/                 # 📝 TypeScript types
│   └── utils/                 # 🔧 Utilities
│       ├── formatters.ts
│       └── validators.ts
│
├── android/                   # 🤖 Android native project
├── ios/                       # 🍎 iOS native project
└── __tests__/                 # 🧪 Unit tests
```

---

## 🚀 Bắt đầu nhanh

### Yêu cầu hệ thống

- **Node.js** >= 22.11.0
- **Yarn** (khuyến nghị) hoặc npm
- **Xcode** (cho iOS) / **Android Studio** (cho Android)
- Hoàn thành [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment)

### 1️⃣ Clone & Cài đặt

```bash
# Clone repo
git clone <repo-url> my-awesome-app
cd my-awesome-app

# Cài dependencies
yarn install

# Cấu hình Node cho Xcode (quan trọng! ⚠️)
echo "export NODE_BINARY=$(which node)" > .xcode.env.local
```

### 2️⃣ Cài CocoaPods (iOS)

```bash
bundle install                    # Cài Ruby bundler lần đầu
bundle exec pod install           # Cài native dependencies
```

### 3️⃣ Chạy app

```bash
# Khởi động Metro bundler
yarn start

# --- Mở terminal mới ---

# 🍎 Chạy iOS (tự switch sang env Dev)
yarn ios

# 🤖 Chạy Android (tự switch sang env Dev)
yarn android
```

> 💡 **Mẹo**: Lệnh `yarn ios` và `yarn android` đã tự động chạy `build.sh` để switch sang environment **Development** trước khi build. Không cần config gì thêm!

---

## 📋 Các lệnh hữu ích

### 🏃 Chạy & Build

| Lệnh | Mô tả |
|-------|-------|
| `yarn start` | Khởi động Metro (reset cache) |
| `yarn ios` | Build & chạy iOS (Dev) |
| `yarn android` | Build & chạy Android (Dev) |
| `yarn ios-live` | Build & chạy iOS (Production) |
| `yarn android-live` | Build & chạy Android (Production) |

### 📦 Build Release

| Lệnh | Mô tả |
|-------|-------|
| `yarn android-build-APK` | Build APK release (auto đặt tên theo ngày) |
| `yarn android-build-AAB` | Build AAB cho Google Play |
| `yarn open-folder-apk` | Mở folder chứa APK |
| `yarn open-folder-aab` | Mở folder chứa AAB |
| `yarn export-all` | Export bundle cho cả Android + iOS |

### 🧹 Dọn dẹp

| Lệnh | Mô tả |
|-------|-------|
| `yarn clean:android` | Clean Gradle build |
| `yarn clean:ios` | Nuclear clean iOS (Pods, DerivedData, cache — tất cả!) |

### 🔧 Code Quality

| Lệnh | Mô tả |
|-------|-------|
| `yarn lint` | Kiểm tra lỗi ESLint |
| `yarn lint:fix` | Auto-fix lỗi ESLint |
| `yarn lint:check` | Check lỗi (0 warning cho CI/CD) |

### 🛠️ Tools

| Lệnh | Mô tả |
|-------|-------|
| `yarn openXcode` | Mở project trong Xcode |
| `yarn openAndroidStudio` | Mở project trong Android Studio |
| `yarn port` | Forward port 9090 cho Reactotron (Android) |

---

## 🎯 Hướng dẫn sử dụng

### 🎨 Sử dụng Theme System

```tsx
import { useStyles } from '@/theme/useStyles';
import { AppTheme } from '@/theme/Colors';
import { ms, fs } from '@/theme/Responsive';

// Tạo styles reactive theo theme (tự động re-render khi đổi dark/light)
const createStyles = (theme: AppTheme) => ({
  container: { backgroundColor: theme.background },
  title: { color: theme.text, fontSize: fs(18) },
  card: { padding: ms(16), borderRadius: ms(12) },
});

const MyScreen = () => {
  const styles = useStyles(createStyles);
  // styles tự động cập nhật khi user đổi theme! ✨
};
```

### 🔔 Toast & Alert

```tsx
import { toast } from '@/components/portals/alert/useAlertStore';

// Gọi ở BẤT CỨ ĐÂU — kể cả ngoài component! 🤯
toast.success('Lưu thành công!');
toast.error('Có lỗi xảy ra!');
toast.warning('Kiểm tra lại kết nối mạng');
```

```tsx
import { useAlertStore } from '@/components/portals/alert/useAlertStore';

// Custom Alert với nút bấm
const showAlert = useAlertStore(state => state.showAlert);
showAlert({
  title: 'Xác nhận',
  content: 'Bạn có muốn xóa item này?',
  buttons: [
    { text: 'Hủy', style: 'cancel', onPress: () => {} },
    { text: 'Xóa', onPress: () => deleteItem() },
  ],
});
```

### ⏳ Global Loading

```tsx
import { GlobalLoading } from '@/store/useLoadingStore';

// Hiện loading overlay — chặn mọi thao tác
GlobalLoading.show('Đang xử lý...');

// Ẩn loading
GlobalLoading.hide();
```

### 🧭 Navigation (gọi ở mọi nơi)

```tsx
import NavigationService from '@/navigation/NavigationService';

// Điều hướng type-safe
NavigationService.navigate('DetailScreen', { productId: 123 });
NavigationService.push('DetailScreen', { productId: 456 });
NavigationService.replace('HomeScreen');
NavigationService.back();
```

### 🌍 Đa ngôn ngữ

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <Text>{t('home.welcome', { name: 'Tuấn' })}</Text>;
};
```

### 🖼️ SuperGallery (Zero Re-render Image Viewer)

```tsx
import SuperGallery, { type SuperGalleryRef } from '@/components/ui/superGallery/SuperGallery';

const MyScreen = () => {
  const galleryRef = useRef<SuperGalleryRef>(null);

  // Mở gallery — parent KHÔNG re-render! 🚀
  const openGallery = () => {
    galleryRef.current?.open(['url1.jpg', 'url2.jpg', 'url3.jpg'], 0);
  };

  return (
    <>
      <TouchableOpacity onPress={openGallery}>
        <Image source={{ uri: 'url1.jpg' }} />
      </TouchableOpacity>
      <SuperGallery ref={galleryRef} />
    </>
  );
};
```

> 🎯 **Kiến trúc**: `useImperativeHandle` + `forwardRef` — gallery quản lý state nội bộ, parent chỉ gọi `open(images, index)` / `close()` qua ref. **Zero re-render ở parent!**

### 🎠 SuperBanner (Auto-play Carousel)

```tsx
import SuperBanner, { type BannerItem } from '@/components/ui/superBanner/SuperBanner';

const banners: BannerItem[] = [
  { id: '1', imageUrl: 'https://example.com/banner1.jpg' },
  { id: '2', imageUrl: 'https://example.com/banner2.jpg' },
];

<SuperBanner data={banners} height={180} />
```

> 🎯 Auto-play + parallax scrolling + scale-on-tap + pagination dots — tất cả chạy trên UI thread via Reanimated 4.

### 🔍 Render Tracking (Debug Mode)

```tsx
import useRenderLog from '@/hooks/useRenderLog';

const MyComponent = () => {
  useRenderLog('MyComponent');
  // Console: 🔄 [RENDER] MyComponent — lần thứ 1
  // Console: 🔄 [RENDER] MyComponent — lần thứ 2  ← re-render thừa!
};
```

> ⚠️ **Chỉ dùng khi debug** — xóa trước khi release! Filter `[RENDER]` trong Logcat/Console để track.

### 🖐️ SwipeableItemWrapper (Swipe-to-Action)

```tsx
import { SwipeableItemWrapper, ESwipeType } from '@/components/swipeItem';

<SwipeableItemWrapper
  id={item.id}
  animationType={ESwipeType.LEFT_RIGHT}
  leftSwipeView={<MyLeftAction />}
  rightSwipeView={<MyRightAction />}
  onLeftFullSwipe={(id) => handleDelete(id)}
  leftSwipeViewContainerStyle={{ borderRadius: 12 }}
>
  <MyListItem item={item} />
</SwipeableItemWrapper>
```

> 🎯 **Kiến trúc**: Sử dụng `react-native-gesture-handler` v2 + `Reanimated` v4. Mọi tính toán vị trí, vận tốc và animation đều chạy trên UI thread, đảm bảo list vuốt mượt mà 60fps kể cả trên thiết bị Android cũ.

### 📸 Pro Camera System (Tối ưu tuyệt đối với Zero Re-render)

Hệ thống Camera được đập đi xây lại với triết lý **hiệu năng là số 1**, mang đến trải nghiệm quay chụp mượt mà ngang ngửa ứng dụng gốc (Native App).

```tsx
// Các tính năng "sát thủ" của Camera Module:
// 1. Zero-re-render: Đồng hồ bấm giờ (Timer), Nút chụp (Capture Button) đều được điều khiển bởi Reanimated SharedValues. JS Thread rảnh rỗi 100% trong lúc quay phim!
// 2. Pro Tap-to-focus: Chạm vào màn hình để lấy nét, kèm hiệu ứng SVG animated cực ngầu (scale-in & fade-out).
// 3. Background Media Processing: Lưu file ảnh/video nặng vào Gallery trong nền mà không làm khựng UI.
// 4. Bulletproof Stability: Bọc try-catch tinh tế ở native layer, fix sạch sẽ các lỗi chí mạng.
```

> 🎯 **Giải phẫu kiến trúc & Bug fixes**:
> - **Vision Camera v5 (Nitro Modules)**: Thay vì dùng state của React để track xem đang quay hay không (gây re-render toàn màn hình), template sử dụng `isRecordingRef` kết hợp với `isRecordingSV` (SharedValue).
> - **Khắc phục lỗi `NativeState` null**: Vision Camera v5 sử dụng Nitro Modules, rất dễ bị crash `HybridCameraSessionSpec` nếu truy cập khi unmount. Hệ thống quản lý lifecycle an toàn bằng cách tự động dọn dẹp (dispose) và ngắt kết nối CameraView khi component mất focus.
> - **Fix lỗi MIME type kinh điển trên Android**: Tự động phát hiện và sửa chữa các file video bị thiếu đuôi mở rộng (`.mp4`) do Vision Camera sinh ra, tránh được màn hình đỏ khi lưu qua `CameraRoll` vào MediaStore của Android.

---

## 🏗️ Multi-Environment Build

Template hỗ trợ tự động switch giữa **Development** và **Production**:

```
src/env/
├── config/
│   ├── development/          # 🟢 Firebase config cho Dev
│   │   ├── GoogleService-Info.plist
│   │   └── google-services.json
│   └── production/           # 🔴 Firebase config cho Prod
│       ├── GoogleService-Info.plist
│       └── google-services.json
└── scripts/
    └── enviroment.js         # Script switch ENV variables
```

Khi chạy `yarn ios` hoặc `yarn android`, script `build.sh` sẽ tự động:
1. Copy đúng Firebase config (Dev/Prod)
2. Cập nhật version name + version code
3. Đổi tên app hiển thị
4. Set biến môi trường tương ứng

> ⚠️ **Quan trọng**: File `firebase.json` phải nằm ở **root project** (không phải trong `src/`). RNFB chỉ đọc config từ root!

---

## 🚀 Performance Philosophy

Template này được tối ưu cho **Android cấu hình yếu**, đảm bảo 60fps mượt mà:

| Kỹ thuật | Giải thích |
|----------|------------|
| `useAnimatedScrollHandler` | Scroll handler chạy 100% UI thread — zero JS bridge |
| `memo` + `arePropsEqual` | Custom comparator cho list items — chỉ re-render khi `id` thay đổi |
| Pre-computed constants | Gradient colors, styles tính sẵn ở module level — không tạo object mới mỗi render |
| `useImperativeHandle` | Gallery/overlay mở qua ref — parent không re-render |
| `Reanimated 4` | Tất cả animation chạy trên UI thread, JS thread không bị nghẽn |
| `useMemo` / `useCallback` | Memoize inline objects và callbacks — tránh tạo reference mới |
| `useRenderLog` | Hook debug phát hiện re-render thừa trong development |

---

## 🛡️ Code Quality

Template đã tích hợp sẵn bộ công cụ **code quality** đầy đủ:

- **ESLint** (flat config) — `unused-imports`, `simple-import-sort`, `react-hooks`, `react-native`
- **Prettier** — format code thống nhất
- **Husky + lint-staged** — auto lint & format trước mỗi commit
- **TypeScript Strict Mode** — `noImplicitAny`, `strict: true`

> 🎯 Commit xấu? **Không tồn tại.** Husky sẽ chặn trước khi bạn kịp push! 💪

---

## 🧰 Tech Stack

| Công nghệ | Version | Vai trò |
|-----------|---------|---------|
| **React Native** | 0.84.0 | Framework cốt lõi |
| **React** | 19.2.3 | UI Library |
| **TypeScript** | 5.8+ | Type safety & DX |
| **Zustand** | 5.x | State management (nhẹ, nhanh, gọi ngoài component) |
| **React Navigation** | 8.x (alpha) | Điều hướng ứng dụng (Static API mới nhất) |
| **FlashList (@shopify)** | 2.2.x | Render list dữ liệu khổng lồ với hiệu năng 60fps |
| **Reanimated** | 4.2.2 | Animations mượt mà chạy trên UI thread |
| **Gesture Handler** | 2.30.x | Xử lý các thao tác vuốt chạm phức tạp |
| **Vision Camera** | 5.0.x | Pro Camera Module (Nitro Modules, Frame Processors) |
| **React Native Video** | 7.0.x (beta) | Trình phát video chuyên nghiệp |
| **Camera Roll** | 7.10.x | Truy xuất và lưu trữ Media (Native Gallery) |
| **MMKV** | 4.1.x | Storage siêu tốc (nhanh gấp 30x AsyncStorage) |
| **Axios** | 1.13.x | HTTP client chuẩn mực |
| **React Hook Form** | 7.71.x | Quản lý form tối ưu, chống re-render thừa |
| **Firebase Messaging** | 23.8.x | Push notifications (Modular API mới nhất) |
| **Notifee** | 9.1.x | Quản lý Local Notifications |
| **Keyboard Controller** | 1.20.x | Trải nghiệm bàn phím mượt mà, đồng nhất iOS/Android |
| **Reactotron** | 5.1.x | Debugger chuyên dụng cho React Native |
| **i18next & Localize** | 25.8.x | Quản lý đa ngôn ngữ thông minh |
| **BootSplash** | 7.1.x | Màn hình khởi động Native (chống chớp trắng) |
| **React Native SVG** | 15.15.x | Hiển thị vector icons sắc nét mọi độ phân giải |
| **Liquid Glass** | 0.7.x | Hiệu ứng Glassmorphism (Kính mờ) tuyệt đẹp |
| **Reanimated Carousel** | 4.0.x | Slider/Banner auto-play mượt mà 60fps |
| **Gesture Image Viewer** | 2.1.x | Zoom và pan hình ảnh chuẩn Instagram |
| **Nitro Modules** | 0.35.x | Nền tảng JSI Modules siêu tốc thế hệ mới |
| **Blur & Linear Gradient** | - | UI effects: Làm mờ nền và đổ màu gradient |
| **Native Menu** | 2.0.x | Context Menu chuẩn Native UI iOS/Android |

---

## 💝 Lời nhắn từ tác giả

Tôi là **Tuấn** — một Mobile Developer yêu React Native. Template này không chỉ là code, nó là **kinh nghiệm đúc kết** từ những dự án thực tế, những đêm debug đến 2h sáng, và niềm tin rằng code nên **vui vẻ chứ không phải cực hình** 😄

Nếu template này giúp bạn tiết kiệm dù chỉ 1 ngày setup, thì tôi đã thành công rồi! 🎉

> *"Code ít, làm nhiều. Setup một lần, dùng mãi mãi."*
>
> — **Tuấn** 🚀

---

## 📄 License

Made with ❤️ and ☕ by **Tuấn**

---

<div align="center">

**⭐ Nếu thấy hữu ích, đừng ngại star repo nhé! ⭐**

*Mỗi ngôi sao là một lần tôi mỉm cười* 😊

</div>
