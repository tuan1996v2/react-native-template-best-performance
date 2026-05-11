import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { CameraDevice } from 'react-native-vision-camera';
import { FlipCameraIcon } from '../icons/FlipCameraIcon';

interface Props {
  devices: CameraDevice[];
  setDevice: (device: CameraDevice) => void;
}

export function CameraSelectorButton({ devices, setDevice }: Props): React.ReactElement {
  const rotation = useSharedValue(0);

  const handleFlip = useCallback(() => {
    const currentIndex = devices.findIndex(
      d => d.position === (devices[0]?.position === 'back' ? 'back' : 'front'),
    );
    // Find a device with opposite position
    const currentDevice = devices[currentIndex] ?? devices[0];
    if (!currentDevice) return;

    const targetPosition = currentDevice.position === 'back' ? 'front' : 'back';
    const target = devices.find(d => d.position === targetPosition);
    if (target) {
      rotation.value = withSpring(rotation.value + 180, {
        damping: 15,
        stiffness: 150,
      });
      setDevice(target);
    }
  }, [devices, setDevice, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (devices.length <= 1) return <></>;

  return (
    <Pressable onPress={handleFlip} style={styles.button}>
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <FlipCameraIcon size={22} color="white" />
      </Animated.View>
    </Pressable>
  );
}

import { s } from '@/theme/Responsive';

const styles = StyleSheet.create({
  button: {
    padding: s(4),
  },
  iconContainer: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
