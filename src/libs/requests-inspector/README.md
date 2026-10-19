<div align="center">
  <h1>🕵️ react-native-requests-inspector</h1>
  <p><b>High-performance, standalone In-App Network Inspector for React Native</b></p>
  <p><i>Inspired by the popular Flutter library <a href="https://github.com/tuan1996v2/requests_inspector">requests_inspector</a> by <b>tuan1996v2</b>.</i></p>

  <p>
    <a href="https://github.com/tuan1996v2/react-native-requests-inspector/stargazers"><img src="https://img.shields.io/github/stars/tuan1996v2/react-native-requests-inspector?style=for-the-badge&color=blue" alt="Stars"></a>
    <a href="https://github.com/tuan1996v2/react-native-requests-inspector/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License"></a>
    <a href="https://reactnative.dev"><img src="https://img.shields.io/badge/React%20Native-0.70%2B-61DAFB.svg?style=for-the-badge&logo=react" alt="React Native"></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-Strict-3178C6.svg?style=for-the-badge&logo=typescript" alt="TypeScript"></a>
  </p>
</div>

---

## 🤖 1-Prompt Integration (Dành cho AI ở dự án mới)

> **Mẹo:** Khi bắt đầu một dự án React Native mới, bạn chỉ cần copy nguyên câu prompt dưới đây và dán vào ô chat cho AI (**Cursor, Antigravity, Claude Code, Copilot, ChatGPT**):

```text
Tích hợp thư viện react-native-requests-inspector từ git https://github.com/tuan1996v2/react-native-requests-inspector.git vào dự án này:
1. Cài đặt package qua yarn/npm: yarn add https://github.com/tuan1996v2/react-native-requests-inspector.git
2. Bọc component gốc trong App.tsx với <RequestsInspector enabled={__DEV__}>...</RequestsInspector>
3. Cắm attachRequestsInspector(axiosInstance) vào instance Axios chính của dự án (hoặc dùng requestsInspectorFetch thay thế fetch).
```

---

## 💡 Giới Thiệu

`react-native-requests-inspector` là giải pháp Network Inspector tích hợp trực tiếp trong ứng dụng React Native (tương tự **Chucker trên Android** hay **requests_inspector trên Flutter**). 

Giúp Developer và QA có thể kiểm tra, gỡ lỗi và trích xuất mọi request mạng **ngay trên thiết bị thật và máy ảo** mà không cần mở Charles Proxy, Flipper hay cắm dây cáp rườm rà.

---

## ✨ Tính Năng Nổi Bật (Killer Features)

* 🔑 **1-Click Authorization Token Extraction**:
  Tự động quét `headers` và `response.headers` để bóc tách token Bearer sạch sẽ, copy vào clipboard chỉ với 1 chạm để test ngay trên Postman hoặc Swagger.
* 📋 **RFC-Compliant cURL Generator**:
  Trích xuất câu lệnh `cURL` hoàn chỉnh (kèm method, escaped quotes, query parameters, headers và request body) chuẩn xác 100%.
* ⏸️ **Pause / Resume Recording**:
  Cho phép "đóng băng" danh sách request khi ứng dụng có WebSocket hoặc Polling API chạy ngầm liên tục, tránh làm trôi request bạn đang muốn debug.
* ⏱️ **Cảnh Báo Tốc Độ Phản Hồi (Slow API Detection)**:
  Tự động đổi màu cảnh báo thời gian phản hồi:
  - `< 500ms`: 🟢 Xanh ngọc (Nhanh)
  - `500ms - 1500ms`: 🟡 Vàng cam (Trung bình)
  - `> 1500ms`: 🔴 Đỏ rực (Cảnh báo API nghẽn mạng)
* 🧠 **Smart Search & Filter**:
  Tìm kiếm tức thì theo **URL**, **HTTP Method**, **Status Code** (ví dụ gõ `404`, `500`, `200`) và nội dung lỗi. Hỗ trợ thanh cuộn Filter Chips: `All`, `Errors`, `Success`, `POST`, `GET`, `PUT`, `DELETE`.
* 📤 **1-Click Export Toàn Bộ Logs**:
  Xuất toàn bộ snapshot network traffic ra JSON dump để gửi ngay cho đồng đội Backend hoặc QA.
