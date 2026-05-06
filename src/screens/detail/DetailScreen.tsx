import React, { useRef, useCallback, useMemo } from 'react';
import useRenderLog from '@/hooks/useRenderLog';
import { View, Text, ScrollView } from 'react-native';
import AppImage from '@/components/ui/appImage/AppImage';
import { FlashList } from '@shopify/flash-list';

import AppScreen from '@/components/ui/appScreen/AppScreen';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppPress from '@/components/ui/appPress/AppPress';
import SocialPostCard from './HeavyItem';
import SuperGallery, { type SuperGalleryRef } from '@/components/ui/superGallery/SuperGallery';
import { IconAlert, IconArrowUp, IconPlus } from '@/assets/icon';

import styles, {
  COLORS,
  HEADER_HEIGHT,
  STORIES_HEIGHT,
  GRADIENT_START,
  GRADIENT_END,
  BG_GRADIENT_COLORS,
  HEADER_GRADIENT_COLORS,
  FAB_GRADIENT_COLORS,
  STORY_RING_COLORS_FULL,
  STORY_RING_COLORS,
} from './DetailScreen.styles';
import NavigationService from '@/navigation/NavigationService';
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

// ─── TYPES ────────────────────────────────────────────────────
export interface SocialPost {
  id: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  content: string;
  postImages: string[]; // Thay postImage thành mảng ảnh
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
  isLiked: boolean;
  isVerified: boolean;
}

// ─── MOCK DATA ────────────────────────────────────────────────
const USER_NAMES = [
  'Minh Tuấn',
  'Ngọc Anh',
  'Hoàng Long',
  'Thu Hà',
  'Đức Phúc',
  'Lan Phương',
  'Quang Huy',
  'Mai Linh',
  'Trung Kiên',
  'Bảo Ngọc',
  'Thanh Tùng',
  'Hải Yến',
  'Công Vinh',
  'Thùy Linh',
  'Văn Đức',
];

const HANDLES = [
  '@minhtuan',
  '@ngocanh',
  '@hoanglong',
  '@thuha',
  '@ducphuc',
  '@lanphuong',
  '@quanghuy',
  '@mailinh',
  '@trungkien',
  '@baongoc',
  '@thanhtung',
  '@haiyen',
  '@congvinh',
  '@thuylinh',
  '@vanduc',
];

const CONTENTS = [
  'Hôm nay trời đẹp quá, ra ngoài chụp vài tấm ảnh Cuộc sống đôi khi chỉ cần đơn giản như thế thôi!',
  'Vừa hoàn thành dự án mới! Cảm ơn team đã cùng nhau cố gắng. #coding #teamwork',
  'Chia sẻ với mọi người bức ảnh từ chuyến đi Đà Lạt cuối tuần Thành phố ngàn hoa đẹp lắm nha!',
  'Đang học React Native, thấy FlashList xịn thật sự! Performance cải thiện rõ rệt so với FlatList 💪',
  'Ai đã xem phim mới chưa? Hay lắm luôn á! Recommend mọi người nên đi xem.',
  'Cuối tuần nấu ăn cho gia đình Menu hôm nay: Phở bò, chả giò, và chè bưởi!',
  'Morning coffee  và code một chút trước khi đi làm. Productivity x100!',
  "Tối nay team building! Mong là sẽ vui như lần trước. Let's gooo!",
  'Mới adopt một chú mèo con  Dễ thương quá trời luôn! Đặt tên là Mochi.',
  'Review sách "Atomic Habits"  Cuốn sách thay đổi góc nhìn của mình về thói quen hàng ngày.',
  'Sunset tại Vũng Tàu  Đẹp đến nao lòng!',
  'Gym session done! No pain, no gain. Cố gắng mỗi ngày một chút.',
  'Đang làm side project - một app quản lý chi tiêu cá nhân. Ai muốn beta test không?',
  'Tản mạn cuối ngày... Cảm ơn những người luôn ở bên cạnh mình',
  'Workshop React Native tuần này rất bổ ích! Học được nhiều thứ hay về animation và performance',
];

const TIMES = [
  '2 phút trước',
  '15 phút trước',
  '1 giờ trước',
  '2 giờ trước',
  '3 giờ trước',
  '5 giờ trước',
  '8 giờ trước',
  '12 giờ trước',
  'Hôm qua',
  '2 ngày trước',
  '3 ngày trước',
  '1 tuần trước',
];

