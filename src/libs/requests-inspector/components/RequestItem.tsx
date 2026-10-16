import React, { FC, memo, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { fs, ms, s, vs } from '../../../theme/Responsive';
import { NetworkLog } from '../types';

interface RequestItemProps {
  log: NetworkLog;
  onPress: (log: NetworkLog) => void;
}

const formatTime = (timestamp: number): string => {
  const d = new Date(timestamp);
  const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export const RequestItem: FC<RequestItemProps> = memo(({ log, onPress }) => {
  const methodStyle = useMemo(() => {
    switch (log.method) {
      case 'GET':
        return styles.methodGet;
      case 'POST':
        return styles.methodPost;
      case 'PUT':
        return styles.methodPut;
      case 'PATCH':
        return styles.methodPatch;
      case 'DELETE':
        return styles.methodDelete;
      default:
        return styles.methodDefault;
    }
  }, [log.method]);

  const statusStyle = useMemo(() => {
    if (log.status === 'pending') {
      return styles.statusPending;
    }
    const code = log.response?.statusCode ?? 0;
    if (code >= 200 && code < 300) {
      return styles.status2xx;
    }
    if (code >= 300 && code < 400) {
      return styles.status3xx;
    }
    return styles.statusError;
  }, [log.status, log.response?.statusCode]);

  const statusText = useMemo(() => {
    if (log.status === 'pending') {
      return 'PENDING';
    }
    if (log.response?.statusCode) {
      return String(log.response.statusCode);
    }
    return 'ERR';
  }, [log.status, log.response?.statusCode]);

  const durationText = useMemo(() => {
    if (log.response?.durationMs !== undefined) {
      return `${log.response.durationMs} ms`;
    }
    return '...';
  }, [log.response?.durationMs]);

  const formattedUrl = useMemo(() => {
    try {
      const parsed = new URL(log.url);
      return {
        host: parsed.host,
        path: parsed.pathname + parsed.search,
      };
    } catch {
      return {
        host: '',
        path: log.url,
      };
    }
  }, [log.url]);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(log)} style={styles.cardContainer}>
      <View style={styles.topRow}>
        <View style={styles.badgeGroup}>
          <View style={[styles.methodBadge, methodStyle]}>
            <Text style={styles.methodText}>{log.method}</Text>
          </View>
          <View style={[styles.statusBadge, statusStyle]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>

        <View style={styles.timeGroup}>
          <Text style={styles.durationText}>{durationText}</Text>
          <Text style={styles.timestampText}>{formatTime(log.sentTime)}</Text>
        </View>
      </View>

      <View style={styles.urlContainer}>
        {formattedUrl.host ? <Text style={styles.hostText}>{formattedUrl.host}</Text> : null}
        <Text numberOfLines={2} style={styles.pathText}>
          {formattedUrl.path}
        </Text>
      </View>

      {log.response?.error ? (
        <Text numberOfLines={1} style={styles.errorText}>
          ⚠️ {log.response.error}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
});

RequestItem.displayName = 'RequestItem';

const styles = StyleSheet.create({
  badgeGroup: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  cardContainer: {
    backgroundColor: '#1E1E1E',
    borderColor: '#2A2A2A',
    borderRadius: ms(10),
    borderWidth: 1,
    marginBottom: vs(8),
    marginHorizontal: s(12),
    padding: ms(12),
  },
  durationText: {
    color: '#9CA3AF',
    fontSize: fs(11),
    fontWeight: '600',
    marginRight: s(8),
  },
  errorText: {
    color: '#F87171',
    fontSize: fs(11),
    marginTop: vs(4),
  },
  hostText: {
    color: '#6B7280',
    fontSize: fs(11),
    marginBottom: vs(2),
  },
  methodBadge: {
    borderRadius: ms(4),
    marginRight: s(6),
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
  },
  methodDefault: {
    backgroundColor: '#4B5563',
  },
  methodDelete: {
    backgroundColor: '#DC2626',
  },
  methodGet: {
    backgroundColor: '#2563EB',
  },
  methodPatch: {
    backgroundColor: '#0D9488',
  },
  methodPost: {
    backgroundColor: '#D97706',
  },
  methodPut: {
    backgroundColor: '#9333EA',
  },
  methodText: {
    color: '#FFFFFF',
    fontSize: fs(10),
    fontWeight: '700',
  },
  pathText: {
    color: '#F3F4F6',
    fontSize: fs(13),
    fontWeight: '500',
    lineHeight: vs(18),
  },
  status2xx: {
    backgroundColor: '#059669',
  },
  status3xx: {
    backgroundColor: '#D97706',
  },
  statusBadge: {
    borderRadius: ms(4),
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
  },
  statusError: {
    backgroundColor: '#DC2626',
  },
  statusPending: {
    backgroundColor: '#374151',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: fs(10),
    fontWeight: '700',
  },
  timeGroup: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  timestampText: {
    color: '#6B7280',
    fontSize: fs(10),
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(6),
  },
  urlContainer: {
    marginTop: vs(2),
  },
});
