import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export type CameraMode = 'photo' | 'video';

interface Props {
  mode: CameraMode;
  setMode: (mode: CameraMode) => void;
  disabled?: boolean;
}

const MODES: CameraMode[] = ['photo', 'video'];
const MODE_LABELS: Record<CameraMode, string> = {
  photo: 'Photo',
  video: 'Video',
};

const INDICATOR_WIDTH = 70;

export function CameraModeSelector({ mode, setMode, disabled }: Props) {
  const indicatorX = useSharedValue(mode === 'photo' ? 0 : 1);

  const handlePress = useCallback(
    (m: CameraMode) => {
      if (disabled) return;
      indicatorX.value = withSpring(m === 'photo' ? 0 : 1, {
        damping: 20,
        stiffness: 200,
      });
      setMode(m);
    },
    [setMode, indicatorX, disabled],
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value * INDICATOR_WIDTH }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.indicator, indicatorStyle]} />
        {MODES.map(m => (
          <Pressable key={m} style={styles.tab} onPress={() => handlePress(m)} disabled={disabled}>
            <Text
              style={[
                styles.label,
                mode === m && styles.labelActive,
                disabled && styles.labelDisabled,
              ]}>
              {MODE_LABELS[m]}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  track: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 3,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: INDICATOR_WIDTH,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 22,
  },
  tab: {
    width: INDICATOR_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  label: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  labelActive: {
    color: '#FFFFFF',
  },
  labelDisabled: {
    opacity: 0.4,
  },
});
