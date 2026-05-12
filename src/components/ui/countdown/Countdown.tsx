import React, { useEffect, useRef, memo } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  AppState,
  AppStateStatus,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import { s, fs } from '@/theme/Responsive';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface CountdownProps {
  initialSeconds: number;
  onFinished?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  prefix?: string;
  suffix?: string;
}

const Countdown = memo(
  ({ initialSeconds, onFinished, style, textStyle, prefix = '', suffix = '' }: CountdownProps) => {
    const endTime = useSharedValue(Date.now() + initialSeconds * 1000);
    const remainingTime = useSharedValue(initialSeconds);
    const appState = useRef(AppState.currentState);

    const timeString = useDerivedValue(() => {
      const time = Math.max(0, remainingTime.value);
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);

      const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const sStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

      return `${prefix}${mStr}:${sStr}${suffix}`;
    }, [prefix, suffix]);

    const animatedProps = useAnimatedProps(
      () =>
        ({
          text: timeString.value,
        } as unknown as TextInput['props']),
    );

    useEffect(() => {
      let interval: NodeJS.Timeout;

      const startTimer = () => {
        interval = setInterval(() => {
          'worklet';
          const now = Date.now();
          const diff = Math.max(0, Math.floor((endTime.value - now) / 1000));

          remainingTime.value = diff;

          if (diff <= 0) {
            clearInterval(interval);
            if (onFinished) runOnJS(onFinished)();
          }
        }, 1000);
      };

      startTimer();

      const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          const now = Date.now();
          remainingTime.value = Math.max(0, Math.floor((endTime.value - now) / 1000));
        }
        appState.current = nextAppState;
      });

      return () => {
        clearInterval(interval);
        subscription.remove();
      };
    }, [endTime, remainingTime, onFinished]);

    return (
      <View style={[styles.container, style]}>
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          autoCorrect={false}
          spellCheck={false}
          style={[styles.timerText, textStyle]}
          animatedProps={animatedProps}
          defaultValue={timeString.value}
          pointerEvents="none"
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: fs(14),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    paddingVertical: 0,
    paddingHorizontal: s(4), // Thêm padding ngang để tránh mất ký tự
    includeFontPadding: false,
    minWidth: s(60), // Đảm bảo đủ chiều rộng cho mm:ss
  },
});

export default Countdown;
