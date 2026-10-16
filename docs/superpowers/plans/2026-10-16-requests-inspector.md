# Requests Inspector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-native-dependency, high-performance In-App Network Inspector for React Native (TypeScript strict mode), cloning the architecture and UI/UX of `tuan1996v2/requests_inspector`.

**Architecture:** Zustand in-memory FIFO ring-buffer (max 50 logs) capturing network traffic via Axios and Fetch interceptors. Reanimated + GestureHandler for a 60fps edge-snapping draggable floating button, opening a Dark Mode modal with realtime search, Error/Success filters, 1-Click Authorization Token copying, JSON format viewers, and RFC-compliant cURL generator.

**Tech Stack:** React Native 0.84, React 19, TypeScript strict mode, Zustand 5, React Native Reanimated 4, React Native Gesture Handler 2, React Native Safe Area Context 5, Axios.

## Global Constraints

- **Code Formatting & Linting:** Strict adherence to project ESLint & Prettier configs:
  - NO inline styles (`react-native/no-inline-styles` is an ERROR). All styles in `StyleSheet.create`.
  - NO unused styles (`react-native/no-unused-styles` is an ERROR).
  - NO unused imports (`unused-imports/no-unused-imports` is an ERROR).
  - Arrow body style as-needed (`arrow-body-style: ["error", "as-needed"]`).
  - Prettier rules: singleQuote: true, trailingComma: 'all', semi: true, printWidth: 100, tabWidth: 2, bracketSameLine: true.
- **Responsive Dimensions:** Use `s()`, `vs()`, `ms()`, `fs()` from `@/theme/Responsive` or `src/theme/Responsive` for all dimensions and typography.
- **Type Safety:** 100% strict TypeScript. No `any` type.
- **Production Overhead:** When `enabled={false}`, return `{children}` immediately with zero background logging and zero memory allocation.

---

### Task 1: Type Definitions (`types.ts`)

**Files:**
- Create: `src/libs/requests-inspector/types.ts`

**Interfaces:**
- Produces:
  - `HttpMethod`: `'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'`
  - `RequestDetails`: `{ id: string; url: string; method: HttpMethod; headers: Record<string, string>; body?: unknown; queryParameters?: Record<string, string>; sentTime: number }`
  - `ResponseDetails`: `{ statusCode: number; headers: Record<string, string>; body?: unknown; receivedTime: number; durationMs: number; error?: string }`
  - `NetworkLog`: `RequestDetails & { response?: ResponseDetails; status: 'pending' | 'success' | 'error' }`
  - `FilterType`: `'ALL' | 'ERROR' | 'SUCCESS'`
  - `RequestsInspectorProps`: `{ children: React.ReactNode; enabled?: boolean }`

- [ ] **Step 1: Write type definitions in `src/libs/requests-inspector/types.ts`**

Define all strong interfaces for requests, responses, network logs, store state, filter modes, and component props without any `any` types.

- [ ] **Step 2: Verify TypeScript compiles without error**

Run: `yarn tsc --noEmit`
Expected: PASS (0 errors).

- [ ] **Step 3: Commit**

```bash
git add src/libs/requests-inspector/types.ts
git commit -m "feat(network-inspector): add core TypeScript definitions"
```

---

### Task 2: In-Memory Ring-Buffer Store (`networkStore.ts`)

**Files:**
- Create: `src/libs/requests-inspector/networkStore.ts`

**Interfaces:**
- Consumes: `types.ts` (`NetworkLog`, `RequestDetails`, `ResponseDetails`, `FilterType`)
- Produces:
  - `useNetworkStore`: Zustand store hook managing logs, filters, active selection, and modal visibility.
  - Helper methods: `addRequest`, `updateResponse`, `clearLogs`, `setModalVisible`, `setSelectedLogId`, `setFilter`, `setSearchQuery`, `setEnabled`.
  - Maximum 50 items FIFO ring-buffer to prevent RAM leaks.

- [ ] **Step 1: Write Zustand store with FIFO ring-buffer**

Implement `src/libs/requests-inspector/networkStore.ts` using `zustand/vanilla` or `create`:
- Enforce `MAX_LOGS = 50`. When adding request 51, drop the oldest item (`logs.slice(1)` or `logs.slice(0, MAX_LOGS - 1)`).
- When `isEnabled === false`, `addRequest` returns `''` and does not store logs.
- Provide `clearLogs()` for 1-tap instant log wipe.

- [ ] **Step 2: Verify TypeScript and ESLint**

