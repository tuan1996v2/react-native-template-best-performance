import React, { FC, useCallback, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useNetworkStore } from '../networkStore';
import { fs, ms, s, vs } from '../utils/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BUTTON_SIZE = s(54);
const MARGIN = s(12);
const MIN_X = MARGIN;
const MAX_X = SCREEN_WIDTH - BUTTON_SIZE - MARGIN;
const MIN_Y = vs(60);
const MAX_Y = SCREEN_HEIGHT - BUTTON_SIZE - vs(80);

export const FloatingButton: FC = () => {
  const isEnabled = useNetworkStore(state => state.isEnabled);
  const logs = useNetworkStore(state => state.logs);
  const setModalVisible = useNetworkStore(state => state.setModalVisible);

  const translateX = useSharedValue(MAX_X);
  const translateY = useSharedValue(SCREEN_HEIGHT * 0.45);
  const prevX = useSharedValue(MAX_X);
  const prevY = useSharedValue(SCREEN_HEIGHT * 0.45);

  const openModal = useCallback(() => {
    setModalVisible(true);
  }, [setModalVisible]);

  const hasErrors = useMemo(() => logs.some(log => log.status === 'error'), [logs]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevX.value = translateX.value;
      prevY.value = translateY.value;
    })
    .onUpdate(event => {
      const nextX = prevX.value + event.translationX;
      const nextY = prevY.value + event.translationY;

      translateX.value = Math.min(Math.max(nextX, MIN_X), MAX_X);
      translateY.value = Math.min(Math.max(nextY, MIN_Y), MAX_Y);
    })
    .onEnd(() => {
      const targetX = translateX.value < SCREEN_WIDTH / 2 - BUTTON_SIZE / 2 ? MIN_X : MAX_X;
      translateX.value = withSpring(targetX, {
        damping: 18,
        stiffness: 140,
        mass: 0.8,
      });
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(openModal)();
  });

  const gesture = Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  if (!isEnabled) {
    return null;
  }

  return (
    <Animated.View style={[styles.floatingContainer, animatedStyle]}>
      <GestureHandlerRootView style={styles.gestureRoot}>
        <GestureDetector gesture={gesture}>
          <View style={styles.floatingButton}>
            <Text style={styles.iconText}>🕵️</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{logs.length}</Text>
            </View>
            {hasErrors ? <View style={styles.errorDot} /> : null}
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  countBadge: {
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: ms(8),
    bottom: -vs(4),
    justifyContent: 'center',
    minWidth: s(18),
    paddingHorizontal: s(4),
    paddingVertical: vs(1),
    position: 'absolute',
  },
  countText: {
    color: '#FFFFFF',
    fontSize: fs(9),
    fontWeight: '700',
  },
  errorDot: {
    backgroundColor: '#EF4444',
    borderColor: '#1E1E1E',
    borderRadius: s(5),
    borderWidth: 1.5,
    height: s(10),
    position: 'absolute',
    right: 0,
    top: 0,
    width: s(10),
  },
  floatingButton: {
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderColor: '#3B82F6',
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 2,
    elevation: 10,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    width: BUTTON_SIZE,
  },
  floatingContainer: {
    elevation: 9999,
    height: BUTTON_SIZE,
    left: 0,
    position: 'absolute',
    top: 0,
    width: BUTTON_SIZE,
    zIndex: 9999,
  },
  gestureRoot: {
    height: BUTTON_SIZE,
    width: BUTTON_SIZE,
  },
  iconText: {
    fontSize: fs(20),
  },
});
