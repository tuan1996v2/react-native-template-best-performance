import React, { useEffect, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { s, ms, vs, fs } from '@/theme/Responsive';

interface MessageProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onHide: () => void;
}

const Message = memo(({ message, type, onHide }: MessageProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    opacity.value = 0;
    translateY.value = -20;

    opacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(
        2500,
        withTiming(0, { duration: 300 }, finished => {
          if (finished) {
            runOnJS(onHide)();
          }
        }),
      ),
    );

    translateY.value = withSequence(
      withSpring(0, { damping: 12, stiffness: 100 }),
      withDelay(2500, withTiming(-20, { duration: 300 })),
    );
  }, [message, onHide, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const config = {
    success: { bg: '#ECFDF5', border: '#10B981', text: '#065F46', label: '✓' },
    error: { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', label: '✕' },
    warning: { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E', label: '!' },
  }[type];

  return (
    <Animated.View
      style={[
        styles.toast,
        animatedStyle,
        { backgroundColor: config.bg, borderColor: config.border },
      ]}>
      <View style={[styles.indicator, { backgroundColor: config.border }]}>
        <Text style={styles.indicatorText}>{config.label}</Text>
      </View>
      <Text style={[styles.text, { color: config.text }]}>{message}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  toast: {
    marginHorizontal: s(16),
    paddingVertical: vs(12),
    paddingHorizontal: s(14),
    borderRadius: ms(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  indicator: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(10),
  },
  indicatorText: {
    color: '#FFF',
    fontSize: fs(12),
    fontWeight: '900',
  },
  text: {
    flex: 1,
    fontSize: fs(14),
    fontWeight: '600',
  },
});

export default Message;
