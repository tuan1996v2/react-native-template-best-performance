# 🕵️ React Native Requests Inspector

> High-performance, zero-native-dependency In-App Network Inspector for React Native, inspired by [`tuan1996v2/requests_inspector`](https://github.com/tuan1996v2/requests_inspector) (Flutter).

[![React Native](https://img.shields.io/badge/React%20Native-%3E%3D0.70-blue?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features (Tính Năng Nổi Bật)

- 🚀 **Draggable Floating Action Button**: Kéo thả tự do trên UI thread (Reanimated + GestureHandler), tự động hít vào mép màn hình (Edge Snapping), không chặn cảm ứng của màn hình chính.
- 🔑 **1-Click Copy Authorization Token**: Quét tự động header `Authorization`, cắt bỏ tiền tố `Bearer ` và copy token thô vào Clipboard.
- 📋 **RFC-Compliant cURL Generator**: Trích xuất câu lệnh `cURL` hoàn chỉnh (kèm method, headers, escaped quotes, query params, raw/JSON body) để test ngay trên Terminal hoặc Postman.
- 🛡️ **FIFO Ring-Buffer (Max 50 logs)**: Lưu trữ in-memory nhẹ bằng Zustand, tự động đẩy request cũ nhất ra ngoài khi đầy, ngăn ngừa rò rỉ RAM (OOM leak-proof).
- ⚡ **0% Overhead on Production**: Khi `enabled={false}`, wrapper trả về trực tiếp `{children}` và các interceptor lập tức pass-through không ghi log.
- 🔍 **Realtime Search & Filter Chips**: Tìm kiếm tức thì theo URL/Method, lọc nhanh: **Tất cả**, **🔴 Lỗi (>= 400)**, **🟢 Thành công (200 - 299)**.
- 🎨 **Modern Dark Mode**: Giao diện tối hiện đại (`#121212`), render JSON format thụt lề chuẩn, an toàn với Safe Area trên tai thỏ và đảo động (Dynamic Island).

---

## 📦 Installation (Cài Đặt)

```bash
yarn add zustand
# Các dependencies thường có sẵn trong dự án React Native:
yarn add react-native-reanimated react-native-gesture-handler react-native-safe-area-context axios
```

---

## 🚀 Quick Start (Tích Hợp Nhanh)

### 1. Bọc Root App (`App.tsx`)
```tsx
import React from 'react';
import { RequestsInspector } from 'react-native-requests-inspector'; // hoặc './src/libs/requests-inspector'

export default function App() {
  return (
    <RequestsInspector enabled={__DEV__}>
      <YourAppRoot />
    </RequestsInspector>
  );
}
```

### 2. Cắm vào Axios Client (`apiClient.ts`)
```tsx
import axios from 'axios';
import { attachRequestsInspector } from 'react-native-requests-inspector';

export const apiClient = axios.create({
  baseURL: 'https://api.example.com',
});

// 1 dòng duy nhất để tự động bắt tất cả request/response/error
attachRequestsInspector(apiClient);
```

### 3. Dùng với Fetch API (Tuỳ chọn)
```tsx
import { requestsInspectorFetch } from 'react-native-requests-inspector';

const response = await requestsInspectorFetch('https://api.example.com/data', {
  method: 'POST',
  body: JSON.stringify({ name: 'Tuấn' }),
});
```

---

## 🛡️ Risk Analysis & Conflict Prevention (Đánh Giá Rủi Ro)

| Vấn đề tiềm ẩn | Giải pháp kỹ thuật đã xử lý |
|---|---|
| **Chặn cảm ứng màn hình chính** | `FloatingButton` chỉ chiếm diện tích đúng kích thước của nút (`54x54`), tuyệt đối không dùng container `absoluteFillObject` che toàn màn hình. |
| **Xung đột Gesture Handler** | Nút kéo thả được bọc bên trong `GestureHandlerRootView` độc lập, không gây lỗi thiếu root view và không can thiệp vào cử chỉ vuốt của danh sách (FlatList/ScrollView). |
| **Tràn bộ nhớ do response lớn** | Tự động giới hạn kích thước body tối đa 250 KB (`truncateBodyIfNeeded`), tránh OOM khi tải file binary hoặc chuỗi base64 khổng lồ. |
| **Đăng ký Interceptor lặp lại** | Cờ `__requestsInspectorAttached` ngăn chặn đăng ký trùng lặp nếu `attachRequestsInspector` bị gọi nhiều lần (ví dụ trong Hot Reload). |
| **Độc lập dự án** | Bộ tính toán Responsive (`s`, `vs`, `ms`, `fs`) được đóng gói nội bộ tại `utils/responsive.ts`, không phụ thuộc vào theme của project chủ. |

---

## 👤 Author
Developed by **tuan1996v2** (Mobile Developer)
