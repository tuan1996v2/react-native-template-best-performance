---
name: rn-best-performance-dev
description: Use when developing, maintaining, refactoring, or adding features, screens, components, APIs, or modules in the react-native-template-best-performance React Native project.
---

# React Native Best Performance Template Development Guide

Chuẩn hóa kiến trúc, quy tắc lập trình, phong cách thiết kế UI/UX và quy chuẩn kỹ thuật cho dự án **`react-native-template-best-performance`** (React Native 0.84+, React 19, TypeScript Strict Mode, Zustand 5, Reanimated 4, FlashList 2).

**REQUIRED BACKGROUND:** Trước khi bắt đầu BẤT KỲ tác vụ nào trong dự án này, bạn **BẮT BUỘC** phải đọc và tuân thủ 2 skill sau:
1. **`using-superpowers`** — Quy tắc tìm và kích hoạt skill phù hợp trước MỌI hành động (kể cả đặt câu hỏi làm rõ). Nếu có skill liên quan, PHẢI dùng, không được bỏ qua.
2. **`karpathy-guidelines`** — Quy tắc lập trình tối giản: Think Before Coding (nêu rõ assumption, hỏi khi chưa rõ), Simplicity First (code tối thiểu, không thêm gì không được yêu cầu), Surgical Changes (chỉ sửa đúng chỗ cần sửa, match existing style), Goal-Driven Execution (định nghĩa success criteria rõ ràng, verify trước khi kết luận).

> **Không tuân thủ 2 skill trên = vi phạm quy trình dự án.**

---

## ⭐️ NGUYÊN TẮC THỰC THI & PHÂN QUYỀN BẮT BUỘC (CRITICAL EXECUTION RULES)

1. **PHẠM VI CÔNG VIỆC (STRICT SCOPE):**
   - Chỉ tập trung vào việc đọc, viết, sửa các file code theo đúng yêu cầu tính năng.
   - Tuyệt đối **KHÔNG** tự ý mở emulator, can thiệp ADB, chạy test UI tự động nếu không được yêu cầu.

2. **PHÂN QUYỀN THỰC THI (PERMISSIONS):**
   - **Thao tác code:** User đã ủy quyền toàn bộ. Tự động tạo, sửa, xóa file code và refactor mà **KHÔNG cần hỏi hay bắt user xác nhận từng bước nhỏ**.
   - **Thao tác ngoài file code:** Cài thêm package mới (`yarn add`), thay đổi native project (`android/`, `ios/`), hoặc chạy script can thiệp hệ thống bắt buộc phải hỏi ý kiến user trước khi thực hiện.

3. **QUY TRÌNH KIỂM TRA (VERIFICATION):**
   - Sau khi hoàn thành code, bước kiểm tra bắt buộc:
     ```bash
     npx eslint <các file vừa sửa hoặc tạo>
     ```
   - Chạy TypeScript kiểm tra lỗi type nếu cần: `npx tsc --noEmit`.
   - Nếu pass 0 lỗi: **DỪNG LẠI NGAY LẬP TỨC** và báo cáo kết quả ngắn gọn (danh sách file đã sửa + tóm tắt logic).

4. **ĐÁNH GIÁ CÔNG VIỆC & NGÂN SÁCH TOOL (TASK TRIAGE & FAST-PATH):**
   - **Task nhỏ (sửa text, đổi màu, thêm 1 param API, fix null, đổi điều kiện if...):**
     * **Ngân sách:** Tối đa **1 - 2 tool calls** (1 tool đọc đúng file + 1 tool sửa file).
     * **Cấm over-engineering:** Không sửa lan man các file xung quanh.
     * **Thời gian thực thi:** Hoàn thành trong **1 - 2 phút**.
   - **Task vừa (thêm 1 component, 1 dialog, 1 hook, 1 hàm API):** Ngân sách tối đa **3 - 5 tool calls**.
   - **Task lớn (toàn bộ màn hình hoặc feature mới):** Lập kế hoạch ngắn gọn rồi thực hiện dứt điểm.

