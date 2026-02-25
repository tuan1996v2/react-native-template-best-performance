import React, { memo, useRef } from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
} from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { s, vs } from '../../../theme/Responsive';

interface Props {
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
}

const AppSkeleton = ({ width = '100%', height = vs(20), style }: Props) => {
  const translateX = useSharedValue(0);

  // 🚀 TỐI ƯU CỐT LÕI: Dùng useRef thay vì useState để chặn đứng Re-render
  const hasAnimated = useRef(false);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width: layoutWidth } = event.nativeEvent.layout;

    if (layoutWidth > 0 && !hasAnimated.current) {
      // Đánh dấu đã chạy mà không gọi render lại
      hasAnimated.current = true;

      const shimmerWidth = layoutWidth * 0.7;
      translateX.value = -shimmerWidth;

      translateX.value = withRepeat(
        withTiming(layoutWidth + shimmerWidth, { duration: 1500 }),
        -1,
        false,
      );
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[styles.container, { width, height } as any, style]}
      onLayout={onLayout}
    >

      <View style={styles.background} />
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0.5 }} // Chỉnh y về giữa để dải sáng cân bằng tuyệt đối
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: s(8),
    overflow: 'hidden',
    backgroundColor: '#EBEBEB',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});


export default memo(AppSkeleton);
