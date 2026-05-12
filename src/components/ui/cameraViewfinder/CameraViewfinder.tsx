import React, { useEffect } from 'react';
import { View } from 'react-native';
import { CameraView } from '@pushpendersingh/react-native-scanner';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useStyles } from '@/theme/useStyles';
import createStyles from '@/screens/qrScan/screen/QrScanScreen.styles';

interface CameraViewfinderProps {
  isScanning: boolean;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({ isScanning }) => {
  const styles = useStyles(createStyles);
  const opacity = useSharedValue(0);
  const height = useSharedValue(0);
  const scanLinePos = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(isScanning ? 1 : 0, { duration: 400 });
    height.value = withTiming(isScanning ? 400 : 0, { duration: 500 });

    if (isScanning) {
      scanLinePos.value = withRepeat(
        withSequence(withTiming(1, { duration: 2000 }), withTiming(0, { duration: 2000 })),
        -1,
        true,
      );
    }
  }, [isScanning, opacity, scanLinePos, height]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    height: height.value,
    marginVertical: interpolate(height.value, [0, 400], [0, 16], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(opacity.value, [0, 1], [0.9, 1], Extrapolation.CLAMP) }],
  }));

  const scanLineStyle = useAnimatedStyle(() => ({
    top: `${scanLinePos.value * 100}%`,
  }));

  return (
    <Animated.View style={[styles.cameraContainer, containerStyle]}>
      <CameraView style={styles.camera} />
      <View style={styles.scannerOverlay}>
        <View style={styles.scannerFrame}>
          {/* Scanning Line Animation */}
          <Animated.View style={[styles.scanLine, scanLineStyle]} />
        </View>
      </View>
    </Animated.View>
  );
};
