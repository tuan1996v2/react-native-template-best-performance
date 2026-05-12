import { AppTheme } from '@/theme/Colors';
import { s, vs } from '@/theme/Responsive';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: s(16),
      paddingBottom: vs(40),
    },
    btnSubmit: {
      marginTop: vs(24),
    },
  });