5. **QUY CHUẨN COMMIT & QUY ĐỊNH GIT (STRICT GIT POLICY & COMMIT STANDARDS):**
   - **Nguyên tắc an toàn (Safety Rule):** Tuyệt đối **KHÔNG BAO GIỜ tự ý chạy `git commit` hay `git push`** sau khi sửa code hay thêm tính năng. Thao tác commit và push **CHỈ ĐƯỢC THỰC HIỆN KHI USER YÊU CẦU ĐÍCH DANH** trong lượt chat đó (ví dụ: "commit cho tôi", "push code lên").
   
   - **Khi user yêu cầu commit, BẮT BUỘC tuân thủ các quy tắc sau:**
     1. **Commit Title (Tiêu đề):**
        - Bắt buộc viết bằng **Tiếng Anh (English)** theo chuẩn Conventional Commits: `<type>(<scope>): <short summary>`.
        - `<type>`: `feat`, `fix`, `refactor`, `style`, `perf`, `chore`, `docs`.
        - `<scope>`: Tên màn hình, component hoặc module (ví dụ: `network`, `chat`, `auth`, `home`, `theme`...).
        - Ngắn gọn, rõ ràng, súc tích, mô tả đúng những gì code thể hiện.
        - Ví dụ:
          * `feat(network): implement mock API simulator screen and requests inspector test suite`
          * `fix(home): resolve question mark icon rendering and prioritize feature cards`
          * `fix(otp): resolve countdown timer synchronization with background state`
     2. **Commit Details (Nội dung chi tiết bên dưới):**
        - Bắt buộc viết bằng **Tiếng Việt có dấu**, dùng danh sách gạch đầu dòng (`- `), cách tiêu đề 1 dòng trống.
        - Mô tả rõ ràng, ngắn gọn, súc tích, phản ánh chính xác thay đổi kỹ thuật và nghiệp vụ thực tế (endpoints, payload, định dạng tham số, model mapping, UI/State, bug fixes). Tuyệt đối không ghi mơ hồ, chung chung.
        - Mẫu chuẩn:
          ```
          <type>(<scope>): <English title summarizing change>

          - <Thay đổi kỹ thuật/nghiệp vụ cụ thể 1>
          - <Thay đổi kỹ thuật/nghiệp vụ cụ thể 2>
          - <Thay đổi kỹ thuật/nghiệp vụ cụ thể 3>
          ```
     3. **Surgical Staging (Chỉ stage file cần thiết):**
        - Chỉ commit các file nghiệp vụ liên quan trực tiếp đến yêu cầu (`git add <file1> <file2>`).
        - Tuyệt đối **KHÔNG** dùng lệnh bừa bãi như `git add .` hoặc `git add -A` khi có các file không liên quan.
        - Tuyệt đối **KHÔNG** tự tiện commit các file cấu hình cục bộ (`.vscode/`, `build.sh`, local scripts, temporary test data trong `scratch/`, hoặc các file đang được staged/modified riêng của dev) trừ khi được yêu cầu đích danh.
     4. **Tích Hợp ESLint / Prettier / Husky Gatekeeper:**
        - Template tích hợp sẵn **Husky + lint-staged** trong pre-commit hook (tự động chạy ESLint & Prettier trên staged files).
        - **Bắt buộc kiểm tra trước khi commit:** Chạy `npx eslint <các file staged>` và đảm bảo 0 error, 0 warning. Nếu còn lỗi lint, Husky hook sẽ chặn commit và gây fail.
        - **CẤM** dùng `--no-verify` để né tránh Husky hook, trừ khi user chỉ định rõ ràng. Mọi code commit lên repo phải là code sạch chuẩn 100%.

---

## 1. Cấu Trúc Dự Án & Vị Trí File Chuẩn

