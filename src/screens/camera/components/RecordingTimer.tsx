import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface Props {
  elapsedTime: SharedValue<number>;
}

export const RecordingTimer = React.memo(function RecordingTimer({ elapsedTime }: Props) {
  const animatedProps = useAnimatedProps<{ text: string }>(() => {
    const totalSeconds = Math.floor(elapsedTime.value / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const mm = minutes.toString().padStart(2, '0') || '00';
    const ss = seconds.toString().padStart(2, '0') || '00';

    return {
      text: `${mm}:${ss}`,
    };
  });

  // Only visible when elapsedTime > 0
  const containerStyle = useAnimatedStyle(() => ({
    opacity: elapsedTime.value > 0 ? 1 : 0,
    transform: [{ scale: elapsedTime.value > 0 ? 1 : 0.8 }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: elapsedTime.value > 0 ? withRepeat(withTiming(0.3, { duration: 800 }), -1, true) : 0,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.dot, pulseStyle]} />
      <AnimatedTextInput
        underlineColorAndroid="transparent"
        editable={false}
        style={styles.timer}
        animatedProps={animatedProps}
      />
    </Animated.View>
  );
});

import { s, vs, fs } from '@/theme/Responsive';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: s(16),
    gap: s(6),
  },
  dot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: '#FF3B30',
  },
  timer: {
    color: '#FFFFFF',
    fontSize: fs(15),
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    padding: 0,
    minWidth: s(45),
  },
});
