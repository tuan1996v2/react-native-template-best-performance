import React, { useState, useCallback } from 'react';
import { TextInput, View, Text, Pressable, Clipboard } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useFrameCallback,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStyles } from '@/theme/useStyles';
import { createStyles } from './FpsHUD.styles';
import { useNavigationStore } from '@/store/useNavigationStore';
import { useAlertStore } from '@/components/ui/alert/useAlertStore';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const FpsHUD: React.FC = () => {
  const styles = useStyles(createStyles);
  const currentScreen = useNavigationStore(state => state.currentScreen);
  const transitionTime = useNavigationStore(state => state.transitionTime);
  const showToast = useAlertStore(state => state.showToast);

  // State to toggle expanded details (screen row) vs compact pill
  const [isExpanded, setIsExpanded] = useState(false);

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

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  const handleCopyScreenName = useCallback(() => {
    const screenStr = String(currentScreen || 'HomeScreen');
    if (Clipboard && typeof Clipboard.setString === 'function') {
      Clipboard.setString(screenStr);
      showToast(`Đã copy: "${screenStr}"`, 'success');
    }
  }, [currentScreen, showToast]);

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

  // Tap gesture on outer widget to toggle expanded details vs compact
  const tapGesture = Gesture.Tap().onEnd(() => {
    'worklet';
    runOnJS(toggleExpanded)();
  });

  // Combine pan and tap gestures
  const composedGesture = Gesture.Exclusive(panGesture, tapGesture);

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

  const screenFullName = currentScreen ? String(currentScreen) : 'HomeScreen';

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <GestureHandlerRootView>
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={styles.widgetCard}>
            {/* Top Row: FPS Indicator & Transition Speed */}
            <View style={styles.topRow}>
              <Animated.View style={[styles.dot, animatedDotStyle]} />
              <AnimatedTextInput
                underlineColorAndroid="transparent"
                editable={false}
                style={styles.fpsInput}
                animatedProps={animatedTextProps}
              />

              <View style={styles.divider} />

              <View style={styles.speedBadge}>
                <Text
                  style={[
                    styles.speedText,
                    transitionTime > 500 ? styles.colorSlow : styles.colorFast,
                  ]}>
                  {transitionTime > 0 ? `${transitionTime}ms` : 'Ready'}
                </Text>
              </View>

              <Text style={styles.toggleHint}>{isExpanded ? '▲' : '▼'}</Text>
            </View>

            {/* Bottom Row (Expanded): Full Screen Name + Tap to Copy */}
            {isExpanded && (
              <View style={styles.expandedRow}>
                <Pressable
                  onPress={handleCopyScreenName}
                  style={styles.screenNameButton}
                  hitSlop={4}>
                  <Text style={styles.screenLabel}>Screen:</Text>
                  <Text style={styles.screenNameText}>{screenFullName}</Text>
                  <Text style={styles.copyBadge}>COPY</Text>
                </Pressable>
              </View>
            )}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Animated.View>
  );
};

export default React.memo(FpsHUD);
