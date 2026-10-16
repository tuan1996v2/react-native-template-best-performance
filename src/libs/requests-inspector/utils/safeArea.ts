import { Dimensions, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface Insets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const getDeviceSafeAreaFallback = (): Insets => {
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;

  if (Platform.OS === 'ios') {
    // iPhone X / XS / 11 / 12 / 13 / 14 / 15 / 16 / 17 have height >= 812
    const isNotchOrIsland = !Platform.isPad && !Platform.isTV && (height >= 812 || width >= 812);

    // Dynamic Island devices (iPhone 14 Pro/Pro Max, iPhone 15/16/17 series)
    const isDynamicIsland = !Platform.isPad && !Platform.isTV && (height >= 852 || width >= 852);

    const top = isDynamicIsland ? 54 : isNotchOrIsland ? 44 : 20;
    const bottom = isNotchOrIsland ? 34 : 0;

    return {
      top: isLandscape ? 0 : top,
      bottom: isLandscape ? 21 : bottom,
      left: isLandscape && isNotchOrIsland ? 44 : 0,
      right: isLandscape && isNotchOrIsland ? 44 : 0,
    };
  }

  // Android: fallback to real StatusBar height or standard 24dp
  const statusBarHeight = StatusBar.currentHeight ?? 24;
  return {
    top: statusBarHeight,
    bottom: 16,
    left: 0,
    right: 0,
  };
};

export const useSafeDeviceInsets = (): Insets => {
  try {
    const contextInsets = useSafeAreaInsets();
    const fallback = getDeviceSafeAreaFallback();

    return {
      top: Math.max(contextInsets.top, fallback.top),
      bottom: Math.max(contextInsets.bottom, fallback.bottom),
      left: Math.max(contextInsets.left, fallback.left),
      right: Math.max(contextInsets.right, fallback.right),
    };
  } catch {
    // Fallback if SafeAreaProvider is missing from the host tree
    return getDeviceSafeAreaFallback();
  }
};
