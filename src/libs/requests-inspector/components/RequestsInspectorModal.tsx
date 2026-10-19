import React, { FC, useCallback, useMemo } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { copyToClipboard, extractAuthToken } from '../clipboardHelper';
import { useNetworkStore } from '../networkStore';
import { FilterType, NetworkLog } from '../types';
import { fs, ms, s, vs } from '../utils/responsive';
import { useSafeDeviceInsets } from '../utils/safeArea';
import {
  CloseIcon,
  EmptyBoxIcon,
  KeyIcon,
  NetworkIcon,
  PauseIcon,
  PlayIcon,
  SearchIcon,
  ShareIcon,
  TrashIcon,
} from './Icons';
import { RequestDetailView } from './RequestDetailView';
import { RequestItem } from './RequestItem';

const FILTER_ITEMS: { key: FilterType; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'ERROR', label: 'Errors' },
  { key: 'SUCCESS', label: 'Success' },
  { key: 'POST', label: 'POST' },
  { key: 'GET', label: 'GET' },
  { key: 'PUT', label: 'PUT' },
  { key: 'DELETE', label: 'DELETE' },
];

const ModalContent: FC = () => {
  const logs = useNetworkStore(state => state.logs);
  const selectedLogId = useNetworkStore(state => state.selectedLogId);
  const setSelectedLogId = useNetworkStore(state => state.setSelectedLogId);
  const filter = useNetworkStore(state => state.filter);
  const setFilter = useNetworkStore(state => state.setFilter);
  const searchQuery = useNetworkStore(state => state.searchQuery);
  const setSearchQuery = useNetworkStore(state => state.setSearchQuery);
  const clearLogs = useNetworkStore(state => state.clearLogs);
  const setVisible = useNetworkStore(state => state.setModalVisible);
  const isPaused = useNetworkStore(state => state.isPaused);
  const togglePause = useNetworkStore(state => state.togglePause);

  const insets = useSafeDeviceInsets();

  const safeContainerStyle = useMemo(
    () => ({
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }),
    [insets],
  );

  const selectedLog = useMemo(
    () => logs.find(item => item.id === selectedLogId),
    [logs, selectedLogId],
  );

  const errorCount = useMemo(() => logs.filter(item => item.status === 'error').length, [logs]);
  const successCount = useMemo(() => logs.filter(item => item.status === 'success').length, [logs]);

  // Smart Search & Multi-criteria filter
  const filteredLogs = useMemo(() => {
    let result = logs;

    if (filter === 'ERROR') {
      result = result.filter(item => item.status === 'error');
    } else if (filter === 'SUCCESS') {
      result = result.filter(item => item.status === 'success');
    } else if (filter === 'GET' || filter === 'POST' || filter === 'PUT' || filter === 'DELETE') {
      result = result.filter(item => item.method === filter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => {
        const urlMatch = item.url.toLowerCase().includes(q);
        const methodMatch = item.method.toLowerCase().includes(q);
        const statusMatch = String(item.response?.statusCode ?? '').includes(q);
        const errorMatch = item.response?.error?.toLowerCase().includes(q) ?? false;
        return urlMatch || methodMatch || statusMatch || errorMatch;
      });
    }

    return result;
  }, [logs, filter, searchQuery]);

  const handleCopyLatestToken = useCallback(async () => {
    for (const log of logs) {
      const token = extractAuthToken(log.headers) || extractAuthToken(log.response?.headers);
      if (token) {
        const success = await copyToClipboard(token);
        if (success) {
          Alert.alert('Token Copied', 'Latest Authorization token copied to clipboard!');
          return;
        }
      }
    }
    Alert.alert('No Token Found', 'No authorization header detected in recorded requests.');
  }, [logs]);

  const handleExportLogs = useCallback(async () => {
    if (logs.length === 0) {
      Alert.alert('No Logs', 'There are no recorded requests to export.');
      return;
    }

    const exportData = logs.map(log => ({
      id: log.id,
      method: log.method,
      url: log.url,
      status: log.response?.statusCode ?? (log.status === 'pending' ? 'PENDING' : 'ERROR'),
      durationMs: log.response?.durationMs,
      sentTime: new Date(log.sentTime).toISOString(),
      headers: log.headers,
      body: log.body,
      responseHeaders: log.response?.headers,
      responseBody: log.response?.body,
      error: log.response?.error,
    }));

    const jsonString = JSON.stringify(exportData, null, 2);
    const success = await copyToClipboard(jsonString);
    if (success) {
      Alert.alert(
        'Logs Exported',
        `Successfully exported ${logs.length} request logs and copied JSON dump to clipboard!`,
      );
    }
  }, [logs]);

  const handleClose = useCallback(() => {
    setSelectedLogId(null);
    setVisible(false);
  }, [setSelectedLogId, setVisible]);

  const renderItem = useCallback(
    ({ item }: { item: NetworkLog }) => (
      <RequestItem log={item} onPress={log => setSelectedLogId(log.id)} />
    ),
    [setSelectedLogId],
  );

  const keyExtractor = useCallback((item: NetworkLog) => item.id, []);

  return (
    <View style={[styles.safeArea, safeContainerStyle]}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" translucent />
      {selectedLog ? (
        <RequestDetailView log={selectedLog} onBack={() => setSelectedLogId(null)} />
      ) : (
        <View style={styles.container}>
          {/* Top Header */}
          <View style={styles.topBar}>
            <View style={styles.titleGroup}>
              <View style={styles.titleRow}>
                <NetworkIcon color="#60A5FA" size={s(18)} />
                <Text style={styles.appTitle}>Network Inspector</Text>
              </View>
              <Text style={isPaused ? styles.subTitlePaused : styles.subTitle}>
                {isPaused
                  ? `PAUSED • ${logs.length} requests`
                  : `${logs.length} ${logs.length === 1 ? 'request' : 'requests'}`}
              </Text>
            </View>

            <View style={styles.topControls}>
              {/* Pause / Resume Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                onPress={togglePause}
                style={[
                  styles.pauseControlButton,
                  isPaused ? styles.pauseActive : styles.pauseInactive,
                ]}>
                {isPaused ? (
                  <PlayIcon color="#10B981" size={s(11)} />
                ) : (
                  <PauseIcon color="#A1A1AA" size={s(11)} />
                )}
                <Text
                  style={[
                    styles.pauseControlText,
                    isPaused ? styles.pauseTextActive : styles.pauseTextInactive,
                  ]}>
                  {isPaused ? 'Resume' : 'Pause'}
                </Text>
              </TouchableOpacity>

              {/* Close Button with generous tap area */}
              <TouchableOpacity
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={handleClose}
                style={styles.closeButton}>
                <CloseIcon color="#A1A1AA" size={s(15)} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Utility Action Bar: Export, Token, Clear */}
          <View style={styles.actionBar}>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
              onPress={handleExportLogs}
              style={styles.actionBtnExport}>
              <ShareIcon color="#60A5FA" size={s(13)} />
              <Text style={styles.actionTextExport}>Export</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
              onPress={handleCopyLatestToken}
              style={styles.actionBtnToken}>
              <KeyIcon color="#FBBF24" size={s(13)} />
              <Text style={styles.actionTextToken}>Token</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
              onPress={clearLogs}
              style={styles.actionBtnClear}>
              <TrashIcon color="#EF4444" size={s(13)} />
              <Text style={styles.actionTextClear}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar with Left Icon and Cross-platform Clear Button */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <SearchIcon color="#71717A" size={s(15)} />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setSearchQuery}
                placeholder="Search URL, method, status (e.g. 404, /auth)..."
                placeholderTextColor="#71717A"
                style={styles.searchInput}
                value={searchQuery}
              />
              {searchQuery.length > 0 ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  onPress={() => setSearchQuery('')}
                  style={styles.searchClearBtn}>
                  <CloseIcon color="#9CA3AF" size={s(12)} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Filter Chips (Horizontal Scrollable for easy tap) */}
          <View style={styles.filterWrapper}>
            <ScrollView
              contentContainerStyle={styles.filterScroll}
              horizontal
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator={false}>
              {FILTER_ITEMS.map(item => {
                const isActive = filter === item.key;
                let badgeText = item.label;
                if (item.key === 'ALL') {
                  badgeText = `All (${logs.length})`;
                } else if (item.key === 'ERROR') {
                  badgeText = `Errors (${errorCount})`;
                } else if (item.key === 'SUCCESS') {
                  badgeText = `Success (${successCount})`;
                }

                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                    key={item.key}
                    onPress={() => setFilter(item.key)}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive,
                      item.key === 'ERROR' && isActive && styles.filterChipErrorActive,
                      item.key === 'SUCCESS' && isActive && styles.filterChipSuccessActive,
                    ]}>
                    {item.key === 'ERROR' ? (
                      <View style={[styles.filterDot, styles.filterDotError]} />
                    ) : null}
                    {item.key === 'SUCCESS' ? (
                      <View style={[styles.filterDot, styles.filterDotSuccess]} />
                    ) : null}
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive && styles.filterChipTextActive,
                        item.key === 'ERROR' && isActive && styles.filterChipTextErrorActive,
                        item.key === 'SUCCESS' && isActive && styles.filterChipTextSuccessActive,
                      ]}>
                      {badgeText}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Requests List with optimized keyboard dismiss */}
          <FlatList
            contentContainerStyle={styles.listContent}
            data={filteredLogs}
            initialNumToRender={10}
            keyExtractor={keyExtractor}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <EmptyBoxIcon color="#3F3F46" size={s(48)} />
                <Text style={styles.emptyTitle}>No Requests Recorded</Text>
                <Text style={styles.emptySub}>
                  {searchQuery
                    ? 'No requests match your search criteria.'
                    : 'Trigger an API call from the app to inspect live network traffic.'}
                </Text>
              </View>
            }
            maxToRenderPerBatch={10}
            renderItem={renderItem}
            windowSize={5}
          />
        </View>
      )}
    </View>
  );
};

