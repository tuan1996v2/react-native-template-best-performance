import React, { FC, useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { copyToClipboard, extractAuthToken } from '../clipboardHelper';
import { generateCurlCommand } from '../curlHelper';
import { NetworkLog } from '../types';
import { fs, ms, s, vs } from '../utils/responsive';
import { ChevronLeftIcon, CopyIcon, KeyIcon } from './Icons';

interface RequestDetailViewProps {
  log: NetworkLog;
  onBack: () => void;
}

type DetailTab = 'REQUEST' | 'RESPONSE' | 'CURL';

const safeFormatJson = (data: unknown): string => {
  if (data === undefined || data === null) {
    return 'Empty';
  }
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return data;
    }
  }
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
};

export const RequestDetailView: FC<RequestDetailViewProps> = ({ log, onBack }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('RESPONSE');

  const curlCommand = useMemo(() => generateCurlCommand(log), [log]);

  const authToken = useMemo(
    () => extractAuthToken(log.headers) || extractAuthToken(log.response?.headers),
    [log.headers, log.response?.headers],
  );

  const handleCopyCurl = useCallback(async () => {
    const success = await copyToClipboard(curlCommand);
    if (success) {
      Alert.alert('Copied', 'cURL command copied to clipboard!');
    }
  }, [curlCommand]);

  const handleCopyToken = useCallback(async () => {
    if (!authToken) {
      return;
    }
    const success = await copyToClipboard(authToken);
    if (success) {
      Alert.alert('Token Copied', 'Clean Authorization token copied to clipboard!');
    }
  }, [authToken]);

  const handleCopyText = useCallback(async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      Alert.alert('Copied', `${label} copied to clipboard!`);
    }
  }, []);

  const formattedRequestBody = useMemo(() => safeFormatJson(log.body), [log.body]);

  const formattedResponseBody = useMemo(
    () => safeFormatJson(log.response?.body),
    [log.response?.body],
  );

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
          onPress={onBack}
          style={styles.backButton}>
          <ChevronLeftIcon color="#3B82F6" size={s(16)} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {authToken ? (
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              onPress={handleCopyToken}
              style={styles.tokenButton}>
              <KeyIcon color="#FBBF24" size={s(12)} />
              <Text style={styles.tokenButtonText}>Token</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            onPress={handleCopyCurl}
            style={styles.headerActionButton}>
            <CopyIcon color="#60A5FA" size={s(12)} />
            <Text style={styles.headerActionText}>cURL</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* URL Banner */}
      <View style={styles.urlBanner}>
        <View style={styles.urlRow}>
          <View style={styles.methodPill}>
            <Text style={styles.methodPillText}>{log.method}</Text>
          </View>
          <Text numberOfLines={2} style={styles.urlText}>
            {log.url}
          </Text>
        </View>
      </View>

      {/* Tabs Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('REQUEST')}
          style={[styles.tabItem, activeTab === 'REQUEST' && styles.tabItemActive]}>
          <Text style={[styles.tabItemText, activeTab === 'REQUEST' && styles.tabItemTextActive]}>
            Request
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('RESPONSE')}
          style={[styles.tabItem, activeTab === 'RESPONSE' && styles.tabItemActive]}>
          <Text style={[styles.tabItemText, activeTab === 'RESPONSE' && styles.tabItemTextActive]}>
            Response
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('CURL')}
          style={[styles.tabItem, activeTab === 'CURL' && styles.tabItemActive]}>
          <Text style={[styles.tabItemText, activeTab === 'CURL' && styles.tabItemTextActive]}>
            cURL
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.contentScroll}>
        {activeTab === 'REQUEST' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Request Headers</Text>
            </View>
            <View style={styles.card}>
              {log.headers && Object.keys(log.headers).length > 0 ? (
                Object.entries(log.headers).map(([k, v]) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    key={k}
                    onPress={() => handleCopyText(`${k}: ${v}`, 'Header')}
                    style={styles.keyValueRow}>
                    <Text style={styles.keyText}>{k}:</Text>
                    <Text style={styles.valText}>{String(v)}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>No request headers</Text>
              )}
            </View>

            {log.queryParameters && Object.keys(log.queryParameters).length > 0 ? (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Query Parameters</Text>
                </View>
                <View style={styles.card}>
                  {Object.entries(log.queryParameters).map(([k, v]) => (
                    <View key={k} style={styles.keyValueRow}>
                      <Text style={styles.keyText}>{k}:</Text>
                      <Text style={styles.valText}>{String(v)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.sectionHeaderWithAction}>
              <Text style={styles.sectionTitle}>Request Body</Text>
              {formattedRequestBody !== 'Empty' ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCopyText(formattedRequestBody, 'Request Body')}
                  style={styles.copySmallButton}>
                  <Text style={styles.copySmallButtonText}>Copy Body</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.card}>
              <Text selectable style={styles.codeText}>
                {formattedRequestBody}
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'RESPONSE' && (
          <View>
            <View style={styles.statusBanner}>
              <View style={styles.statusBadgeRow}>
                <Text style={styles.statusLabel}>Status:</Text>
                <Text style={styles.statusVal}>
                  {log.response?.statusCode ?? (log.status === 'pending' ? 'Pending' : 'Error')}
                </Text>
              </View>
              <View style={styles.statusBadgeRow}>
                <Text style={styles.statusLabel}>Duration:</Text>
                <Text style={styles.statusVal}>
                  {log.response?.durationMs !== undefined ? `${log.response.durationMs} ms` : '...'}
                </Text>
              </View>
            </View>

            {log.response?.error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerTitle}>Error Details</Text>
                <Text style={styles.errorBannerText}>{log.response.error}</Text>
              </View>
            ) : null}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Response Headers</Text>
            </View>
            <View style={styles.card}>
              {log.response?.headers && Object.keys(log.response.headers).length > 0 ? (
                Object.entries(log.response.headers).map(([k, v]) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    key={k}
                    onPress={() => handleCopyText(`${k}: ${v}`, 'Response Header')}
                    style={styles.keyValueRow}>
                    <Text style={styles.keyText}>{k}:</Text>
                    <Text style={styles.valText}>{String(v)}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>No response headers</Text>
              )}
            </View>

            <View style={styles.sectionHeaderWithAction}>
              <Text style={styles.sectionTitle}>Response Body</Text>
              {formattedResponseBody !== 'Empty' ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCopyText(formattedResponseBody, 'Response Body')}
                  style={styles.copySmallButton}>
                  <Text style={styles.copySmallButtonText}>Copy Body</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.card}>
              <Text selectable style={styles.codeText}>
                {formattedResponseBody}
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'CURL' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>cURL Command</Text>
            </View>

            <View style={styles.codeBox}>
              <Text selectable style={styles.curlText}>
                {curlCommand}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCopyCurl}
              style={styles.copyCurlButton}>
              <CopyIcon color="#FFFFFF" size={s(14)} />
              <Text style={styles.copyCurlButtonText}>Copy cURL to Clipboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: s(8),
    paddingVertical: vs(6),
  },
  backButtonText: {
    color: '#3B82F6',
    fontSize: fs(15),
    fontWeight: '600',
    marginLeft: s(4),
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderColor: '#2A2A2A',
    borderRadius: ms(8),
    borderWidth: 1,
    marginBottom: vs(12),
    padding: ms(12),
  },
  codeBox: {
    backgroundColor: '#18181B',
    borderColor: '#27272A',
    borderRadius: ms(8),
    borderWidth: 1,
    marginBottom: vs(16),
    padding: ms(14),
  },
  codeText: {
    color: '#A1A1AA',
    fontFamily: 'Courier',
    fontSize: fs(12),
    lineHeight: vs(18),
  },
  contentScroll: {
    flex: 1,
  },
  copyCurlButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: ms(8),
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: vs(12),
  },
  copyCurlButtonText: {
    color: '#FFFFFF',
    fontSize: fs(14),
    fontWeight: '600',
    marginLeft: s(6),
  },
  copySmallButton: {
    backgroundColor: '#374151',
    borderRadius: ms(4),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
  },
  copySmallButtonText: {
    color: '#D1D5DB',
    fontSize: fs(11),
    fontWeight: '500',
  },
  curlText: {
    color: '#60A5FA',
    fontFamily: 'Courier',
    fontSize: fs(12),
    lineHeight: vs(19),
  },
  container: {
    backgroundColor: '#121212',
    flex: 1,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: fs(12),
    fontStyle: 'italic',
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
    borderRadius: ms(8),
    borderWidth: 1,
    marginBottom: vs(12),
    padding: ms(10),
  },
  errorBannerText: {
    color: '#FCA5A5',
    fontSize: fs(12),
  },
  errorBannerTitle: {
    color: '#EF4444',
    fontSize: fs(12),
    fontWeight: '700',
    marginBottom: vs(2),
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#27272A',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
  },
  headerActionButton: {
    alignItems: 'center',
    backgroundColor: '#27272A',
    borderRadius: ms(6),
    flexDirection: 'row',
    marginLeft: s(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
  },
  headerActionText: {
    color: '#60A5FA',
    fontSize: fs(12),
    fontWeight: '600',
    marginLeft: s(4),
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  keyText: {
    color: '#93C5FD',
    fontSize: fs(12),
    fontWeight: '600',
    marginRight: s(6),
  },
  keyValueRow: {
    borderBottomColor: '#27272A',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: vs(6),
  },
  methodPill: {
    backgroundColor: '#2563EB',
    borderRadius: ms(4),
    marginRight: s(8),
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
  },
  methodPillText: {
    color: '#FFFFFF',
    fontSize: fs(11),
    fontWeight: '700',
  },
  scrollContent: {
    padding: ms(12),
    paddingBottom: vs(40),
  },
  sectionHeader: {
    marginBottom: vs(6),
  },
  sectionHeaderWithAction: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(6),
  },
  sectionTitle: {
    color: '#9CA3AF',
    fontSize: fs(12),
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusBadgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusBanner: {
    backgroundColor: '#1E1E1E',
    borderColor: '#2A2A2A',
    borderRadius: ms(8),
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: vs(12),
    paddingVertical: vs(10),
  },
  statusLabel: {
    color: '#9CA3AF',
    fontSize: fs(12),
    marginRight: s(6),
  },
  statusVal: {
    color: '#F9FAFB',
    fontSize: fs(13),
    fontWeight: '700',
  },
  tabBar: {
    backgroundColor: '#18181B',
    borderBottomColor: '#27272A',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  tabItem: {
    alignItems: 'center',
    borderBottomColor: 'transparent',
    borderBottomWidth: 2,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: vs(10),
  },
  tabItemActive: {
    borderBottomColor: '#3B82F6',
  },
  tabItemText: {
    color: '#71717A',
    fontSize: fs(13),
    fontWeight: '600',
  },
  tabItemTextActive: {
    color: '#3B82F6',
  },
  tokenButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: '#F59E0B',
    borderRadius: ms(6),
    borderWidth: 1,
    flexDirection: 'row',
    marginLeft: s(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
  },
  tokenButtonText: {
    color: '#FBBF24',
    fontSize: fs(12),
    fontWeight: '600',
    marginLeft: s(4),
  },
  urlBanner: {
    backgroundColor: '#18181B',
    borderBottomColor: '#27272A',
    borderBottomWidth: 1,
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
  },
  urlRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  urlText: {
    color: '#F4F4F5',
    flex: 1,
    fontSize: fs(12),
    fontWeight: '500',
  },
  valText: {
    color: '#E4E4E7',
    flex: 1,
    fontSize: fs(12),
  },
});
