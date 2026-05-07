import { useCallback, useEffect, useRef } from 'react';
import { type GestureResponderEvent, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Line, Rect, Svg } from 'react-native-svg';
import { Camera, type CameraRef, type CameraViewProps } from 'react-native-vision-camera';

type Props = Omit<
  CameraViewProps,
  'ref' | 'style' | 'enableNativeZoomGesture' | 'enableNativeTapToFocusGesture'
>;

export function CameraView({ device, constraints, ...props }: Props) {
  const camera = useRef<CameraRef>(null);

  useEffect(() => {
    if (typeof device === 'string') {
      console.log(`Device changed: "${device}"`);
    } else {
      console.log(`Device changed: ${device.localizedName}`);
      console.log(`  - Supported Pixel Formats:`, device.supportedPixelFormats);
      console.log(`  - Supported Photo Resolutions:`, device.getSupportedResolutions('photo'));
      console.log(`  - Supported Video Resolutions:`, device.getSupportedResolutions('video'));
      console.log(`  - Supported FPS Ranges:`, device.supportedFPSRanges);
      console.log(`  - Supported Dynamic Ranges:`, device.supportedVideoDynamicRanges);
    }
  }, [device]);

  const focusX = useSharedValue(0);
  const focusY = useSharedValue(0);
  const focusScale = useSharedValue(1);
  const focusOpacity = useSharedValue(0);

  const onPress = useCallback(
    async (event: GestureResponderEvent) => {
      if (camera.current == null) throw new Error(`Camera ref is not yet ready!`);

      const x = event.nativeEvent.locationX;
      const y = event.nativeEvent.locationY;

      // Update focus indicator position and animate
      focusX.value = x;
      focusY.value = y;
      focusScale.value = 1.5;
      focusOpacity.value = 1;

      // Scale down and then fade out
      focusScale.value = withSpring(1, { damping: 15, stiffness: 200 });
      focusOpacity.value = withDelay(2000, withTiming(0, { duration: 500 }));

      try {
        console.log(`Focusing to (${x.toFixed(0)}, ${y.toFixed(0)})...`);
        await camera.current.focusTo(
          { x, y },
          {
            adaptiveness: 'continuous',
            autoResetAfter: 3,
            responsiveness: 'snappy',
          },
        );
      } catch (error) {
        console.error(`Failed to focus!`, error);
      }
    },
    [focusX, focusY, focusScale, focusOpacity],
  );

  const focusIndicatorStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: focusX.value - 30, // center the 60x60 square
    top: focusY.value - 30,
    opacity: focusOpacity.value,
    transform: [{ scale: focusScale.value }],
  }));

  return (
    <View style={styles.flex} onTouchEnd={onPress}>
      <Camera
        {...props}
        ref={camera}
        style={styles.camera}
        device={device}
        constraints={constraints}
        onSubjectAreaChanged={() => {
          console.log(`Subject Area Changed! Resetting Focus...`);
          camera.current?.resetFocus();
          focusOpacity.value = withTiming(0);
        }}
        onSessionConfigSelected={config => {
          console.log(`Given Constraints:`, constraints);
          console.log(`Resolved SessionConfig:`, config.toString());
        }}
      />

      {/* Focus Indicator */}
      <Animated.View style={focusIndicatorStyle} pointerEvents="none">
        <Svg width="60" height="60" viewBox="0 0 60 60">
          <Rect
            x="2"
            y="2"
            width="56"
            height="56"
            stroke="#FFD60A"
            strokeWidth="2"
            fill="transparent"
          />
          <Line x1="30" y1="2" x2="30" y2="10" stroke="#FFD60A" strokeWidth="2" />
          <Line x1="30" y1="50" x2="30" y2="58" stroke="#FFD60A" strokeWidth="2" />
          <Line x1="2" y1="30" x2="10" y2="30" stroke="#FFD60A" strokeWidth="2" />
          <Line x1="50" y1="30" x2="58" y2="30" stroke="#FFD60A" strokeWidth="2" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  camera: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
});