Run: `yarn lint:check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/libs/requests-inspector/networkStore.ts
git commit -m "feat(network-inspector): create Zustand ring-buffer store"
```

---

### Task 3: cURL Command Generator & Safe Clipboard Helper

**Files:**
- Create: `src/libs/requests-inspector/curlHelper.ts`
- Create: `src/libs/requests-inspector/clipboardHelper.ts`

**Interfaces:**
- Consumes: `types.ts` (`NetworkLog`)
- Produces:
  - `generateCurlCommand(log: NetworkLog): string`: RFC-compliant cURL generator.
  - `copyToClipboard(text: string): Promise<boolean>`: Resilient copy with error safety and fallback.
  - `extractAuthToken(headers?: Record<string, string>): string | null`: Extracts raw token from `Authorization` / `authorization` header by stripping `Bearer ` prefix.

- [ ] **Step 1: Implement `curlHelper.ts`**

Generate standard `curl -X METHOD "URL"` with formatted `-H` headers and `--data` (properly escaped JSON string or form payload).

- [ ] **Step 2: Implement `clipboardHelper.ts`**

Support `react-native` Clipboard and `@react-native-clipboard/clipboard` (with graceful try/catch), plus `extractAuthToken` utility.

- [ ] **Step 3: Verify with type checker and linter**

Run: `yarn tsc --noEmit && yarn lint:check`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/libs/requests-inspector/curlHelper.ts src/libs/requests-inspector/clipboardHelper.ts
git commit -m "feat(network-inspector): add cURL generator and clipboard helpers"
```

---

### Task 4: Axios Interceptor & Fetch Wrapper (`interceptor.ts`)

**Files:**
- Create: `src/libs/requests-inspector/interceptor.ts`

**Interfaces:**
- Consumes: `networkStore.ts`, `types.ts`
- Produces:
  - `attachRequestsInspector(axiosInstance: AxiosInstance): void`: Automatically attaches request and response/error interceptors to Axios.
  - `requestsInspectorAxiosInterceptor`: Object providing `{ request, response, error }` handler functions for manual registration.
  - `requestsInspectorFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>`: Drop-in Fetch wrapper.
  - Safe body serialization (handling JSON, FormData, URLSearchParams, Blob, circular references).

- [ ] **Step 1: Implement Axios interceptor and Fetch wrapper in `interceptor.ts`**

- On Request: generate log ID, extract method, URL, headers, and body -> `addRequest`.
- On Response: calculate duration (`Date.now() - sentTime`), extract status code, response headers, response body -> `updateResponse`.
- On Error: capture error status/message, calculate duration -> `updateResponse` with `error` status.
- Zero overhead if store `isEnabled === false`.

- [ ] **Step 2: Verify type check and lint**

Run: `yarn tsc --noEmit && yarn lint:check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/libs/requests-inspector/interceptor.ts
git commit -m "feat(network-inspector): implement Axios interceptor and Fetch wrapper"
```

---

### Task 5: Draggable Floating Button (`FloatingButton.tsx`)

**Files:**
- Create: `src/libs/requests-inspector/components/FloatingButton.tsx`

**Interfaces:**
- Consumes: `networkStore.ts`, `src/theme/Responsive.ts`
- Produces:
  - `<FloatingButton />`: Draggable floating button with edge-snapping spring animation, badge count, and red error indicator dot.
  - All styles defined via `StyleSheet.create` (zero inline styles, responsive scaling with `s`, `vs`, `ms`, `fs`).

- [ ] **Step 1: Implement `FloatingButton.tsx`**

- Use `Gesture.Pan()` from `react-native-gesture-handler`.
- Use `useSharedValue`, `useAnimatedStyle`, `withSpring` from `react-native-reanimated`.
- Calculate screen width via `Dimensions.get('window').width`.
- Tap opens the inspector modal (`setModalVisible(true)`).
- Visuals: Dark circle `#1E1E1E` with subtle glow/border `#3B82F6`, detective icon or "NET" label, error badge indicator.

- [ ] **Step 2: Verify styles and linting**

Run: `yarn lint:check`
Expected: PASS (no inline styles, no unused styles).

- [ ] **Step 3: Commit**

```bash
git add src/libs/requests-inspector/components/FloatingButton.tsx
git commit -m "feat(network-inspector): create draggable edge-snapping floating button"
```

---

### Task 6: Request List Item & Detail View Components

**Files:**
- Create: `src/libs/requests-inspector/components/RequestItem.tsx`
- Create: `src/libs/requests-inspector/components/RequestDetailView.tsx`

