import React from 'react';
import { TextInput } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStyles } from '@/theme/useStyles';
import { createStyles } from './FpsHUD.styles';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const FpsHUD: React.FC = () => {
  const styles = useStyles(createStyles);

  // Position shared values for dragging
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // FPS calculation shared values (100% on UI thread)
  const frameCount = useSharedValue(0);
  const lastTimestamp = useSharedValue(0);
  const fpsString = useSharedValue('60 FPS');
  const fpsColor = useSharedValue('#10B981'); // Green

  // Pan gesture for dragging the widget on screen
  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate(event => {
      'worklet';
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    });

  // Reanimated 4 Frame Callback: Calculates FPS without waking up JS thread
  useFrameCallback(frameInfo => {
    'worklet';
    if (!frameInfo.timestamp) {
      return;
    }

    if (lastTimestamp.value === 0) {
      lastTimestamp.value = frameInfo.timestamp;
      return;
    }

    frameCount.value += 1;
    const elapsed = frameInfo.timestamp - lastTimestamp.value;

    // Update FPS calculation every 500ms
    if (elapsed >= 500) {
      const currentFps = Math.min(120, Math.round((frameCount.value * 1000) / elapsed));
      fpsString.value = `${currentFps} FPS`;

      if (currentFps >= 55) {
        fpsColor.value = '#10B981'; // Green (Smooth 60/120fps)
      } else if (currentFps >= 40) {
        fpsColor.value = '#F59E0B'; // Orange (Minor drops)
      } else {
        fpsColor.value = '#EF4444'; // Red (Severe drops)
      }

      frameCount.value = 0;
      lastTimestamp.value = frameInfo.timestamp;
    }
  });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const animatedDotStyle = useAnimatedStyle(() => ({
    backgroundColor: fpsColor.value,
  }));

  const animatedTextProps = useAnimatedProps(() => ({
    text: fpsString.value,
    defaultValue: fpsString.value,
  }));

  if (!__DEV__) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <GestureHandlerRootView>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={styles.pill}>
            <Animated.View style={[styles.dot, animatedDotStyle]} />
            <AnimatedTextInput
              underlineColorAndroid="transparent"
              editable={false}
              style={styles.fpsInput}
              animatedProps={animatedTextProps}
            />
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Animated.View>
  );
};

export default React.memo(FpsHUD);
