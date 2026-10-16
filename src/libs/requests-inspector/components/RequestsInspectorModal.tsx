import React, { FC, useCallback, useMemo } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fs, ms, s, vs } from '../utils/responsive';
import { copyToClipboard, extractAuthToken } from '../clipboardHelper';
import { useNetworkStore } from '../networkStore';
import { NetworkLog } from '../types';
import { RequestDetailView } from './RequestDetailView';
import { RequestItem } from './RequestItem';

export const RequestsInspectorModal: FC = () => {
  const isVisible = useNetworkStore(state => state.isModalVisible);
  const setVisible = useNetworkStore(state => state.setModalVisible);
  const logs = useNetworkStore(state => state.logs);
  const selectedLogId = useNetworkStore(state => state.selectedLogId);
  const setSelectedLogId = useNetworkStore(state => state.setSelectedLogId);
  const filter = useNetworkStore(state => state.filter);
  const setFilter = useNetworkStore(state => state.setFilter);
  const searchQuery = useNetworkStore(state => state.searchQuery);
  const setSearchQuery = useNetworkStore(state => state.setSearchQuery);
  const clearLogs = useNetworkStore(state => state.clearLogs);

  const selectedLog = useMemo(
    () => logs.find(item => item.id === selectedLogId),
    [logs, selectedLogId],
  );

  const errorCount = useMemo(() => logs.filter(item => item.status === 'error').length, [logs]);

  const successCount = useMemo(() => logs.filter(item => item.status === 'success').length, [logs]);

  const filteredLogs = useMemo(() => {
    let result = logs;

    if (filter === 'ERROR') {
      result = result.filter(item => item.status === 'error');
    } else if (filter === 'SUCCESS') {
      result = result.filter(item => item.status === 'success');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        item => item.url.toLowerCase().includes(q) || item.method.toLowerCase().includes(q),
      );
    }

    return result;
  }, [logs, filter, searchQuery]);

  const handleCopyLatestToken = useCallback(async () => {
    for (const log of logs) {
      const token = extractAuthToken(log.headers) || extractAuthToken(log.response?.headers);
      if (token) {
        const success = await copyToClipboard(token);
        if (success) {
          Alert.alert('Token Found', 'Latest authorization token copied to clipboard!');
          return;
        }
      }
    }
    Alert.alert('No Token', 'No authorization token found in recorded requests.');
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

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      hardwareAccelerated
      onRequestClose={handleClose}
      statusBarTranslucent
      visible={isVisible}>
      <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.safeArea}>
        {selectedLog ? (
          <RequestDetailView log={selectedLog} onBack={() => setSelectedLogId(null)} />
        ) : (
          <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <View style={styles.titleGroup}>
                <Text style={styles.appTitle}>🕵️ Network Inspector</Text>
                <Text style={styles.subTitle}>
                  {logs.length} {logs.length === 1 ? 'request' : 'requests'}
                </Text>
              </View>

              <View style={styles.topActions}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCopyLatestToken}
                  style={styles.actionButtonToken}>
                  <Text style={styles.actionTextToken}>🔑 Token</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={clearLogs}
                  style={styles.actionButtonClear}>
                  <Text style={styles.actionTextClear}>🗑️ Clear</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleClose}
                  style={styles.actionButtonClose}>
                  <Text style={styles.actionTextClose}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={setSearchQuery}
                placeholder="Search URL or method (e.g. /auth, POST)..."
                placeholderTextColor="#71717A"
                style={styles.searchInput}
                value={searchQuery}
              />
            </View>

            {/* Filter Chips */}
            <View style={styles.filterRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setFilter('ALL')}
                style={[styles.filterChip, filter === 'ALL' && styles.filterChipActive]}>
                <Text
                  style={[styles.filterChipText, filter === 'ALL' && styles.filterChipTextActive]}>
                  All ({logs.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setFilter('ERROR')}
                style={[styles.filterChip, filter === 'ERROR' && styles.filterChipErrorActive]}>
                <Text
                  style={[
                    styles.filterChipText,
                    filter === 'ERROR' && styles.filterChipTextErrorActive,
                  ]}>
                  🔴 Errors ({errorCount})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setFilter('SUCCESS')}
                style={[styles.filterChip, filter === 'SUCCESS' && styles.filterChipSuccessActive]}>
                <Text
                  style={[
                    styles.filterChipText,
                    filter === 'SUCCESS' && styles.filterChipTextSuccessActive,
                  ]}>
                  🟢 Success ({successCount})
                </Text>
              </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
              contentContainerStyle={styles.listContent}
              data={filteredLogs}
              initialNumToRender={10}
              keyExtractor={keyExtractor}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={styles.emptyTitle}>No Requests Recorded</Text>
                  <Text style={styles.emptySub}>
                    {searchQuery
                      ? 'No requests match your current search query.'
                      : 'Trigger an API call from the app to inspect network traffic.'}
                  </Text>
                </View>
              }
              maxToRenderPerBatch={10}
              renderItem={renderItem}
              windowSize={5}
            />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  actionButtonClear: {
    backgroundColor: '#27272A',
    borderRadius: ms(6),
    marginRight: s(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(5),
  },
  actionButtonClose: {
    alignItems: 'center',
    backgroundColor: '#27272A',
    borderRadius: ms(6),
    height: s(28),
    justifyContent: 'center',
    width: s(28),
  },
  actionButtonToken: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#F59E0B',
    borderRadius: ms(6),
    borderWidth: 1,
    marginRight: s(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(5),
  },
  actionTextClear: {
    color: '#EF4444',
    fontSize: fs(12),
    fontWeight: '600',
  },
  actionTextClose: {
    color: '#A1A1AA',
    fontSize: fs(14),
    fontWeight: '700',
  },
  actionTextToken: {
    color: '#FBBF24',
    fontSize: fs(12),
    fontWeight: '600',
  },
  appTitle: {
    color: '#F4F4F5',
    fontSize: fs(15),
    fontWeight: '700',
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
  emptyIcon: {
    fontSize: fs(36),
    marginBottom: vs(12),
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
  },
  filterChip: {
    backgroundColor: '#1E1E1E',
    borderColor: '#2A2A2A',
    borderRadius: ms(16),
    borderWidth: 1,
    marginRight: s(8),
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
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
  filterRow: {
    flexDirection: 'row',
    marginBottom: vs(10),
    paddingHorizontal: s(12),
  },
  listContent: {
    paddingBottom: vs(24),
  },
  safeArea: {
    backgroundColor: '#121212',
    flex: 1,
  },
  searchContainer: {
    marginBottom: vs(10),
    paddingHorizontal: s(12),
  },
  searchInput: {
    backgroundColor: '#1E1E1E',
    borderColor: '#2A2A2A',
    borderRadius: ms(8),
    borderWidth: 1,
    color: '#F4F4F5',
    fontSize: fs(13),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
  },
  subTitle: {
    color: '#71717A',
    fontSize: fs(11),
    marginTop: vs(1),
  },
  titleGroup: {
    flex: 1,
  },
  topActions: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  topBar: {
    alignItems: 'center',
    borderBottomColor: '#27272A',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
  },
});