**Interfaces:**
- Consumes: `types.ts`, `curlHelper.ts`, `clipboardHelper.ts`, `src/theme/Responsive.ts`
- Produces:
  - `<RequestItem log={item} onPress={...} />`: Row with method badge (GET/POST/PUT/DELETE colors), status code pill (2xx green, 3xx yellow, 4xx/5xx red), URL, duration (ms), timestamp.
  - `<RequestDetailView log={selectedLog} onBack={...} />`:
    - Topbar with Back button, URL, 1-Click Copy Token button, Copy cURL button.
    - 3 Tabs: **Request** (Headers key-value, Body formatted JSON), **Response** (Status, Headers, Body formatted JSON + Copy Body button), **cURL** (Syntax-styled cURL box + Copy button).
  - All styles defined via `StyleSheet.create` (zero inline styles).

- [ ] **Step 1: Implement `RequestItem.tsx`**

- Color-coded badges for methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- Status pills: green (`200-299`), amber (`300-399`), red (`400+` or network error).
- Formatted duration and timestamp.

- [ ] **Step 2: Implement `RequestDetailView.tsx`**

- Tab switching: `Request`, `Response`, `cURL`.
- Clean JSON formatting with indentation and safe parsing for non-JSON content.
- Action buttons for 1-Click Copy Token and Copy cURL with feedback alert/toast.

- [ ] **Step 3: Verify linting and type checking**

Run: `yarn tsc --noEmit && yarn lint:check`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/libs/requests-inspector/components/RequestItem.tsx src/libs/requests-inspector/components/RequestDetailView.tsx
git commit -m "feat(network-inspector): build RequestItem and RequestDetailView"
```

---

### Task 7: Modal Controller & Main Wrapper (`RequestsInspectorModal.tsx` & `index.tsx`)

**Files:**
- Create: `src/libs/requests-inspector/components/RequestsInspectorModal.tsx`
- Create: `src/libs/requests-inspector/index.tsx`
- Modify: `App.tsx` (integrate wrapper)
- Modify: `src/api/apiClient.ts` (attach interceptor to Axios)

**Interfaces:**
- Produces:
  - `<RequestsInspectorModal />`: Fullscreen modal with SafeAreaView, Search bar, Filter chips (`Tất cả`, `🔴 Lỗi (>= 400)`, `🟢 Thành công (200-299)`), 🔑 1-Click Token Copy, 🗑️ Clear All, and FlatList.
  - `<RequestsInspector enabled={__DEV__}>{children}</RequestsInspector>`: Main library wrapper.
  - Barrel exports in `index.tsx`.

- [ ] **Step 1: Implement `RequestsInspectorModal.tsx`**

- Manage view state: `list` vs `detail`.
- Filter chips: `ALL`, `ERROR`, `SUCCESS`.
- Search input for live filtering by URL and method.
- 1-Click token scanner finding latest Authorization token across requests.
- Instant Clear All button.

- [ ] **Step 2: Implement `src/libs/requests-inspector/index.tsx`**

- If `enabled === false`, return `{children}` directly.
- If `enabled === true`, render `{children}`, `<FloatingButton />`, and `<RequestsInspectorModal />`.
- Export `RequestsInspector`, `attachRequestsInspector`, `requestsInspectorAxiosInterceptor`, `requestsInspectorFetch`, `useNetworkStore`, and all types.

- [ ] **Step 3: Integrate into `App.tsx` and `src/api/apiClient.ts`**

- Wrap root component in `App.tsx` with `<RequestsInspector enabled={__DEV__}>`.
- Configure `apiClient.ts` with `attachRequestsInspector(apiClient)`.

- [ ] **Step 4: Verify type checking and lint rules**

Run: `yarn tsc --noEmit && yarn lint:check`
Expected: PASS (0 errors, 0 warnings).

- [ ] **Step 5: Commit**

```bash
git add src/libs/requests-inspector/ App.tsx src/api/apiClient.ts
git commit -m "feat(network-inspector): complete RequestsInspector library and root integration"
```

---

### Task 8: Verification & End-to-End Test

**Files:**
- Test with sample API calls on iOS Simulator / React Native environment.

- [ ] **Step 1: Run TypeScript compiler and ESLint check**

Run: `yarn tsc --noEmit && yarn lint:check`
Expected: Clean pass with 0 errors.

- [ ] **Step 2: Verify iOS build and runtime**

Run: `yarn ios`
Expected: Build succeeds, app launches, floating button appears and drags smoothly, taps open inspector modal.

- [ ] **Step 3: Commit any final adjustments**

```bash
git add .
git commit -m "chore: verify requests inspector end-to-end"
```