```
src/
├── api/                   # Axios client (apiClient.ts), endpoints danh sách URL
├── assets/                # icon/ (SVG icons), images/, fonts/, bootsplash/
├── components/
│   ├── portals/           # AppProvider, GlobalLoading, Alert/Toast
│   └── ui/                # AppButton (3D depth), AppPress (ripple), AppTextInput, AppImage,
│                          # superGallery, superBanner, swipeItem, skeleton
├── env/                   # Multi-env configs (development/production)
├── firebase/              # fcmService.ts (Firebase Cloud Messaging v23)
├── hooks/                 # useRenderLog.ts (Debug re-render count)
├── i18n/                  # i18n.tsx, locales/vi.json, locales/en.json
├── navigation/            # AppNavigation.tsx (Static API v8), NavigationService.ts
├── screens/               # Các module màn hình (mỗi màn hình gồm .tsx và .styles.ts)
├── store/                 # Zustand stores (useThemeStore, useLoadingStore, useAlertStore, useNavigationStore)
├── theme/                 # Colors.ts (tokens), Responsive.ts (s, vs, ms, fs), useStyles.ts
└── utils/                 # formatters.ts, validators.ts
```

---

## 2. Triết Lý Tối Ưu Hiệu Năng & Zero Re-Render

Template được thiết kế để duy trì **60 - 120 FPS mượt mà trên cả thiết bị Android cấu hình yếu**:

1. **Không Re-render trên JS Thread cho Animation & Countdown:**
   - Dùng `Reanimated 4` (`useSharedValue`, `useAnimatedStyle`, `useAnimatedScrollHandler` với `'worklet';`).
   - Đếm ngược (timer/countdown): Dùng `AnimatedTextInput` cập nhật text trên UI thread hoặc so sánh timestamp, tuyệt đối không dùng `setInterval` + `useState` làm re-render component mỗi giây.
2. **Truyền Điều Khiển Qua Ref (Imperative Handle Pattern):**
   - Các modal, gallery, bottom sheet nặng (như `SuperGallery`): Dùng `useImperativeHandle` + `forwardRef`. Parent component mở qua `ref.current.open()` mà **không làm re-render parent**.
3. **Memo Hóa Danh Sách:**
   - Dùng `@shopify/flash-list` thay thế FlatList thông thường.
   - Luôn bọc item card bằng `React.memo` với custom comparator (`arePropsEqual`) khi render danh sách dài.
4. **Kiểm Tra Re-render Thừa Khi Phát Triển:**
   - Đặt `useRenderLog('TênComponent')` ở đầu component để theo dõi số lần re-render trong console.

---

## 3. Hệ Thống Styling & Responsive Scaling Bắt Buộc

### A. Responsive Scaling (`src/theme/Responsive.ts`)
*Chuẩn gốc thiết kế theo iPhone 14 (`390 x 844`). Tuyệt đối không hardcode kích thước dạng số cứng (`width: 200, padding: 16`).*

| Hàm | Mục đích | Ví dụ sử dụng |
|---|---|---|
| `s(size)` | Scale theo chiều ngang (Width) | `width: s(24)`, `borderRadius: s(12)`, `marginHorizontal: s(16)` |
| `vs(size)` | Scale theo chiều dọc (Height) | `height: vs(48)`, `marginTop: vs(12)`, `paddingVertical: vs(16)` |
| `ms(size, factor?)` | Moderate scale (co giãn vừa phải) | `padding: ms(16)`, `margin: ms(8)` |
| `fs(size)` | Font size scale | `fontSize: fs(16)` |

### B. Hook `useStyles` & `AppTheme` Tokens
**Quy tắc bất di bất dịch:** Tuyệt đối **KHÔNG DÙNG INLINE STYLES** (`style={{ padding: 10 }}` vi phạm ESLint `react-native/no-inline-styles`).
Tất cả styles phải nằm trong file riêng `*.styles.ts` và được wrap qua `useStyles`:

```tsx
// FeatureScreen.styles.ts
import { StyleSheet } from 'react-native';
import { s, vs, ms, fs } from '@/theme/Responsive';
import { AppTheme } from '@/theme/Colors';

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: s(16),
    },
    title: {
      fontSize: fs(18),
      fontWeight: '700',
      color: theme.text,
      marginBottom: vs(8),
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: s(12),
      padding: ms(16),
      borderWidth: 1,
      borderColor: theme.border,
    },
  });

export default createStyles;
```

Trong component:
```tsx
import { useStyles } from '@/theme/useStyles';
import createStyles from './FeatureScreen.styles';

const FeatureScreen = () => {
  const styles = useStyles(createStyles);
  return <View style={styles.container}><Text style={styles.title}>Title</Text></View>;
};
```

---

## 4. Hệ Thống Icon SVG & Tránh Lỗi Font Dấu Hỏi Chấm `?`

1. **Bộ Icon SVG:**
   - Toàn bộ icons được định nghĩa bằng `react-native-svg` trong `src/assets/icon/`.
   - Mỗi icon nhận `props: SvgProps` và dùng `props.fill` cho `stroke` hoặc `fill`.
   - Bắt buộc export qua `src/assets/icon/index.ts`.
2. **Quy tắc tránh lỗi hiển thị dấu hỏi chấm `?` trên Android:**
   - **CẤM** đặt ký tự Emoji Unicode (như `💬`, `📡`, `🔑`, `📋`) bên trong các chuỗi text hiển thị trên UI (`<Text>...</Text>`, `title`, `subtitle`).
   - Nhiều dòng máy Android hoặc font tùy biến không có glyphs cho emoji và sẽ biến chữ thành `?` hoặc ô vuông rỗng.
   - Luôn sử dụng icon SVG chuyên biệt thay vì emoji trong văn bản.

---

## 5. Hệ Thống Điều Hướng (Navigation v8 Static API)

Template sử dụng React Navigation Static API:
1. **Đăng ký màn hình mới:** Mở `src/navigation/AppNavigation.tsx`, thêm màn hình vào `MainStack`:
   ```tsx
   MyNewScreen: {
     screen: MyNewScreen,
     options: { title: 'Tên màn hình', headerShown: false },
   },
   ```
2. **Điều hướng toàn cục Type-safe qua `NavigationService` (gọi ở bất kỳ đâu):**
   ```tsx
   import NavigationService from '@/navigation/NavigationService';

   NavigationService.navigate('MyNewScreen', { id: '123' });
   NavigationService.push('MyNewScreen');
   NavigationService.replace('HomeScreen');
   NavigationService.back();
   ```

---

## 6. Quản Lý State Toàn Cục (Zustand 5.x)

1. **Global Loading:**
   ```tsx
   import { GlobalLoading } from '@/store/useLoadingStore';
   GlobalLoading.show('Đang xử lý dữ liệu...');
   GlobalLoading.hide();
   ```
2. **Toast & Alert Tức Thì:**
   ```tsx
   import { toast, useAlertStore } from '@/components/portals/alert/useAlertStore';

   // Toast (gọi được ở cả ngoài component / trong axios interceptor)
   toast.success('Thao tác thành công!');
   toast.error('Có lỗi xảy ra!');
   toast.warning('Cảnh báo kết nối');

   // Modal Alert
   const showAlert = useAlertStore.getState().showAlert;
   showAlert({
     title: 'Xác nhận xóa',
     content: 'Bạn có chắc chắn muốn xóa?',
     buttons: [
       { text: 'Hủy', style: 'cancel' },
       { text: 'Xóa ngay', onPress: () => handleDelete() },
     ],
   });
   ```
