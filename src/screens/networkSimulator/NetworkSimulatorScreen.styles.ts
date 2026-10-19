import { StyleSheet } from 'react-native';

import type { AppTheme } from '@/theme/Colors';
import { fs, ms, s, vs } from '@/theme/Responsive';

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    apiButton: {
      alignItems: 'center',
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderRadius: ms(12),
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: vs(10),
      paddingHorizontal: s(14),
      paddingVertical: vs(12),
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
      borderRadius: ms(4),
      paddingHorizontal: s(6),
      paddingVertical: vs(2),
    },
    apiMethodText: {
      color: '#FFFFFF',
      fontSize: fs(10),
      fontWeight: '700',
    },
    apiTitle: {
      color: theme.text,
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
      backgroundColor: '#D97706',
    },
    bannerNotice: {
      backgroundColor: 'rgba(59, 130, 246, 0.12)',
      borderColor: '#3B82F6',
      borderRadius: ms(12),
      borderWidth: 1,
      marginBottom: vs(16),
      paddingHorizontal: s(14),
      paddingVertical: vs(12),
    },
    bannerNoticeSub: {
      color: theme.textSecondary,
      fontSize: fs(12),
      lineHeight: vs(17),
      marginTop: vs(2),
    },
    bannerNoticeTitle: {
      color: '#60A5FA',
      fontSize: fs(14),
      fontWeight: '700',
    },
    batchButton: {
      alignItems: 'center',
      backgroundColor: '#2563EB',
      borderRadius: ms(12),
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: vs(16),
      paddingVertical: vs(14),
    },
    batchButtonText: {
      color: '#FFFFFF',
      fontSize: fs(14),
      fontWeight: '700',
      marginLeft: s(6),
    },
    headerBackButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: s(8),
      paddingVertical: vs(6),
    },
    headerBackText: {
      color: '#FFFFFF',
      fontSize: fs(15),
      fontWeight: '600',
    },
    headerContainer: {
      paddingBottom: vs(16),
      paddingHorizontal: s(16),
    },
    headerOpenInspectorBtn: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: ms(8),
      borderWidth: 1,
      paddingHorizontal: s(10),
      paddingVertical: vs(6),
    },
    headerOpenInspectorText: {
      color: '#FFFFFF',
      fontSize: fs(12),
      fontWeight: '700',
    },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: vs(10),
    },
    headerSubtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: fs(13),
      marginTop: vs(2),
    },
    headerTitle: {
      color: '#FFFFFF',
      fontSize: fs(22),
      fontWeight: '800',
      letterSpacing: -0.5,
    },
    lastResultBox: {
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderRadius: ms(10),
      borderWidth: 1,
      marginBottom: vs(16),
      padding: ms(12),
    },
    lastResultCode: {
      color: '#60A5FA',
      fontSize: fs(11),
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
