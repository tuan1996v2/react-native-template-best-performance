import React, { useEffect, memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withDelay, 
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { s, ms } from '../../../theme/Responsive';

const Message = memo(({ message, type, onHide }: any) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = 0; // Reset
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(2000, withTiming(0, { duration: 200 }, (finished) => {
        if (finished) runOnJS(onHide)();
      }))
    );
  }, [message]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: (1 - opacity.value) * -10 }]
  }));

  const backgroundColor = type === 'success' ? 'green' : 'red';

  return (
    <Animated.View style={[styles.toast, animatedStyle, { backgroundColor }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  toast: {
    marginHorizontal: s(20),
    padding: s(12),
    borderRadius: ms(8),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  text: { color: '#FFF', fontWeight: '600', textAlign: 'center' }
});

export default Message;