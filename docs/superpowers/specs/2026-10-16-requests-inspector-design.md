# Requests Inspector for React Native (Design Specification)

## 1. Overview
A lightweight, zero-native-dependency In-App Network Inspector library for React Native (written in TypeScript strict mode), faithfully cloning the architecture, workflow, and UI/UX of the Flutter package [`tuan1996v2/requests_inspector`](https://github.com/tuan1996v2/requests_inspector).

It enables mobile developers, QA engineers, and backend teams to inspect outgoing HTTP requests, responses, status codes, response times, headers, and payloads, extract reproducible cURL commands, and copy Authorization tokens directly inside the running app.

---

## 2. Technical Stack & Constraints
- **Language**: TypeScript (strict mode enabled).
- **Core Dependencies**:
  - `react`: 19.x (or compatible)
  - `react-native`: 0.84.x
  - `zustand`: 5.x (in-memory ring buffer)
  - `react-native-reanimated`: 4.x / 3.x
  - `react-native-gesture-handler`: 2.x
  - `react-native-safe-area-context`: 5.x
- **No additional native dependencies**:
  - Drag & drop powered by `react-native-gesture-handler` + `react-native-reanimated`.
  - Clipboard uses a safe resolver that leverages `react-native` core `Clipboard` or `@react-native-clipboard/clipboard` if present.
  - Icons and badges are cleanly built with native components (SVG/Text/Shape) for zero asset bloat.

---

## 3. Directory & File Structure
All source files are housed under `src/libs/requests-inspector/`:

```text
src/libs/requests-inspector/
├── types.ts                    # Interfaces: NetworkLog, RequestDetails, ResponseDetails, HttpMethod, FilterType
├── networkStore.ts             # Zustand store: FIFO Ring Buffer (max 50 requests), filter, search, selection
├── curlHelper.ts               # RFC-compliant cURL command generator from NetworkLog
├── clipboardHelper.ts          # Resilient clipboard copy utility with user visual feedback
├── interceptor.ts              # Axios interceptor + Fetch API wrapper
├── components/
│   ├── FloatingButton.tsx      # Draggable floating action button with edge snapping & error badge
│   ├── RequestItem.tsx         # FlatList row: method badge, status pill, duration (ms), timestamp, URL
│   ├── RequestDetailView.tsx   # Detail screen with 3 tabs (Request, Response, cURL) + 1-Click Copy Token
│   └── RequestsInspectorModal.tsx # Fullscreen dark modal managing List View <-> Detail View
└── index.tsx                   # Main <RequestsInspector> wrapper and public exports
```

---

## 4. Core Architecture & Data Flow

### 4.1 In-Memory Ring Buffer (`networkStore.ts`)
- Manages an array of `NetworkLog` items in memory.
- Hard maximum capacity of 50 items (FIFO):
  - When a 51st request is added, the oldest item is discarded to prevent memory leaks during long debugging sessions.
- State:
  - `logs`: `NetworkLog[]`
  - `isEnabled`: boolean (controlled by wrapper `enabled` prop)
  - `isModalVisible`: boolean
  - `selectedLogId`: string | null
  - `filter`: `'ALL' | 'ERROR' | 'SUCCESS'`
  - `searchQuery`: string
- Actions:
  - `addRequest(req: RequestDetails): string` (returns unique log ID)
  - `updateResponse(id: string, res: ResponseDetails): void`
  - `clearLogs(): void` (instant clear)
  - `setModalVisible(visible: boolean): void`
  - `setSelectedLogId(id: string | null): void`
  - `setFilter(filter: FilterType): void`
  - `setSearchQuery(query: string): void`
  - `setEnabled(enabled: boolean): void`

### 4.2 Interceptors (`interceptor.ts`)
- **Axios Interceptor**:
  - `attachRequestsInspector(axiosInstance: AxiosInstance): void`
  - Attaches request & response interceptors to record:
    - URL, Method, Headers, Body, Timestamp (`Date.now()`).
    - On response/error: Status code, Response headers, Response body, Duration (`Date.now() - startTime`), Error message.
- **Fetch Wrapper**:
  - `requestsInspectorFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>`
  - Drop-in replacement for `fetch` that captures request & response metadata identically.
- **Zero Overhead on Production**:
  - When `isEnabled === false`, interceptors immediately pass through requests and responses without capturing or creating log objects.

### 4.3 cURL Generator (`curlHelper.ts`)
- Generates reproducible, RFC-compliant cURL commands:
  ```bash
  curl -X POST "https://api.example.com/v1/auth/login" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <token>" \
    --data '{"username":"dev","password":"***"}'
  ```
- Handles URL query parameters, escaped quotes, multiline formatting, and JSON vs raw payload bodies.

---

## 5. UI/UX Design

### 5.1 Dark Theme Palette
- Screen background: `#121212`
- Surface/Card background: `#1E1E1E`
- Card border: `#2D2D2D`
- Primary Accent: `#3B82F6` (Blue)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Error / Delete: `#EF4444` (Red)
- Text Primary: `#F9FAFB`
- Text Secondary: `#9CA3AF`
- Method Badges:
  - `GET`: `#2563EB` (Blue)
  - `POST`: `#D97706` (Orange/Amber)
  - `PUT`: `#9333EA` (Purple)
  - `PATCH`: `#0D9488` (Teal)
  - `DELETE`: `#DC2626` (Red)

### 5.2 Floating Button (`FloatingButton.tsx`)
- Always-on-top draggable floating circle.
- Uses `Gesture.Pan()` and `react-native-reanimated`.
- Edge snapping: smoothly snaps to left or right screen margin upon release.
- Visuals: Inspector badge icon / label, with an error indicator dot if any failed requests exist.
- Tap opens the full-screen inspector modal.

### 5.3 Requests List Modal (`RequestsInspectorModal.tsx`)
- **Header**:
  - Realtime Search Bar (filters by path or HTTP method).
  - Filter Chips: `Tất cả`, `🔴 Lỗi (>= 400)`, `🟢 Thành công (200 - 299)`.
  - Action buttons:
    - 🔑 **1-Click Copy Token**: Scans recent request headers for `Authorization`, strips `Bearer ` prefix, and copies the clean token to the clipboard.
    - 🗑️ **Clear All**: Instantly clears all logs with zero confirmation friction.
    - ✖ **Close Button**: Dismisses modal.
- **List items (`RequestItem.tsx`)**:
  - HTTP method badge.
  - Status code pill (2xx green, 3xx yellow, 4xx/5xx/ERR red).
  - Formatted URL path + host.
  - Response duration (e.g. `142 ms`) and timestamp (e.g. `16:42:15`).
  - Tapping a row opens the Request Detail view.

### 5.4 Request Detail View (`RequestDetailView.tsx`)
- Header with Back button, request URL, and quick action buttons (Copy cURL, Copy Token).
- 3 Tabs:
  1. **Request Tab**:
     - General Info (URL, Method, Timestamp).
     - Headers (clean key-value cards).
     - Query Parameters (if present).
     - Request Body (Prettified JSON format).
  2. **Response Tab**:
     - Status Code & Duration.
     - Response Headers.
     - Response Body (Prettified JSON, safe fallback for non-JSON or HTML/text, copy full body button).
  3. **cURL Tab**:
     - Monospaced, highlighted cURL command box.
     - "Copy cURL to Clipboard" button with success toast/haptic feedback.

---

## 6. Public API & Integration
Simple 1-line integration into `App.tsx`:

```tsx
import { RequestsInspector } from './src/libs/requests-inspector';

export default function App() {
  return (
    <RequestsInspector enabled={__DEV__}>
      <AppProvider>
        <KeyboardProvider>
          <AppNavigation />
        </KeyboardProvider>
      </AppProvider>
    </RequestsInspector>
  );
}
```

Axios integration in `apiClient.ts`:
```tsx
import axios from 'axios';
import { attachRequestsInspector } from '../libs/requests-inspector';

const apiClient = axios.create({ baseURL: 'https://api.example.com' });
attachRequestsInspector(apiClient);
```

---

## 7. Verification Plan
1. **Type Checking**: Run TypeScript compiler (`tsc --noEmit`) to verify 0 errors in strict mode.
2. **Build Verification**: Ensure project compiles without issue on iOS (`xcodebuild` / simulator).
3. **Functional Verification**:
   - Verify Floating Button drags and snaps properly.
   - Trigger sample API calls (GET, POST, 400/500 errors).
   - Verify FIFO ring buffer caps at 50 items.
   - Verify search, filtering, 1-click token copy, and cURL generation.
   - Verify `enabled={false}` results in 0 overhead.
