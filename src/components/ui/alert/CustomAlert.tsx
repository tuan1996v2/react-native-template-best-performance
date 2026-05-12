import React, { memo, useEffect } from 'react';
import { Modal, View, StyleSheet, Pressable, Text } from 'react-native';
import { useAlertStore } from './useAlertStore';
import { ms, s, vs, fs } from '@/theme/Responsive';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const CustomAlert = memo(() => {
  const { visible, title, content, buttons } = useAlertStore(state => state.alert);
  const hideAlert = useAlertStore(state => state.hideAlert);

  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      scale.value = withTiming(0.9, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, opacity, scale]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent hardwareAccelerated>
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={hideAlert} />
        </Animated.View>

        <Animated.View style={[styles.alertBox, animatedStyle]}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.content}>{content}</Text>
          </View>

          <View style={styles.footer}>
            {buttons.map((btn, i) => {
              const isLast = i === buttons.length - 1;
              const isCancel = btn.style === 'cancel' || (i === 0 && buttons.length > 1);

              return (
                <Pressable
                  key={i}
                  onPress={() => {
                    btn.onPress();
                    hideAlert();
                  }}
                  style={({ pressed }) => [
                    styles.button,
                    isLast && styles.lastButton,
                    !isLast && styles.borderRight,
                    pressed && styles.buttonPressed,
                  ]}>
                  <Text style={[styles.btnText, isCancel && styles.cancelBtnText]}>{btn.text}</Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  alertBox: {
    width: s(280),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: ms(20),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentContainer: {
    padding: s(24),
    alignItems: 'center',
  },
  title: {
    fontSize: fs(18),
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
  },
  content: {
    marginTop: vs(8),
    textAlign: 'center',
    fontSize: fs(14),
    lineHeight: vs(20),
    color: '#4B5563',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  button: {
    flex: 1,
    height: vs(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastButton: {
    // Add specific styles for the primary action if needed
  },
  buttonPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  borderRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
  },
  btnText: {
    fontSize: fs(16),
    color: '#007AFF',
    fontWeight: '600',
  },
  cancelBtnText: {
    color: '#6B7280',
    fontWeight: '400',
  },
});

export default CustomAlert;
