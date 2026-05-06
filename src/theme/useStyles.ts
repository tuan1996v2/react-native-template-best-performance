import { useMemo } from 'react';
import { StyleSheet, ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { ThemeTokens, AppTheme } from './Colors';
import { useThemeStore } from '../store/useThemeStore';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export const useStyles = <T extends NamedStyles<T>>(factory: (theme: AppTheme) => T) => {
  const mode = useThemeStore(state => state.mode);

  return useMemo(() => {
    const theme = ThemeTokens[mode];
    return StyleSheet.create(factory(theme));
  }, [mode, factory]); // factory bây giờ là tham chiếu tĩnh, cực kỳ an toàn
};
