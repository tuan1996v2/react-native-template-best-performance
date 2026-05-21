import React, { forwardRef, useImperativeHandle, memo } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withSequence,
  withDelay,
  cancelAnimation,
  withSpring,
} from 'react-native-reanimated';
import { s, ms, vs, fs } from '@/theme/Responsive';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export interface ChatMessageRef {
  animate: (item: {
    message: string;
    type: 'success' | 'error' | 'warning';
    duration: number;
  }) => void;
}

interface ChatMessageProps {
  isBottom?: boolean;
}

const ChatMessage = memo(
  forwardRef<ChatMessageRef, ChatMessageProps>(({ isBottom }, ref) => {
    const message = useSharedValue('');
    const type = useSharedValue<'success' | 'error' | 'warning'>('success');
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(-20);
    const scale = useSharedValue(1);

    useImperativeHandle(ref, () => ({
      animate: item => {
        // Cancel any active animation
        cancelAnimation(opacity);
        cancelAnimation(translateY);
        cancelAnimation(scale);

        // Update values on UI thread
        message.value = item.message;
        type.value = item.type;

        const duration = item.duration;

        // Bounce effect
        scale.value = withSequence(
          withTiming(1.06, { duration: 100 }),
          withTiming(1, { duration: 100 }),
        );

        if (opacity.value >= 0.2) {
          // Toast is already visible, just shift/bounce and refresh the timer
          translateY.value = withSequence(
            withTiming(isBottom ? 6 : -6, { duration: 80 }),
            withSpring(0, { damping: 12, stiffness: 100 }),
            withDelay(duration, withTiming(isBottom ? 20 : -20, { duration: 250 })),
          );

          opacity.value = withSequence(
            withTiming(1, { duration: 80 }),
            withDelay(duration, withTiming(0, { duration: 250 })),
          );
        } else {
          // Toast is not visible, animate in fully
          opacity.value = 0;
          translateY.value = isBottom ? 20 : -20;

          opacity.value = withSequence(
            withTiming(1, { duration: 250 }),
            withDelay(duration, withTiming(0, { duration: 250 })),
          );

          translateY.value = withSequence(
            withSpring(0, { damping: 12, stiffness: 100 }),
            withDelay(duration, withTiming(isBottom ? 20 : -20, { duration: 250 })),
          );
        }
      },
    }));

    const toastAnimatedStyle = useAnimatedStyle(() => {
      const currentType = type.value;
      let bg = '#ECFDF5';
      let border = '#10B981';
      if (currentType === 'error') {
        bg = '#FEF2F2';
        border = '#EF4444';
      } else if (currentType === 'warning') {
        bg = '#FFFBEB';
        border = '#F59E0B';
      }
      return {
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }, { scale: scale.value }],
        backgroundColor: bg,
        borderColor: border,
        display: opacity.value === 0 ? 'none' : 'flex',
      };
    });

    const indicatorAnimatedStyle = useAnimatedStyle(() => {
      const currentType = type.value;
      let border = '#10B981';
      if (currentType === 'error') {
        border = '#EF4444';
      } else if (currentType === 'warning') {
        border = '#F59E0B';
      }
      return {
        backgroundColor: border,
      };
    });

    const textAnimatedStyle = useAnimatedStyle(() => {
      const currentType = type.value;
      let textColor = '#065F46';
      if (currentType === 'error') {
        textColor = '#991B1B';
      } else if (currentType === 'warning') {
        textColor = '#92400E';
      }
      return {
        color: textColor,
      };
    });

    const textAnimatedProps = useAnimatedProps(
      () =>
        ({
          text: message.value,
        } as unknown as TextInput['props']),
    );

    const indicatorAnimatedProps = useAnimatedProps(() => {
      const currentType = type.value;
      let label = '💬'; // Chat icon
      if (currentType === 'warning') {
        label = '🔔'; // Mention / High-priority icon
      }
      return {
        text: label,
      } as unknown as TextInput['props'];
    });

    return (
      <Animated.View style={[styles.toast, toastAnimatedStyle]}>
        <Animated.View style={[styles.indicator, indicatorAnimatedStyle]}>
          <AnimatedTextInput
            underlineColorAndroid="transparent"
            editable={false}
            autoCorrect={false}
            spellCheck={false}
            style={styles.indicatorText}
            animatedProps={indicatorAnimatedProps}
            pointerEvents="none"
          />
        </Animated.View>
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          autoCorrect={false}
          spellCheck={false}
          multiline={true}
          style={[styles.text, textAnimatedStyle]}
          animatedProps={textAnimatedProps}
          pointerEvents="none"
        />
      </Animated.View>
    );
  }),
);

const styles = StyleSheet.create({
  toast: {
    marginHorizontal: s(16),
    paddingVertical: vs(12),
    paddingHorizontal: s(14),
    borderRadius: ms(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  indicator: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(10),
  },
  indicatorText: {
    color: '#FFF',
    fontSize: fs(12),
    fontWeight: '900',
    textAlign: 'center',
    padding: 0,
    includeFontPadding: false,
  },
  text: {
    flex: 1,
    fontSize: fs(14),
    fontWeight: '600',
    padding: 0,
    includeFontPadding: false,
  },
});

export default ChatMessage;
