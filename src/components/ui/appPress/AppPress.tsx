import React, { ReactNode, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
  ColorValue,
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

interface Props {
  onPress?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  rippleColor?: ColorValue;
  rippleOpacity?: number;
  rippleDuration?: number;
  debounceTime?: number;
  disabled?: boolean;
  disableAnimation?: boolean;
}

const AppPress = ({
  onPress,
  children,
  style,
  rippleColor = 'rgba(255, 255, 255, 0.4)',
  rippleOpacity = 0.4,
  rippleDuration = 400,
  debounceTime = 500,
  disabled = false,
  disableAnimation = false,
}: Props) => {
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const progress = useSharedValue(0);

  // TỐI ƯU 1: Dọn rác
  useEffect(() => () => {}, []);

  // TỐI ƯU 2: Bọc useCallback để tránh tạo mới function
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    width.value = event.nativeEvent.layout.width;
    height.value = event.nativeEvent.layout.height;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rippleStyle = useAnimatedStyle(() => {
    const radius = Math.sqrt(width.value ** 2 + height.value ** 2);
    const diameter = radius * 2;

    return {
      width: diameter,
      height: diameter,
      borderRadius: radius,
      backgroundColor: rippleColor,
      position: 'absolute',
      top: centerY.value - radius,
      left: centerX.value - radius,
      opacity: interpolate(progress.value, [0, 0.5, 1], [0, rippleOpacity, 0], Extrapolation.CLAMP),
      transform: [{ scale: progress.value }],
    };
  });

  const lastPressTime = useRef(0);

  // TỐI ƯU 3: Bọc useCallback cho sự kiện nhấn
  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return;

      // Hiển thị animation ngay lập tức để người dùng có phản hồi (feedback)
      if (!disableAnimation) {
        centerX.value = event.nativeEvent.locationX;
        centerY.value = event.nativeEvent.locationY;
        progress.value = 0;
        progress.value = withTiming(1, { duration: rippleDuration });
      }

      const now = Date.now();
      if (now - lastPressTime.current < debounceTime) {
        console.log('AppPress: Chặn do đang trong thời gian debounce');
        return;
      }

      lastPressTime.current = now;
      onPress?.();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled, disableAnimation, debounceTime, rippleDuration, onPress],
  );

  // Style array memoization
  const flattenedStyle = useMemo(() => [styles.container, style], [style]);

  return (
    <Pressable onPress={handlePress} disabled={disabled} onLayout={onLayout} style={flattenedStyle}>
      {children}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={rippleStyle} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
});

// TỐI ƯU 4: Dùng custom comparator nếu cần (nhưng chuẩn nhất là fix ở Component Cha)
export default React.memo(AppPress);