* 🎯 **Floating Button Kéo Thả & Tự Hít Mép (Edge Snapping)**:
  Nút tròn nổi bật, kéo thả mượt mà với Reanimated + Gesture Handler, tự động hít vào 2 mép màn hình và tính toán Safe Area để không che lấp Dynamic Island hay Thanh điều hướng.
* 🛡️ **Zero Native Overhead & Chống Rò Rỉ RAM**:
  Quản lý bằng Zustand in-memory FIFO ring-buffer (tối đa 50 requests gần nhất), tự động cắt ngắn payload lớn hơn 250KB để chống tràn RAM (OOM).

---

## 📦 Cài Đặt (Installation)

Cài đặt trực tiếp từ GitHub repository:

```bash
# Sử dụng Yarn (Khuyên dùng)
yarn add https://github.com/tuan1996v2/react-native-requests-inspector.git

# Hoặc sử dụng NPM
npm install git+https://github.com/tuan1996v2/react-native-requests-inspector.git
```

### Peer Dependencies
Đảm bảo dự án của bạn đã cài đặt các thư viện phổ biến sau:

```bash
yarn add react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-svg zustand
```

---

## 🚀 Hướng Dẫn Sử Dụng (Quick Start)

### 1. Bọc Component Gốc trong `App.tsx`

```tsx
import React from 'react';
import { RequestsInspector } from 'react-native-requests-inspector';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    // Chỉ bật trên môi trường Development
    <RequestsInspector enabled={__DEV__}>
      <RootNavigator />
    </RequestsInspector>
  );
}
```

---

### 2. Tự Động Bắt Request với Axios

Chỉ cần gọi hàm `attachRequestsInspector` truyền vào Axios instance của bạn:

```typescript
import axios from 'axios';
import { attachRequestsInspector } from 'react-native-requests-inspector';

export const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 15000,
});

// Cắm interceptor tự động (có cơ chế chống duplicate khi hot-reload)
attachRequestsInspector(apiClient);
```

---

### 3. Tự Động Bắt Request với Fetch API

Nếu bạn sử dụng `fetch` tiêu chuẩn, chỉ cần dùng wrapper `requestsInspectorFetch`:

```typescript
import { requestsInspectorFetch } from 'react-native-requests-inspector';

const fetchUserProfile = async (userId: string) => {
  const response = await requestsInspectorFetch(`https://api.example.com/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer my-token-123',
    },
  });
  return response.json();
};
```

---

## ⚙️ Chi Tiết Kỹ Thuật (Architecture & Performance)

| Tiêu chí | Giải pháp kỹ thuật |
| :--- | :--- |
| **State Management** | Zustand store với cấu trúc phẳng, selector hook granular tránh re-render thừa. |
| **Giới hạn RAM** | Ring buffer FIFO lưu tối đa 50 requests gần nhất, unmount Modal hoàn toàn khi đóng. |
| **An toàn Payload** | Payload body lớn hơn 250KB tự động được rút gọn `[Payload truncated...]` để tránh đứng máy. |
| **Safe Area Handling** | Tự động tính toán Insets với fallback cứng: iPhone tai thỏ (44pt), Dynamic Island (54pt), Android StatusBar (24dp), Home Indicator (34pt). |
| **Icons & Typography** | 100% Vector SVG độc lập, không phụ thuộc font hệ thống, miễn nhiễm với lỗi Missing Glyph `[?]`. |

---

## 👨‍💻 Tác Giả & Đóng Góp (Author & License)

- Tác giả: **Phạm Văn Tuấn ([tuan1996v2](https://github.com/tuan1996v2))**
- Thư viện tham chiếu: [requests_inspector (Flutter)](https://github.com/tuan1996v2/requests_inspector)
- Giấy phép: **MIT License** — Thoải mái sử dụng trong các dự án cá nhân và thương mại.

---
<div align="center">
  <b>⭐ Đừng quên bấm Star trên <a href="https://github.com/tuan1996v2/react-native-requests-inspector">GitHub</a> nếu thư viện giúp ích cho công việc của bạn! ⭐</b>
</div>