3. **Theme Store:**
   ```tsx
   import { useThemeStore } from '@/store/useThemeStore';
   const mode = useThemeStore(state => state.mode); // 'light' | 'dark'
   const setMode = useThemeStore(state => state.setMode);
   ```

---

## 7. Đa Ngôn Ngữ (i18n)

1. Khi thêm bất kỳ nhãn text hiển thị mới, **BẮT BUỘC** khai báo cả 2 file:
   - `src/i18n/locales/vi.json` (Tiếng Việt)
   - `src/i18n/locales/en.json` (Tiếng Anh)
2. Cách dùng trong Component:
   ```tsx
   import { useTranslation } from 'react-i18next';
   const { t } = useTranslation();
   <Text>{t('common.confirm')}</Text>
   ```

---

## 8. Network Layer & Requests Inspector

1. Gọi API bằng `apiClient` từ `src/api/apiClient.ts` (đã gắn sẵn token và requests-inspector).
2. Khi cần test hoặc debug API, mở `NetworkSimulatorScreen` hoặc bật modal của `react-native-requests-inspector`:
   ```tsx
   import { useNetworkStore } from '@/libs/requests-inspector';
   useNetworkStore.getState().setModalVisible(true);
   ```

---

## 9. Quy Trình Chuẩn Để Tạo Tính Năng Mới (Step-by-step Feature Recipe)

Khi người dùng yêu cầu thêm 1 màn hình hoặc 1 tính năng mới, hãy thực hiện theo đúng các bước:

```
Bước 1: Phân tích & Thu thập Reuse Map
  ├── Tìm xem có component nào tái sử dụng được (AppButton, AppTextInput, SuperBanner...)
  └── Xác định các Icon SVG và màu theme cần dùng

Bước 2: Tạo Screen & Styles
  ├── Tạo `src/screens/<featureName>/<FeatureName>Screen.styles.ts` (dùng s, vs, ms, fs, AppTheme)
  └── Tạo `src/screens/<featureName>/<FeatureName>Screen.tsx` (dùng useStyles, React.memo, useCallback)

Bước 3: Khai báo i18n
  ├── Thêm key vào `src/i18n/locales/vi.json`
  └── Thêm key vào `src/i18n/locales/en.json`

Bước 4: Đăng ký Điều Hướng
  └── Khai báo trong `MainStack` tại `src/navigation/AppNavigation.tsx`

Bước 5: Kiểm Tra Lỗi & Tối Ưu
  ├── Chạy `npx eslint <các file vừa tạo>`
  └── Đảm bảo 0 warning, 0 error, không có inline styles, không có emoji gây lỗi font.
```

---

## 10. Bảng Red Flags - Dấu Hiệu Vi Phạm Cần Dừng Lại Ngay

| Hành động | Thực tế | Cách sửa đúng |
|---|---|---|
| Viết inline styles `style={{ padding: 12 }}` | Vi phạm ESLint flat config | Chuyển vào file `*.styles.ts` dùng `createStyles` |
| Hardcode pixel cứng `width: 300, height: 50` | Vỡ giao diện trên màn hình nhỏ/lớn | Dùng `s(300), vs(50)` từ `@/theme/Responsive` |
| Đặt emoji unicode vào `<Text>` (`title="💬 Tin nhắn"`) | Bị lỗi hiển thị dấu hỏi chấm `?` trên Android | Bỏ emoji khỏi string, dùng SVG component (`IconComment`) |
| Dùng `useState` cho hoạt ảnh hoặc countdown nhanh | Giảm FPS, nghẽn JS Thread, tốn pin | Dùng Reanimated SharedValue (`useSharedValue`) |
| Tự ý chạy `git commit` hoặc `git push` | Vi phạm quy định bảo mật git | Dừng lại, báo cáo file đã sửa để user tự quyết định |
| Đọc transcript cũ hoặc grep lan man | Đốt quota, kéo dài thời gian | Đi thẳng vào file đích với số lượng tool calls tối thiểu |
