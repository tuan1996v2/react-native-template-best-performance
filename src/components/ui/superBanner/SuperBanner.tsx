import React, { memo, useCallback, useMemo } from 'react';
import useRenderLog from '@/hooks/useRenderLog';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { s, vs, fs } from '../../../theme/Responsive';
import AppPress from '../appPress/AppPress';

const { width: PAGE_WIDTH } = Dimensions.get('window');
const widthArray = [s(8), s(24), s(8)];
// ─── TYPES ────────────────────────────────────────────────────
export interface BannerItem {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  gradient?: readonly [string, string];
}

interface SuperBannerProps {
  data: BannerItem[];
  height?: number;
}

// ─── PAGINATION DOT (tách riêng, dùng worklet → 0 JS re-render) ─
const PaginationDot = memo(
  ({ index, progressValue }: { index: number; progressValue: SharedValue<number> }) => {
    const animStyle = useAnimatedStyle(() => {
      const width = interpolate(
        progressValue.value,
        [index - 1, index, index + 1],
        widthArray,
        Extrapolation.CLAMP,
      );
      const opacity = interpolate(
        progressValue.value,
        [index - 1, index, index + 1],
        [0.35, 1, 0.35],
        Extrapolation.CLAMP,
      );
      return { width, opacity };
    });

    return <Animated.View style={[styles.dot, animStyle]} />;
  },
);

// ─── BANNER SLIDE (memo → chỉ render 1 lần cho mỗi item) ─────
const BannerSlide = memo(({ item }: { item: BannerItem; _height: number }) => (
  <AppPress style={styles.slideContainer}>
    <Image
      source={{ uri: item.imageUrl }}
      style={StyleSheet.absoluteFillObject}
      resizeMode="cover"
    />
    {/* Overlay gradient tối ở đáy nếu có title */}
    {item.title && (
      <View style={styles.overlayGradient}>
        <Text style={styles.slideTitle} numberOfLines={1}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={styles.slideSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        )}
      </View>
    )}
  </AppPress>
));

// ─── MAIN COMPONENT ──────────────────────────────────────────
const SuperBanner = ({ data, height = PAGE_WIDTH / 2.2 }: SuperBannerProps) => {
  useRenderLog('SuperBanner');
  const progressValue = useSharedValue(0);

  // 🚀 SharedValue cho hiệu ứng lún khi chạm (chạy trên UI thread)
  const scaleValue = useSharedValue(1);

  // Gesture: chạm → lún nhẹ, nhả → nảy lại
  const tapGesture = Gesture.Tap()
    .maxDuration(100000)
    .onBegin(() => {
      scaleValue.value = withTiming(0.96, { duration: 150 });
    })
    .onFinalize(() => {
      scaleValue.value = withSpring(1, { damping: 15, stiffness: 200 });
    });

  const animatedScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  // renderItem stable ref
  const renderItem = useCallback(
    ({ item }: { item: BannerItem }) => <BannerSlide item={item} height={height} />,
    [height],
  );

  // Pre-compute container style
  const containerStyle = useMemo(() => ({ height: height + vs(24) }), [height]);

  // onProgressChange stable ref
  const onProgressChange = useCallback(
    (_: number, absoluteProgress: number) => {
      progressValue.value = absoluteProgress;
    },
    [progressValue],
  );

  return (
    <View style={containerStyle}>
      <GestureDetector gesture={tapGesture}>
        <Animated.View style={[styles.carouselWrapper, animatedScaleStyle]}>
          <Carousel
            loop
            width={PAGE_WIDTH - s(32)}
            height={height}
            style={styles.carousel}
            autoPlay
            autoPlayInterval={3500}
            scrollAnimationDuration={800}
            data={data}
            onProgressChange={onProgressChange}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: s(50),
              parallaxAdjacentItemScale: 0.78,
            }}
            renderItem={renderItem}
          />
        </Animated.View>
      </GestureDetector>

      {/* Pagination dots */}
      <View style={styles.paginationContainer} pointerEvents="none">
        {data.map((_, index) => (
          <PaginationDot key={index} index={index} progressValue={progressValue} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselWrapper: {
    flex: 1,
  },
  carousel: {
    alignSelf: 'center',
  },
  slideContainer: {
    flex: 1,
    borderRadius: s(16),
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
  },
  overlayGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: s(16),
    paddingBottom: vs(14),
    paddingTop: vs(30),
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: vs(-20) },
    shadowOpacity: 0.6,
    shadowRadius: s(15),
  },
  slideTitle: {
    color: '#FFFFFF',
    fontSize: fs(16),
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  slideSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: fs(12),
    fontWeight: '500',
    marginTop: vs(2),
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    gap: s(6),
  },
  dot: {
    height: vs(6),
    borderRadius: s(3),
    backgroundColor: 'blue',
  },
});

export default memo(SuperBanner);
