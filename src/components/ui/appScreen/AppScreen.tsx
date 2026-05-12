import React, { memo, useMemo } from 'react';
import { StatusBar, StatusBarStyle, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';

interface AppScreenProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  statusBarStyle?: StatusBarStyle;
}

const AppScreen = memo(
  ({
    children,
    edges = ['top', 'bottom'],
    style,
    backgroundColor,
    statusBarStyle,
  }: AppScreenProps) => {
    const mode = useThemeStore(state => state.mode);
    const theme = ThemeTokens[mode];

    // Use theme background if not provided
    const finalBackgroundColor = backgroundColor || theme.background;

    // Automatically set status bar style based on theme if not provided
    const finalStatusBarStyle =
      statusBarStyle || (mode === 'dark' ? 'light-content' : 'dark-content');

    const containerStyle = useMemo(
      () => [{ flex: 1, backgroundColor: finalBackgroundColor }, style],
      [finalBackgroundColor, style],
    );

    return (
      <SafeAreaView edges={edges} style={containerStyle} mode="padding">
        <StatusBar barStyle={finalStatusBarStyle} backgroundColor={finalBackgroundColor} />
        {children}
      </SafeAreaView>
    );
  },
);

export default AppScreen;
