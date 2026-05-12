import { useMemo } from 'react';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { usePanXGesture } from '../hooks/usePanXGesture';
import type { TListItem } from '../types';
import { ESwipeType } from '../constants';
import { View } from 'react-native';
import createStyles from './SwipeRevealWrapper/SwipeRevealWrapper.styles';
import { useStyles } from '@/theme/useStyles';

export const GestureDetectorComponent = ({
  id,
  children,
  animationType,
  onLeftFullSwipe,
  onRightFullSwipe,
  leftSwipeViewWidth,
  rightSwipeViewWidth,
  itemWidth,
  itemContainerStyle,
}: TListItem) => {
  const styles = useStyles(createStyles);

  const isLeftSwipe = useMemo(
    () =>
      (animationType === ESwipeType.LEFT || animationType === ESwipeType.LEFT_RIGHT) &&
      leftSwipeViewWidth !== 0,
    [animationType, leftSwipeViewWidth],
  );

  const isRightSwipe = useMemo(
    () =>
      (animationType === ESwipeType.RIGHT || animationType === ESwipeType.LEFT_RIGHT) &&
      rightSwipeViewWidth !== 0,
    [animationType, rightSwipeViewWidth],
  );

  const isLeftFullSwipe = useMemo(() => animationType === ESwipeType.LEFT_FULL, [animationType]);

  const isRightFullSwipe = useMemo(() => animationType === ESwipeType.RIGHT_FULL, [animationType]);

  const { panXAnimatedStyles, panXGesture } = usePanXGesture(
    leftSwipeViewWidth,
    rightSwipeViewWidth,
    id,
    onLeftFullSwipe,
    onRightFullSwipe,
    isLeftSwipe,
    isRightSwipe,
    isLeftFullSwipe,
    isRightFullSwipe,
    itemWidth,
  );

  return isLeftSwipe || isRightSwipe || isLeftFullSwipe || isRightFullSwipe ? (
    <GestureDetector gesture={panXGesture}>
      <Animated.View
        style={[panXAnimatedStyles, styles.zindex, itemContainerStyle && itemContainerStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  ) : (
    <View style={[itemContainerStyle && itemContainerStyle]}>{children}</View>
  );
};
