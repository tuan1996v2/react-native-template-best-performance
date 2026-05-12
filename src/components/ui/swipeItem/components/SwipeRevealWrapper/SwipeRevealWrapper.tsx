import { useState } from 'react';
import type { TSwipeableItemWrapper } from '../../types';
import Animated from 'react-native-reanimated';
import { ESwipeType } from '../../constants';
import { View, type LayoutChangeEvent } from 'react-native';
import createStyles from './SwipeRevealWrapper.styles';
import { GestureDetectorComponent } from '../GestureDetectorComponent';
import { useStyles } from '@/theme/useStyles';

export const SwipeableItemWrapperComponent = ({
  id,
  children,
  animationType,
  leftSwipeView,
  rightSwipeView,
  leftFullSwipeView,
  rightFullSwipeView,
  onLeftFullSwipe,
  onRightFullSwipe,
  leftSwipeViewContainerStyle,
  rightSwipeViewContainerStyle,
  leftFullSwipeViewContainerStyle,
  rightFullSwipeViewContainerStyle,
  itemContainerStyle,
}: TSwipeableItemWrapper) => {
  const styles = useStyles(createStyles);
  const [leftSwipeViewWidth, setLeftSwipeViewWidth] = useState(0);
  const [rightSwipeViewWidth, setRightSwipeViewWidth] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  const onLayoutLeftSwipeView = (event: LayoutChangeEvent) => {
    setLeftSwipeViewWidth(event.nativeEvent.layout.width);
  };

  const onLayoutRightSwipeView = (event: LayoutChangeEvent) => {
    setRightSwipeViewWidth(event.nativeEvent.layout.width);
  };

  const onLayoutItem = (event: LayoutChangeEvent) => {
    setItemWidth(event.nativeEvent.layout.width);
  };

  return (
    <View onLayout={onLayoutItem} key={id}>
      <GestureDetectorComponent
        onLeftFullSwipe={onLeftFullSwipe}
        onRightFullSwipe={onRightFullSwipe}
        id={id}
        animationType={animationType}
        leftSwipeViewWidth={leftSwipeViewWidth}
        rightSwipeViewWidth={rightSwipeViewWidth}
        itemWidth={itemWidth}
        itemContainerStyle={itemContainerStyle}>
        {children}
      </GestureDetectorComponent>
      {(animationType === ESwipeType.LEFT || animationType === ESwipeType.LEFT_RIGHT) &&
      leftSwipeView ? (
        <View
          onLayout={onLayoutLeftSwipeView}
          style={[
            styles.rightContainer,
            leftSwipeViewContainerStyle && leftSwipeViewContainerStyle,
          ]}>
          {leftSwipeView}
        </View>
      ) : null}
      {(animationType === ESwipeType.RIGHT || animationType === ESwipeType.LEFT_RIGHT) &&
      rightSwipeView ? (
        <View
          onLayout={onLayoutRightSwipeView}
          style={[
            styles.leftRevealedViewContainer,
            rightSwipeViewContainerStyle && rightSwipeViewContainerStyle,
          ]}>
          {rightSwipeView}
        </View>
      ) : null}
      {animationType === ESwipeType.RIGHT_FULL && rightFullSwipeView ? (
        <View
          style={[
            styles.leftRevealedViewContainer,
            styles.w100,
            rightFullSwipeViewContainerStyle && rightFullSwipeViewContainerStyle,
          ]}>
          {rightFullSwipeView}
        </View>
      ) : null}
      {animationType === ESwipeType.LEFT_FULL && leftFullSwipeView ? (
        <Animated.View
          style={[
            styles.rightContainer,
            styles.w100,
            leftFullSwipeViewContainerStyle && leftFullSwipeViewContainerStyle,
          ]}>
          {leftFullSwipeView}
        </Animated.View>
      ) : null}
    </View>
  );
};