// Hàm helper tạo mảng ảnh random (0-20 ảnh)
const generatePostImages = (postIndex: number): string[] => {
  const rand = Math.random();
  let count: number;

  if (rand < 0.3) {
    count = 0; // 30% tỷ lệ 0 ảnh
  } else if (rand < 0.6) {
    count = 1; // 30% tỷ lệ 1 ảnh
  } else if (rand < 0.7) {
    count = Math.floor(Math.random() * 9) + 2; // 10% tỷ lệ từ 2 -> 10 ảnh
  } else {
    count = Math.floor(Math.random() * 10) + 11; // 30% tỷ lệ từ 11 -> 20 ảnh
  }

  return Array.from({ length: count }).map(
    (_, imgIdx) => `https://picsum.photos/seed/${postIndex * 10 + imgIdx + 100}/800/600`,
  );
};

export const DATA: SocialPost[] = Array.from({ length: 200 }).map((_, i) => ({
  id: i.toString(),
  userName: USER_NAMES[i % USER_NAMES.length],
  userHandle: HANDLES[i % HANDLES.length],
  userAvatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  content: CONTENTS[i % CONTENTS.length],
  postImages: generatePostImages(i),
  likes: Math.floor(Math.random() * 500) + 1,
  comments: Math.floor(Math.random() * 100),
  shares: Math.floor(Math.random() * 50),
  timeAgo: TIMES[i % TIMES.length],
  isLiked: Math.random() > 0.6,
  isVerified: Math.random() > 0.7,
}));

const STORIES = USER_NAMES.slice(0, 8).map((name, idx) => ({
  id: idx.toString(),
  userName: name,
  avatar: `https://i.pravatar.cc/100?u=${name}`, // Random low quality avatar
  storyImage: `https://picsum.photos/seed/story${idx}/600/1200`, // High quality story image
  thumpImage: `https://picsum.photos/seed/story${idx}/300/600`, // High quality story image
}));

const StoriesBar = React.memo(
  ({
    stories,
    onStoryPress,
  }: {
    stories: typeof STORIES;
    onStoryPress: (index: number) => void;
  }) => (
    <View style={styles.storiesBar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContent}>
        <View style={styles.storyItem}>
          <LinearGradient
            colors={STORY_RING_COLORS_FULL}
            style={styles.storyRing}
            start={GRADIENT_START}
            end={GRADIENT_END}>
            <View style={styles.storyAvatarInner}>
              <IconPlus fill="#fff" width={20} height={20} />
            </View>
          </LinearGradient>
          <Text style={styles.storyName}>Của bạn</Text>
        </View>

        {stories.map((item, idx) => (
          <AppPress key={item.id} style={styles.storyItem} onPress={() => onStoryPress(idx)}>
            <LinearGradient
              colors={STORY_RING_COLORS}
              style={styles.storyRing}
              start={GRADIENT_START}
              end={GRADIENT_END}>
              <View style={styles.storyAvatarInner}>
                <AppImage source={{ uri: item.avatar }} style={styles.storyAvatarImage} />
              </View>
            </LinearGradient>
            <Text style={styles.storyName} numberOfLines={1}>
              {item.userName.split(' ').pop()}
            </Text>
          </AppPress>
        ))}
      </ScrollView>
    </View>
  ),
);

// ─── HEADER BAR (extracted + memoized) ────────────────────────
const HeaderBar = React.memo(({ scrollToTop }: { scrollToTop: () => void }) => (
  <View style={styles.headerInner}>
    <AppPress onPress={scrollToTop} style={styles.headerLeft}>
      <Text style={styles.headerTitle}>Social Feed</Text>
      <Text style={styles.headerSubtitle}>Khám phá thế giới</Text>
    </AppPress>
    <View style={styles.headerRight}>
      <View style={styles.notificationDot} />
      <IconAlert fill="#fff" width={24} height={24} />
      <View style={styles.headerAvatarWrap}>
        <Text style={styles.headerAvatarText}>T</Text>
      </View>
    </View>
  </View>
));

// ─── KEY EXTRACTOR (stable ref outside component) ───
const keyExtractor = (item: SocialPost) => item.id;