export const RequestsInspectorModal: FC = () => {
  const isVisible = useNetworkStore(state => state.isModalVisible);
  const setVisible = useNetworkStore(state => state.setModalVisible);
  const selectedLogId = useNetworkStore(state => state.selectedLogId);
  const setSelectedLogId = useNetworkStore(state => state.setSelectedLogId);

  // Fix Android hardware back button: Detail -> List -> Close Modal
  const handleHardwareBack = useCallback(() => {
    if (selectedLogId) {
      setSelectedLogId(null);
    } else {
      setVisible(false);
    }
  }, [selectedLogId, setSelectedLogId, setVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      hardwareAccelerated
      onRequestClose={handleHardwareBack}
      statusBarTranslucent
      visible={isVisible}>
      <SafeAreaProvider>
        <ModalContent />
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  actionBar: {
    flexDirection: 'row',
    marginBottom: vs(10),
    paddingHorizontal: s(12),
  },
  actionBtnClear: {
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: '#EF4444',
    borderRadius: ms(8),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: s(4),
    paddingVertical: vs(7),
  },
  actionBtnExport: {
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: '#3B82F6',
    borderRadius: ms(8),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: s(4),
    paddingVertical: vs(7),
  },
  actionBtnToken: {
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: '#F59E0B',
    borderRadius: ms(8),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: s(4),
    paddingVertical: vs(7),
  },
  actionTextClear: {
    color: '#EF4444',
    fontSize: fs(12),
    fontWeight: '600',
    marginLeft: s(5),
  },
  actionTextExport: {
    color: '#60A5FA',
    fontSize: fs(12),
    fontWeight: '600',
    marginLeft: s(5),
  },
  actionTextToken: {
    color: '#FBBF24',
    fontSize: fs(12),
    fontWeight: '600',
    marginLeft: s(5),
  },
  appTitle: {
    color: '#F4F4F5',
    fontSize: fs(15),
    fontWeight: '700',
    marginLeft: s(6),
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#27272A',
    borderRadius: ms(8),
    height: s(32),
    justifyContent: 'center',
    width: s(32),
  },
  container: {
    backgroundColor: '#121212',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(60),
    paddingHorizontal: s(32),
  },
  emptySub: {
    color: '#71717A',
    fontSize: fs(13),
    lineHeight: vs(18),
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#E4E4E7',
    fontSize: fs(16),
    fontWeight: '600',
    marginBottom: vs(6),
    marginTop: vs(12),
  },
  filterChip: {
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderColor: '#2A2A2A',
    borderRadius: ms(16),
    borderWidth: 1,
    flexDirection: 'row',
    marginRight: s(8),
    paddingHorizontal: s(13),
    paddingVertical: vs(7),
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#3B82F6',
  },
  filterChipErrorActive: {
    backgroundColor: '#991B1B',
    borderColor: '#EF4444',
  },
  filterChipSuccessActive: {
    backgroundColor: '#065F46',
    borderColor: '#10B981',
  },
  filterChipText: {
    color: '#A1A1AA',
    fontSize: fs(12),
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipTextErrorActive: {
    color: '#FEE2E2',
  },
  filterChipTextSuccessActive: {
    color: '#D1FAE5',
  },
  filterDot: {
    borderRadius: s(3.5),
    height: s(7),
    marginRight: s(6),
    width: s(7),
  },
  filterDotError: {
    backgroundColor: '#EF4444',
  },
  filterDotSuccess: {
    backgroundColor: '#10B981',
  },
  filterScroll: {
    paddingHorizontal: s(12),
  },
  filterWrapper: {
    marginBottom: vs(10),
  },
  listContent: {
    paddingBottom: vs(24),
  },
  pauseActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  pauseControlButton: {
    alignItems: 'center',
    borderRadius: ms(8),
    borderWidth: 1,
    flexDirection: 'row',
    marginRight: s(8),
    paddingHorizontal: s(9),
    paddingVertical: vs(6),
  },
  pauseInactive: {
    backgroundColor: '#27272A',
    borderColor: '#3F3F46',
  },
  pauseControlText: {
    fontSize: fs(12),
    fontWeight: '600',
    marginLeft: s(4),
  },
  pauseTextActive: {
    color: '#34D399',
  },
  pauseTextInactive: {
    color: '#D4D4D8',
  },
  safeArea: {
    backgroundColor: '#121212',
    flex: 1,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderColor: '#2A2A2A',
    borderRadius: ms(8),
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: s(10),
  },
  searchClearBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: s(4),
  },
  searchContainer: {
    marginBottom: vs(10),
    paddingHorizontal: s(12),
  },
  searchInput: {
    color: '#F4F4F5',
    flex: 1,
    fontSize: fs(13),
    marginLeft: s(8),
    paddingVertical: vs(8),
  },
  subTitle: {
    color: '#71717A',
    fontSize: fs(11),
    marginTop: vs(2),
  },
  subTitlePaused: {
    color: '#FBBF24',
    fontSize: fs(11),
    fontWeight: '600',
    marginTop: vs(2),
  },
  titleGroup: {
    flex: 1,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  topBar: {
    alignItems: 'center',
    borderBottomColor: '#27272A',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
  },
  topControls: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
