import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, Platform } from 'react-native';
import AppImage from '@/components/ui/appImage/AppImage';
import AppPress from '@/components/ui/appPress/AppPress';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { IconClose } from '@/assets/icon';
import NavigationService from '@/navigation/NavigationService';
import { runOnJS } from 'react-native-worklets';

const { width, height } = Dimensions.get('window');

interface Story {
  id: string;
  userName: string;
  avatar: string;
  storyImage: string;
  thumpImage: string;
}

const STORY_DURATION = 150000;

interface StoryItemProps {
  story: Story;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
}

const StoryItem = ({ story, isActive, onNext, onPrev }: StoryItemProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      progress.value = 0;
      progress.value = withTiming(
        1,
        {
          duration: STORY_DURATION,
          easing: Easing.linear,
        },
        finished => {
          if (finished) {
            runOnJS(onNext)();
          }
        },
      );
    } else {
      progress.value = 0;
    }
  }, [isActive, onNext, progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.storyContainer}>
      <AppImage
        thumbnailSource={{ uri: story.thumpImage }}
        source={{ uri: story.storyImage }}
        style={styles.storyImage}
      />

      {/* Progress Bars Overlay */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, progressStyle]} />
        </View>
      </View>

      {/* User Info Overlay */}
      <View style={styles.userInfo}>
        <AppImage source={{ uri: story.avatar }} style={styles.userAvatar} />
        <Text style={styles.userName}>{story.userName}</Text>
      </View>

      {/* Tap Areas */}
      <View style={styles.tapAreaContainer}>
        <AppPress style={styles.tapArea} onPress={onPrev} />
        <AppPress style={styles.tapArea} onPress={onNext} />
      </View>
    </View>
  );
};

type StoryScreenRouteProps = {
  params: {
    stories: Story[];
    initialIndex: number;
  };
};

const StoryScreen = ({ route }: { route: StoryScreenRouteProps }) => {
  const { stories, initialIndex } = route.params;
  const [index, setIndex] = useState(initialIndex || 0);
  const insets = useSafeAreaInsets();
  const carouselRef = useRef<ICarouselInstance>(null);

  const handleNext = useCallback(() => {
    if (index < stories.length - 1) {
      carouselRef.current?.next();
    } else {
      NavigationService.back();
    }
  }, [index, stories.length]);

  const handlePrev = useCallback(() => {
    if (index > 0) {
      carouselRef.current?.prev();
    }
  }, [index]);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <Carousel
        ref={carouselRef}
        loop={false}
        width={width}
        height={height}
        data={stories}
        defaultIndex={initialIndex}
        onSnapToItem={setIndex}
        renderItem={({ item, index: i }: { item: Story; index: number }) => (
          <StoryItem story={item} isActive={index === i} onNext={handleNext} onPrev={handlePrev} />
        )}
      />

      <AppPress
        onPress={() => NavigationService.back()}
        style={[styles.closeBtn, { top: insets.top + 10 }]}>
        <IconClose fill="#fff" width={24} height={24} />
      </AppPress>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  storyContainer: {
    flex: 1,
  },
  storyImage: {
    width: width,
    height: height,
    backgroundColor: 'black',
  },
  progressContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 10,
    right: 10,
    flexDirection: 'row',
    gap: 5,
  },
  progressBarBg: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  userInfo: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 70 : 40,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#fff',
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tapAreaContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  tapArea: {
    flex: 1,
    // backgroundColor: 'red',
    // marginRight:1
  },
  closeBtn: {
    position: 'absolute',
    right: 15,
    padding: 10,
    zIndex: 100,
  },
});

export default StoryScreen;
