import React, { memo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useLoadingStore } from '../../store/useLoadingStore';
import { ms, fs } from '../../theme/Responsive';

const GlobalLoadingComponent = () => {
  const { isLoading, message } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <Animated.View 
      entering={FadeIn.duration(200)} 
      exiting={FadeOut.duration(200)}
      style={styles.container}
      // Chặn mọi thao tác chạm xuống các lớp dưới
      pointerEvents="auto" 
    >
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        {message && <Text style={styles.text}>{message}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Làm tối màn hình
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    padding: ms(20),
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: ms(10),
    alignItems: 'center',
  },
  text: {
    marginTop: ms(10),
    color: '#FFF',
    fontSize: fs(14),
    textAlign: 'center',
  },
});

export default memo(GlobalLoadingComponent);