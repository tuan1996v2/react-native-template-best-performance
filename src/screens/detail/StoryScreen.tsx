import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Dimensions, StatusBar } from 'react-native';
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
import { runOnJS } from 'react-native-reanimated';
import { useStyles } from '@/theme/useStyles';
import { createStyles } from './StoryScreen.style';

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

  const styles = useStyles(createStyles);

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
  const styles = useStyles(createStyles);
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
        <IconClose fill={styles.white.color} width={24} height={24} />
      </AppPress>
    </View>
  );
};

export default StoryScreen;