// ─── MAIN SCREEN ──────────────────────────────────────────────
const DetailScreen = () => {
  useRenderLog('DetailScreen');
  const listRef = useRef<FlashList<SocialPost>>(null);

  const insets = useSafeAreaInsets();

  // ── Gallery ref (ZERO re-render ─ parent không biết gì về state gallery) ──
  const galleryRef = useRef<SuperGalleryRef>(null);

  const openGallery = useCallback((images: string[], index: number) => {
    galleryRef.current?.open(images, index);
  }, []);

  const handleStoryPress = useCallback((index: number) => {
    NavigationService.navigate('StoryScreen', { stories: STORIES, initialIndex: index });
  }, []);

  // renderItem với onImagePress (stable nhờ useCallback + openGallery không bao giờ đổi)
  const renderItem = useCallback(
    ({ item }: { item: SocialPost }) => <SocialPostCard item={item} onImagePress={openGallery} />,
    [openGallery],
  );

  // Total height = safe area top + header + stories (dynamic per device)
  const totalCollapsibleHeight = insets.top + HEADER_HEIGHT + STORIES_HEIGHT;

  // ── Shared values (all UI thread, zero JS re-renders) ──
  const headerTranslateY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const showScrollBtn = useSharedValue(0);

  // 🚀 useAnimatedScrollHandler — 100% UI thread, ZERO JS bridge
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      'worklet';
      const y = event.contentOffset.y;
      const dy = y - lastScrollY.value;

      if (y > 0) {
        const next = headerTranslateY.value - dy;
        headerTranslateY.value = Math.max(-totalCollapsibleHeight, Math.min(0, next));
      } else {
        headerTranslateY.value = 0;
      }

      lastScrollY.value = y;

      // FAB scroll-to-top
      const shouldShow = y > 600 ? 1 : 0;
      if (shouldShow !== Math.round(showScrollBtn.value)) {
        showScrollBtn.value = withSpring(shouldShow, {
          damping: 14,
          stiffness: 100,
        });
      }
    },
  });

  // ── Animated styles (pure UI thread) ──
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    opacity: showScrollBtn.value,
    transform: [
      {
        scale: interpolate(showScrollBtn.value, [0, 1], [0.5, 1], Extrapolation.CLAMP),
      },
      {
        translateY: interpolate(showScrollBtn.value, [0, 1], [30, 0], Extrapolation.CLAMP),
      },
    ],
  }));

  // ── Scroll to top ──
  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  // ── Content padding for collapsible overlay (dynamic) ──
  const listContentStyle = useMemo(
    () => ({ paddingTop: totalCollapsibleHeight, paddingBottom: 100 }),
    [totalCollapsibleHeight],
  );

  // ── Memoize spacer height ──
  const spacerStyle = useMemo(() => ({ height: insets.top }), [insets.top]);

  return (
    <AppScreen edges={[]} style={styles.root}>
      <LinearGradient colors={BG_GRADIENT_COLORS} style={styles.gradient}>
        {/* ── FEED LIST ──────────────────── */}
        <AnimatedFlashList
          ref={listRef}
          data={DATA}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={500}
          drawDistance={250}
          contentContainerStyle={listContentStyle}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />

        {/* ── COLLAPSIBLE HEADER (absolute overlay) ─── */}
        <Animated.View style={[styles.collapsibleHeader, headerAnimatedStyle]}>
          <LinearGradient colors={HEADER_GRADIENT_COLORS} style={styles.headerGradient}>
            <View style={spacerStyle} />
            <HeaderBar scrollToTop={scrollToTop} />
            <StoriesBar stories={STORIES} onStoryPress={handleStoryPress} />
          </LinearGradient>
        </Animated.View>

        {/* ── FAB SCROLL TO TOP ───────────── */}
        <Animated.View style={[styles.fabContainer, fabAnimatedStyle]} pointerEvents="box-none">
          <AppPress onPress={scrollToTop} style={styles.fabTouchable}>
            <LinearGradient
              colors={FAB_GRADIENT_COLORS}
              style={styles.fab}
              start={GRADIENT_START}
              end={GRADIENT_END}>
              <IconArrowUp fill="#fff" width={24} height={24} />
            </LinearGradient>
          </AppPress>
        </Animated.View>
      </LinearGradient>

      {/* ── IMAGE GALLERY (đặt ngoài LinearGradient, không gây re-render) ── */}
      <SuperGallery ref={galleryRef} />
    </AppScreen>
  );
};

export default DetailScreen;
export { COLORS };
