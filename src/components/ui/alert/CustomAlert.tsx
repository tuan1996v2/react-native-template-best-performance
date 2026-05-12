import React, { memo, useEffect } from 'react';
import { Modal, View, StyleSheet, Pressable, Text } from 'react-native';
import { useAlertStore } from './useAlertStore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useStyles } from '@/theme/useStyles';
import createStyles from './CustomAlert.styles';

const CustomAlert = memo(() => {
  const styles = useStyles(createStyles);
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

export default CustomAlert;
