import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme/Colors';
import { s, vs, ms, fs } from '@/theme/Responsive';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: vs(110),
      left: s(16),
      zIndex: 99998,
    },
    widgetCard: {
      backgroundColor:
        theme.mode === 'dark' ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: ms(16),
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: vs(3) },
      shadowOpacity: 0.18,
      shadowRadius: ms(8),
      elevation: 6,
      overflow: 'hidden',
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: s(10),
      paddingVertical: vs(5),
    },
    dot: {
      width: s(7),
      height: s(7),
      borderRadius: s(3.5),
      marginRight: s(5),
    },
    fpsInput: {
      fontSize: fs(11),
      fontWeight: '800',
      fontFamily: 'Courier',
      color: theme.text,
      paddingVertical: 0,
      paddingHorizontal: 0,
      includeFontPadding: false,
      minWidth: s(48),
    },
    divider: {
      width: 1,
      height: vs(12),
      backgroundColor: theme.divider,
      marginHorizontal: s(6),
    },
    speedBadge: {
      paddingHorizontal: s(6),
      paddingVertical: vs(1),
      borderRadius: ms(6),
      backgroundColor: theme.inputBg,
    },
    speedText: {
      fontSize: fs(9),
      fontWeight: '800',
      fontFamily: 'Courier',
    },
    toggleHint: {
      fontSize: fs(9),
      fontWeight: '700',
      color: theme.textMuted,
      marginLeft: s(6),
    },
    expandedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: s(10),
      paddingVertical: vs(5),
      borderTopWidth: 1,
      borderTopColor: theme.divider,
      backgroundColor: theme.primary + '0A',
    },
    screenNameButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(4),
      flexShrink: 1,
      paddingVertical: vs(2),
      paddingHorizontal: s(4),
      borderRadius: ms(4),
    },
    screenLabel: {
      fontSize: fs(10),
      fontWeight: '600',
      color: theme.textSecondary,
    },
    screenNameText: {
      fontSize: fs(11),
      fontWeight: '700',
      color: theme.primary,
    },
    copyBadge: {
      fontSize: fs(8),
      fontWeight: '800',
      color: theme.textMuted,
      marginLeft: s(4),
      paddingHorizontal: s(4),
      paddingVertical: vs(1),
      borderRadius: ms(4),
      backgroundColor: theme.inputBg,
    },
    colorFast: {
      color: '#10B981',
    },
    colorSlow: {
      color: '#EF4444',
    },
  });
