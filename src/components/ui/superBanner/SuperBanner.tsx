/* eslint-disable react-native/no-unused-styles */
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
import { useStyles } from '@/theme/useStyles';
import { AppTheme } from '@/theme/Colors';

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

// ─── PAGINATION DOT ───
const PaginationDot = memo(
  ({ index, progressValue }: { index: number; progressValue: SharedValue<number> }) => {
    const styles = useStyles(createStyles);
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

// ─── BANNER SLIDE ───
const BannerSlide = memo(({ item }: { item: BannerItem; height: number }) => {
  const styles = useStyles(createStyles);
  return (
    <AppPress style={styles.slideContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
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
  );
});

// ─── MAIN COMPONENT ──────────────────────────────────────────
const SuperBanner = ({ data, height = PAGE_WIDTH / 2.2 }: SuperBannerProps) => {
  useRenderLog('SuperBanner');
  const styles = useStyles(createStyles);
  const progressValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);

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

  const renderItem = useCallback(
    ({ item }: { item: BannerItem }) => <BannerSlide item={item} height={height} />,
    [height],
  );

  const containerStyle = useMemo(() => ({ height: height + vs(24) }), [height]);

  const onProgressChange = useCallback((_: number, absoluteProgress: number) => {
    progressValue.value = absoluteProgress;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <View style={styles.paginationContainer} pointerEvents="none">
        {data.map((_, index) => (
          <PaginationDot key={index} index={index} progressValue={progressValue} />
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
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
      backgroundColor: theme.inputBg,
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
      backgroundColor: theme.primary,
    },
  });

export default memo(SuperBanner);
