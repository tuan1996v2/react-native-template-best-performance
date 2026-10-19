import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/theme/Colors';
import { fs, ms, s, vs } from '@/theme/Responsive';

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    apiButton: {
      alignItems: 'center',
      backgroundColor: theme.card,
      borderColor: theme.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : theme.border,
      borderRadius: ms(12),
      borderWidth: 1,
      elevation: 2,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: vs(10),
      paddingHorizontal: s(14),
      paddingVertical: vs(12),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme.mode === 'light' ? 0.05 : 0.2,
      shadowRadius: 3,
    },
    apiButtonDisabled: {
      opacity: 0.6,
    },
    apiButtonLeft: {
      flex: 1,
      marginRight: s(10),
    },
    apiDesc: {
      color: theme.textSecondary,
      fontSize: fs(12),
      lineHeight: vs(16),
      marginTop: vs(2),
    },
    apiMethodBadge: {
      borderRadius: ms(6),
      marginRight: s(8),
      paddingHorizontal: s(8),
      paddingVertical: vs(3),
    },
    apiMethodText: {
      color: '#FFFFFF',
      fontSize: fs(11),
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    apiTitle: {
      color: theme.text,
      flex: 1,
      fontSize: fs(14),
      fontWeight: '600',
    },
    apiTitleRow: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: vs(4),
    },
    badge2xx: {
      backgroundColor: '#059669',
    },
    badge4xx: {
      backgroundColor: '#DC2626',
    },
    badge5xx: {
      backgroundColor: '#991B1B',
    },
    badgeDelete: {
      backgroundColor: '#DC2626',
    },
    badgeGet: {
      backgroundColor: '#2563EB',
    },
    badgePatch: {
      backgroundColor: '#0D9488',
    },
    badgePost: {
      backgroundColor: '#D97706',
    },
    badgePut: {
      backgroundColor: '#9333EA',
    },
    badgeSlow: {
      backgroundColor: '#EA580C',
    },
    bannerNotice: {
      backgroundColor:
        theme.mode === 'light' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(59, 130, 246, 0.15)',
      borderColor: theme.mode === 'light' ? '#93C5FD' : '#3B82F6',
      borderRadius: ms(12),
      borderWidth: 1,
      marginBottom: vs(16),
      paddingHorizontal: s(14),
      paddingVertical: vs(12),
    },
    bannerNoticeSub: {
      color: theme.mode === 'light' ? '#334155' : theme.textSecondary,
      fontSize: fs(12),
      lineHeight: vs(18),
      marginTop: vs(4),
    },
    bannerNoticeTitle: {
      color: theme.mode === 'light' ? '#1D4ED8' : '#60A5FA',
      fontSize: fs(14),
      fontWeight: '700',
    },
    batchButton: {
      alignItems: 'center',
      backgroundColor: '#2563EB',
      borderRadius: ms(12),
      elevation: 3,
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: vs(16),
      paddingVertical: vs(14),
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    batchButtonText: {
      color: '#FFFFFF',
      fontSize: fs(14),
      fontWeight: '700',
      marginLeft: s(8),
    },
    headerBackButton: {
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'rgba(255, 255, 255, 0.35)',
      borderRadius: ms(8),
      borderWidth: 1,
      justifyContent: 'center',
      paddingHorizontal: s(12),
      paddingVertical: vs(6),
    },
    headerBackText: {
      color: '#FFFFFF',
      fontSize: fs(13),
      fontWeight: '700',
    },
    headerContainer: {
      borderBottomLeftRadius: s(24),
      borderBottomRightRadius: s(24),
      elevation: 10,
      overflow: 'hidden',
      paddingBottom: vs(20),
      paddingHorizontal: s(16),
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
    },
    headerOpenInspectorBtn: {
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      borderColor: 'rgba(255, 255, 255, 0.45)',
      borderRadius: ms(8),
      borderWidth: 1,
      flexDirection: 'row',
      paddingHorizontal: s(12),
      paddingVertical: vs(6),
    },
    headerOpenInspectorText: {
      color: '#FFFFFF',
      fontSize: fs(12),
      fontWeight: '700',
      marginLeft: s(6),
    },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: vs(12),
    },
    headerSubtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: fs(13),
      lineHeight: vs(18),
      marginTop: vs(4),
    },
    headerTitle: {
      color: '#FFFFFF',
      fontSize: fs(24),
      fontWeight: '800',
      letterSpacing: -0.5,
    },
    lastResultBox: {
      backgroundColor: theme.card,
      borderColor: theme.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : theme.border,
      borderRadius: ms(12),
      borderWidth: 1,
      elevation: 2,
      marginBottom: vs(16),
      padding: ms(12),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.mode === 'light' ? 0.05 : 0.2,
      shadowRadius: 4,
    },
    lastResultCode: {
      color: theme.mode === 'light' ? '#2563EB' : '#60A5FA',
      fontSize: fs(12),
      fontWeight: '600',
      lineHeight: vs(16),
      marginTop: vs(4),
    },
    lastResultHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    lastResultLabel: {
      color: theme.textSecondary,
      fontSize: fs(11),
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    root: {
      backgroundColor: theme.background,
      flex: 1,
    },
    scrollContent: {
      paddingBottom: vs(40),
      paddingHorizontal: s(16),
      paddingTop: vs(16),
    },
    sectionBox: {
      marginBottom: vs(18),
    },
    sectionTitle: {
      color: theme.text,
      fontSize: fs(16),
      fontWeight: '700',
      marginBottom: vs(8),
    },
    statusTextError: {
      color: '#EF4444',
      fontSize: fs(12),
      fontWeight: '700',
    },
    statusTextSuccess: {
      color: '#10B981',
      fontSize: fs(12),
      fontWeight: '700',
    },
  });

export default createStyles;
