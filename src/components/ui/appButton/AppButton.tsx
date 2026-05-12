import React, { ReactNode, useMemo, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ViewStyle,
  TextStyle,
  StyleProp,
  ColorValue,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { s, vs, fs } from '../../../theme/Responsive';

interface AppButtonProps {
  onPress?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  color?: ColorValue;
  bottomColor?: ColorValue;
  depth?: number;
  disabled?: boolean;
  disableAnimation?: boolean;
  debounceTime?: number;
}

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.5,
};

const AppButton: React.FC<AppButtonProps> = ({
  onPress,
  children,
  style,
  contentStyle,
  textStyle,
  color = '#3498db',
  bottomColor = '#2980b9',
  depth = vs(6),
  disabled = false,
  disableAnimation = false,
  debounceTime = 0,
}) => {
  const push = useSharedValue(0);
  const lastPressTime = useRef<number>(0);

  // 1. GOM TOÀN BỘ MẢNG STYLE VÀO useMemo (Tránh tạo mảng mới mỗi lần render)
  const memoizedStyles = useMemo(() => {
    const activeSurfaceColor = disabled ? '#D1D5DB' : color;
    const activeBottomColor = disabled ? '#9CA3AF' : bottomColor;

    return {
      wrapper: [style, disabled && { opacity: 0.6 }],
      bottom: [styles.bottomLayer, { backgroundColor: activeBottomColor, borderRadius: s(12) }],
      surface: [
        styles.surface,
        { backgroundColor: activeSurfaceColor, borderRadius: s(12), bottom: depth },
        contentStyle,
      ],
      text: [styles.text, { marginBottom: -depth }, textStyle],
    };
  }, [color, bottomColor, depth, disabled, style, contentStyle, textStyle]);

  // 2. ANIMATION CHẠY 100% TRÊN UI THREAD
  const animatedSurfaceStyle = useAnimatedStyle(() => {
    if (disableAnimation) return { transform: [{ translateY: 0 }] };
    return {
      transform: [{ translateY: withSpring(push.value * depth, SPRING_CONFIG) }],
    };
  });

  // 3. CACHE LẠI CÁC HÀM SỰ KIỆN BẰNG useCallback
  const handlePressIn = useCallback(() => {
    if (disabled || disableAnimation) return;
    push.value = 1;
  }, [disabled, disableAnimation, push]);

  const handlePressOut = useCallback(() => {
    if (disabled || disableAnimation) return;
    push.value = 0;
  }, [disabled, disableAnimation, push]);

  const handlePress = useCallback(() => {
    if (disabled) return;

    if (debounceTime > 0) {
      const now = Date.now();
      if (now - lastPressTime.current < debounceTime) return;
      lastPressTime.current = now;
    }

    onPress?.();
  }, [disabled, debounceTime, onPress]);

  return (
    <View style={memoizedStyles.wrapper}>
      <View style={memoizedStyles.bottom} />

      <Animated.View style={animatedSurfaceStyle}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={disabled}
          unstable_pressDelay={0}
          hitSlop={s(8)}
          // Chuyền thẳng mảng style đã cache vào đây
          style={memoizedStyles.surface}>
          <View style={styles.contentContainer}>
            {typeof children === 'string' ? (
              <Text style={memoizedStyles.text}>{children}</Text>
            ) : (
              children
            )}
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  surface: {
    paddingVertical: vs(16),
    paddingHorizontal: s(24),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  contentContainer: { justifyContent: 'center', alignItems: 'center' },
  text: {
    color: 'white',
    fontSize: fs(18),
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export default React.memo(AppButton);
