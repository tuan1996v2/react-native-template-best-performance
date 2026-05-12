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
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';

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
  title?: string;
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
  color,
  bottomColor,
  depth = vs(6),
  disabled = false,
  disableAnimation = false,
  debounceTime = 0,
  title,
}) => {
  const mode = useThemeStore(state => state.mode);
  const theme = ThemeTokens[mode];

  const finalColor = color || theme.primary;
  // If bottomColor is not provided, we could derive it or use a default
  const finalBottomColor =
    bottomColor || (mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)');

  const push = useSharedValue(0);
  const lastPressTime = useRef<number>(0);

  const memoizedStyles = useMemo(() => {
    const activeSurfaceColor = disabled ? theme.disabled : finalColor;
    const activeBottomColor = disabled ? theme.disabledBottom : finalBottomColor;

    return {
      wrapper: [style, disabled && { opacity: 0.6 }],
      bottom: [styles.bottomLayer, { backgroundColor: activeBottomColor, borderRadius: s(12) }],
      surface: [
        styles.surface,
        {
          backgroundColor: activeSurfaceColor,
          borderRadius: s(12),
          bottom: depth,
          borderColor: theme.glassBorder,
        },
        contentStyle,
      ],
      text: [
        styles.text,
        {
          marginBottom: -depth,
          color: disabled ? theme.disabledText : '#FFFFFF',
        },
        textStyle,
      ],
    };
  }, [finalColor, finalBottomColor, depth, disabled, style, contentStyle, textStyle, theme]);

  const animatedSurfaceStyle = useAnimatedStyle(() => {
    if (disableAnimation) return { transform: [{ translateY: 0 }] };
    return {
      transform: [{ translateY: withSpring(push.value * depth, SPRING_CONFIG) }],
    };
  });

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
          style={memoizedStyles.surface}>
          <View style={styles.contentContainer}>
            {title ? (
              <Text style={memoizedStyles.text}>{title}</Text>
            ) : typeof children === 'string' ? (
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
  },
  contentContainer: { justifyContent: 'center', alignItems: 'center' },
  text: {
    fontSize: fs(18),
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export default React.memo(AppButton);
