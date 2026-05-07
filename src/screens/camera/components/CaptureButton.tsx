import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { CameraMode } from './CameraModeSelector';

export interface CaptureButtonProps {
  mode: CameraMode;
  isRecording: SharedValue<boolean>;
  onPress: () => void;
}

const OUTER_SIZE = 76;
const SPRING_CONFIG = { damping: 15, stiffness: 200 };
const PRESS_SPRING = { damping: 15, stiffness: 300 };

export const CaptureButton = React.memo(function CaptureButton({
  mode,
  isRecording,
  onPress,
}: CaptureButtonProps): React.ReactElement {
  const pressScale = useSharedValue(1);

  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const innerStyle = useAnimatedStyle(() => {
    const isVideo = mode === 'video';
    const recording = isRecording.value;

    const targetSize = isVideo ? (recording ? 28 : 62) : 62;
    const targetRadius = isVideo ? (recording ? 8 : 31) : 31;

    return {
      width: withSpring(targetSize, SPRING_CONFIG),
      height: withSpring(targetSize, SPRING_CONFIG),
      borderRadius: withSpring(targetRadius, SPRING_CONFIG),
      backgroundColor: isVideo ? '#FF3B30' : '#FFFFFF',
    };
  });

  return (
    <Pressable
      onPressIn={() => {
        pressScale.value = withSpring(0.92, PRESS_SPRING);
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, PRESS_SPRING);
      }}
      onPress={onPress}>
      <Animated.View style={[styles.outer, outerStyle]}>
        <Animated.View style={innerStyle} />
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  outer: {
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    borderRadius: OUTER_SIZE / 2,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
