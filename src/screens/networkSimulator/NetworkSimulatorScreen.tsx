import React, { FC, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import apiClient from '@/api/apiClient';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import { requestsInspectorFetch, useNetworkStore } from '@/libs/requests-inspector';
import NavigationService from '@/navigation/NavigationService';
import { ThemeTokens } from '@/theme/Colors';
import { useStyles } from '@/theme/useStyles';
import { useThemeStore } from '@/store/useThemeStore';

import createStyles from './NetworkSimulatorScreen.styles';

export const NetworkSimulatorScreen: FC = () => {
  const styles = useStyles(createStyles);
  const insets = useSafeAreaInsets();
  const mode = useThemeStore(state => state.mode);
  const theme = ThemeTokens[mode];

  const setModalVisible = useNetworkStore(state => state.setModalVisible);

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{
    name: string;
    status: number | string;
    duration?: number;
    error?: string;
  } | null>(null);

  const handleOpenInspector = useCallback(() => {
    setModalVisible(true);
  }, [setModalVisible]);

  const handleBack = useCallback(() => {
    NavigationService.back();
  }, []);

  const runApiCall = useCallback(
    async (
      name: string,
      fn: () => Promise<{ status?: number; data?: unknown; duration?: number }>,
    ) => {
      setLoadingAction(name);
      const start = Date.now();
      try {
        const res = await fn();
        const duration = Date.now() - start;
        setLastResult({
          name,
          status: res.status ?? 200,
          duration,
        });
      } catch (err: unknown) {
        const duration = Date.now() - start;
        const errorMsg = err instanceof Error ? err.message : String(err);
        const axiosStatus = (err as { response?: { status?: number } })?.response?.status;
        setLastResult({
          name,
          status: axiosStatus ?? 'ERROR',
          duration,
          error: errorMsg,
        });
      } finally {
        setLoadingAction(null);
      }
    },
    [],
  );

  // 1. GET with Bearer Auth Token
  const testGetWithToken = useCallback(() => {
    runApiCall('GET with Token', async () => {
      const res = await apiClient.get('https://jsonplaceholder.typicode.com/posts/1', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxOTk2Iiwicm9sZSI6ImFkbWluIn0.c9_k7B9_testing_token',
        },
      });
      return { status: res.status, data: res.data };
    });
  }, [runApiCall]);

  // 2. POST with JSON body
  const testPostJson = useCallback(() => {
    runApiCall('POST Create Post', async () => {
      const res = await apiClient.post('https://jsonplaceholder.typicode.com/posts', {
        title: 'React Native Best Performance',
        body: 'Testing requests inspector in-app devtools',
        userId: 1996,
      });
      return { status: res.status, data: res.data };
    });
  }, [runApiCall]);

  // 3. PUT request
  const testPut = useCallback(() => {
    runApiCall('PUT Replace Post', async () => {
      const res = await apiClient.put('https://jsonplaceholder.typicode.com/posts/1', {
        id: 1,
        title: 'Updated Post Title',
        body: 'Replaced complete body payload',
        userId: 1,
      });
      return { status: res.status, data: res.data };
    });
  }, [runApiCall]);

  // 4. PATCH request
  const testPatch = useCallback(() => {
    runApiCall('PATCH Partial Update', async () => {
      const res = await apiClient.patch('https://jsonplaceholder.typicode.com/posts/1', {
        title: 'Patched Single Field Only',
      });
      return { status: res.status, data: res.data };
    });
  }, [runApiCall]);

  // 5. DELETE request
  const testDelete = useCallback(() => {
    runApiCall('DELETE Post', async () => {
      const res = await apiClient.delete('https://jsonplaceholder.typicode.com/posts/1');
      return { status: res.status, data: res.data };
    });
  }, [runApiCall]);

  // 6. 404 Client Error
  const test404 = useCallback(() => {
    runApiCall('404 Not Found', async () => {
      const res = await apiClient.get(
        'https://jsonplaceholder.typicode.com/non-existent-endpoint-404',
      );
      return { status: res.status, data: res.data };
    });
  }, [runApiCall]);

  // 7. 500 Server Error
  const test500 = useCallback(() => {
    runApiCall('500 Server Error', async () => {
      const res = await apiClient.get('https://httpstat.us/500');
      return { status: res.status, data: res.data };
    });
  }, [runApiCall]);

  // 8. Timeout / Network error
  const testTimeout = useCallback(() => {
    runApiCall('Network Timeout', async () => {
      const res = await apiClient.get('https://10.255.255.1/timeout-simulation', {
        timeout: 2000,
      });
      return { status: res.status, data: res.data };
    });
  }, [runApiCall]);

  // 9. Slow API (> 2000ms delay)
  const testSlowApi = useCallback(() => {
    runApiCall('Slow API (>2s)', async () => {
      const res = await apiClient.get('https://dummyjson.com/products/1?delay=2200');
      return { status: res.status, data: res.data };
    });
  }, [runApiCall]);

  // 10. Query Parameters
  const testQueryParams = useCallback(() => {
    runApiCall('Query Params GET', async () => {
      const res = await apiClient.get('https://jsonplaceholder.typicode.com/comments', {
        params: {
          postId: 1,
          filter: 'verified',
          sort: 'desc',
          limit: 10,
        },
      });
      return { status: res.status, data: res.data };
    });
  }, [runApiCall]);

  // 11. Large Payload (~50KB list)
  const testLargePayload = useCallback(() => {
    runApiCall('Large Payload (~50KB)', async () => {
      const res = await apiClient.get('https://jsonplaceholder.typicode.com/photos?_limit=80');
      return { status: res.status, data: res.data };
    });
  }, [runApiCall]);

  // 12. Standard Fetch API wrapper
  const testFetchWrapper = useCallback(() => {
    runApiCall('Native Fetch Wrapper', async () => {
      const res = await requestsInspectorFetch('https://jsonplaceholder.typicode.com/users/1');
      const data = await res.json();
      return { status: res.status, data };
    });
  }, [runApiCall]);

  // 13. Blast Test: 5 concurrent requests
  const testBlastConcurrent = useCallback(async () => {
    setLoadingAction('Blast Concurrent (x5)');
    const start = Date.now();
    try {
      await Promise.allSettled([
        apiClient.get('https://jsonplaceholder.typicode.com/posts/1'),
        apiClient.get('https://jsonplaceholder.typicode.com/users/1'),
        apiClient.get('https://jsonplaceholder.typicode.com/albums/1'),
        apiClient.post('https://jsonplaceholder.typicode.com/posts', { concurrent: true }),
        apiClient.get('https://jsonplaceholder.typicode.com/invalid-404'),
      ]);
      const duration = Date.now() - start;
      setLastResult({
        name: 'Blast Concurrent (5 requests)',
        status: '5/5 Completed',
        duration,
      });
    } finally {
      setLoadingAction(null);
    }
  }, []);

  const headerPaddingStyle = { paddingTop: insets.top + 10 };

  return (
    <AppScreen edges={[]} backgroundColor={theme.background} statusBarStyle="light-content">
      <View style={styles.root}>
        <StatusBar barStyle="light-content" translucent />

        {/* Header with Gradient */}
        <View style={[styles.headerContainer, headerPaddingStyle]}>
          <LinearGradient
            colors={theme.gradient}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={styles.root}
          />
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={handleBack}
              style={styles.headerBackButton}>
              <Text style={styles.headerBackText}>‹ Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenInspector}
              style={styles.headerOpenInspectorBtn}>
              <Text style={styles.headerOpenInspectorText}>🕵️ Mở Inspector</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.headerTitle}>Network Simulator</Text>
          <Text style={styles.headerSubtitle}>
            Bấm các nút dưới đây để kích hoạt API giả lập và kiểm tra Inspector
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Banner Tip */}
          <View style={styles.bannerNotice}>
            <Text style={styles.bannerNoticeTitle}>💡 Hướng dẫn kiểm tra:</Text>
            <Text style={styles.bannerNoticeSub}>
              Mỗi khi bấm một nút, request sẽ được tự động ghi nhận vào nút Floating tròn trên màn
              hình. Bấm vào nút tròn hoặc nút "Mở Inspector" ở góc trên để soi chi tiết headers,
              cURL, payload và response!
            </Text>
          </View>

          {/* Last Result Summary Card */}
          {lastResult ? (
            <View style={styles.lastResultBox}>
              <View style={styles.lastResultHeader}>
                <Text style={styles.lastResultLabel}>Kết quả vừa kích hoạt:</Text>
                <Text
                  style={
                    String(lastResult.status).startsWith('2')
                      ? styles.statusTextSuccess
                      : styles.statusTextError
                  }>
                  Status: {lastResult.status} ({lastResult.duration}ms)
                </Text>
              </View>
              <Text numberOfLines={1} style={styles.lastResultCode}>
                {lastResult.name} {lastResult.error ? `• ${lastResult.error}` : ''}
              </Text>
            </View>
          ) : null}

          {/* Section 1: Standard REST Methods */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>1. Chuẩn REST API (2xx Success)</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadingAction !== null}
              onPress={testGetWithToken}
              style={[styles.apiButton, loadingAction !== null && styles.apiButtonDisabled]}>
              <View style={styles.apiButtonLeft}>
                <View style={styles.apiTitleRow}>
                  <View style={[styles.apiMethodBadge, styles.badgeGet]}>
                    <Text style={styles.apiMethodText}>GET</Text>
                  </View>
                  <Text style={styles.apiTitle}>GET kèm Auth Token (Bearer)</Text>
                </View>
                <Text style={styles.apiDesc}>
                  Header chứa Authorization để test nút trích xuất token 1-chạm
                </Text>
              </View>
              {loadingAction === 'GET with Token' ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadingAction !== null}
              onPress={testPostJson}
              style={[styles.apiButton, loadingAction !== null && styles.apiButtonDisabled]}>
              <View style={styles.apiButtonLeft}>
                <View style={styles.apiTitleRow}>
                  <View style={[styles.apiMethodBadge, styles.badgePost]}>
                    <Text style={styles.apiMethodText}>POST</Text>
                  </View>
                  <Text style={styles.apiTitle}>POST với JSON Body</Text>
                </View>
                <Text style={styles.apiDesc}>
                  Gửi JSON payload để test trích xuất cURL và định dạng JSON
                </Text>
              </View>
              {loadingAction === 'POST Create Post' ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadingAction !== null}
              onPress={testPut}
              style={[styles.apiButton, loadingAction !== null && styles.apiButtonDisabled]}>
              <View style={styles.apiButtonLeft}>
                <View style={styles.apiTitleRow}>
                  <View style={[styles.apiMethodBadge, styles.badgePut]}>
                    <Text style={styles.apiMethodText}>PUT</Text>
                  </View>
                  <Text style={styles.apiTitle}>PUT thay thế tài nguyên</Text>
                </View>
                <Text style={styles.apiDesc}>Test badge màu tím của phương thức PUT</Text>
              </View>
              {loadingAction === 'PUT Replace Post' ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadingAction !== null}
              onPress={testPatch}
              style={[styles.apiButton, loadingAction !== null && styles.apiButtonDisabled]}>
              <View style={styles.apiButtonLeft}>
                <View style={styles.apiTitleRow}>
                  <View style={[styles.apiMethodBadge, styles.badgePatch]}>
                    <Text style={styles.apiMethodText}>PATCH</Text>
                  </View>
                  <Text style={styles.apiTitle}>PATCH cập nhật 1 phần</Text>
                </View>
                <Text style={styles.apiDesc}>Test badge màu xanh teal của phương thức PATCH</Text>
              </View>
              {loadingAction === 'PATCH Partial Update' ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadingAction !== null}
              onPress={testDelete}
              style={[styles.apiButton, loadingAction !== null && styles.apiButtonDisabled]}>
              <View style={styles.apiButtonLeft}>
                <View style={styles.apiTitleRow}>
                  <View style={[styles.apiMethodBadge, styles.badgeDelete]}>
                    <Text style={styles.apiMethodText}>DELETE</Text>
                  </View>
                  <Text style={styles.apiTitle}>DELETE xoá tài nguyên</Text>
                </View>
                <Text style={styles.apiDesc}>Test badge màu đỏ của phương thức DELETE</Text>
              </View>
              {loadingAction === 'DELETE Post' ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : null}
            </TouchableOpacity>
          </View>

          {/* Section 2: Error Cases */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>2. Giả lập Lỗi (Errors & Failures)</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadingAction !== null}
              onPress={test404}
              style={[styles.apiButton, loadingAction !== null && styles.apiButtonDisabled]}>
              <View style={styles.apiButtonLeft}>
                <View style={styles.apiTitleRow}>
                  <View style={[styles.apiMethodBadge, styles.badge4xx]}>
                    <Text style={styles.apiMethodText}>404</Text>
                  </View>
                  <Text style={styles.apiTitle}>404 Not Found (Client Error)</Text>
                </View>
                <Text style={styles.apiDesc}>Test filter thẻ Errors và status badge đỏ</Text>
              </View>
              {loadingAction === '404 Not Found' ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadingAction !== null}
              onPress={test500}
              style={[styles.apiButton, loadingAction !== null && styles.apiButtonDisabled]}>
              <View style={styles.apiButtonLeft}>
                <View style={styles.apiTitleRow}>
                  <View style={[styles.apiMethodBadge, styles.badge5xx]}>
                    <Text style={styles.apiMethodText}>500</Text>
                  </View>
                  <Text style={styles.apiTitle}>500 Internal Server Error</Text>
                </View>
                <Text style={styles.apiDesc}>Test tab Error và bắt lỗi máy chủ</Text>
              </View>
              {loadingAction === '500 Server Error' ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadingAction !== null}
              onPress={testTimeout}
              style={[styles.apiButton, loadingAction !== null && styles.apiButtonDisabled]}>
              <View style={styles.apiButtonLeft}>
                <View style={styles.apiTitleRow}>
                  <View style={[styles.apiMethodBadge, styles.badge4xx]}>
                    <Text style={styles.apiMethodText}>TIMEOUT</Text>
                  </View>
                  <Text style={styles.apiTitle}>Network Timeout / Mất kết nối</Text>
                </View>
                <Text style={styles.apiDesc}>IP không phản hồi sau 2s để test lỗi rớt mạng</Text>
              </View>
              {loadingAction === 'Network Timeout' ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : null}
            </TouchableOpacity>
          </View>

          {/* Section 3: Performance & Special Cases */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>3. Tối ưu & Trường hợp đặc biệt</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadingAction !== null}
              onPress={testSlowApi}
              style={[styles.apiButton, loadingAction !== null && styles.apiButtonDisabled]}>
              <View style={styles.apiButtonLeft}>
                <View style={styles.apiTitleRow}>
                  <View style={[styles.apiMethodBadge, styles.badgeSlow]}>
                    <Text style={styles.apiMethodText}>SLOW</Text>
                  </View>
                  <Text style={styles.apiTitle}>API Chậm (&gt; 2.2 giây)</Text>
                </View>
                <Text style={styles.apiDesc}>
                  Test tính năng đổi màu cảnh báo độ trễ (màu đỏ &gt; 1500ms)
                </Text>
              </View>
              {loadingAction === 'Slow API (>2s)' ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadingAction !== null}
              onPress={testQueryParams}
              style={[styles.apiButton, loadingAction !== null && styles.apiButtonDisabled]}>
              <View style={styles.apiButtonLeft}>
                <View style={styles.apiTitleRow}>
                  <View style={[styles.apiMethodBadge, styles.badgeGet]}>
                    <Text style={styles.apiMethodText}>QUERY</Text>
                  </View>
                  <Text style={styles.apiTitle}>Nhiều Query Parameters</Text>
                </View>
                <Text style={styles.apiDesc}>
                  Test bảng phân tích Query Parameters trong trang chi tiết
                </Text>
              </View>
              {loadingAction === 'Query Params GET' ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadingAction !== null}
              onPress={testLargePayload}
              style={[styles.apiButton, loadingAction !== null && styles.apiButtonDisabled]}>
              <View style={styles.apiButtonLeft}>
                <View style={styles.apiTitleRow}>
                  <View style={[styles.apiMethodBadge, styles.badge2xx]}>
                    <Text style={styles.apiMethodText}>50KB</Text>
                  </View>
                  <Text style={styles.apiTitle}>Large JSON Payload (~50KB)</Text>
                </View>
                <Text style={styles.apiDesc}>
                  Tải 80 mục ảnh để test độ mượt khi parse và render JSON lớn
                </Text>
              </View>
              {loadingAction === 'Large Payload (~50KB)' ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadingAction !== null}
              onPress={testFetchWrapper}
              style={[styles.apiButton, loadingAction !== null && styles.apiButtonDisabled]}>
              <View style={styles.apiButtonLeft}>
                <View style={styles.apiTitleRow}>
                  <View style={[styles.apiMethodBadge, styles.badgeGet]}>
                    <Text style={styles.apiMethodText}>FETCH</Text>
                  </View>
                  <Text style={styles.apiTitle}>Native requestsInspectorFetch()</Text>
                </View>
                <Text style={styles.apiDesc}>Test hàm bọc fetch độc lập không thông qua Axios</Text>
              </View>
              {loadingAction === 'Native Fetch Wrapper' ? (
                <ActivityIndicator color={theme.primary} size="small" />
              ) : null}
            </TouchableOpacity>
          </View>

          {/* Section 4: Stress Test */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>4. Stress Test (Bắn nhiều request cùng lúc)</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              disabled={loadingAction !== null}
              onPress={testBlastConcurrent}
              style={[styles.batchButton, loadingAction !== null && styles.apiButtonDisabled]}>
              {loadingAction === 'Blast Concurrent (x5)' ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : null}
              <Text style={styles.batchButtonText}>⚡ Bắn cùng lúc 5 Requests (Concurrent)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </AppScreen>
  );
};

export default React.memo(NetworkSimulatorScreen);
