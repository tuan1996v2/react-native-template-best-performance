import { SwipeableItemWrapperComponent } from './components/SwipeRevealWrapper/SwipeRevealWrapper';
import type { TSwipeableItemWrapper } from './types';

export { ESwipeType } from './constants';

/**
 * SwipeableItemWrapper component for wrapping items which need to be swipeable
 * @param id - Unique key for item
 * @param children - Children to be wrapped
 * @param animationType - Type of animation (left-swipe, right-swipe, left-right-swipe, left-full-swipe, right-full-swipe)
 * @param leftSwipeView - View to be revealed when item swiped to left side for animationType left-swipe, left-right-swipe
 * @param rightSwipeView - View to be revealed when item swiped to right side for animationType right-swipe, left-right-swipe
 * @param leftFullSwipeView - View to be shown on full swipe to left most end for animationType left-full-swipe
 * @param rightFullSwipeView - View to be shown on full swipe to right most end for animationType right-full-swipe
 * @param onLeftFullSwipe - Function that needs to be called on full swipe to left most end for animationType left-full-swipe
 * @param onRightFullSwipe - Function that needs to be called on full swipe to right most end for animationType left-full-swipe
 * @param leftSwipeViewContainerStyle - Styles for immediate parent view container of leftSwipeView
 * @param rightSwipeViewContainerStyle - Styles for immediate parent view container of rightSwipeView
 * @param leftFullSwipeViewContainerStyle - Styles for immediate parent view container of leftFullSwipeView
 * @param rightFullSwipeViewContainerStyle - Styles for immediate parent view container of rightFullSwipeView
 * @param itemContainerStyle - Styles for immediate parent view container of Children to be wrapped
 */

export const SwipeableItemWrapper = ({
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
}: TSwipeableItemWrapper) => (
  <SwipeableItemWrapperComponent
    id={id}
    animationType={animationType}
    leftSwipeView={leftSwipeView}
    rightSwipeView={rightSwipeView}
    leftFullSwipeView={leftFullSwipeView}
    rightFullSwipeView={rightFullSwipeView}
    onLeftFullSwipe={onLeftFullSwipe}
    onRightFullSwipe={onRightFullSwipe}
    leftSwipeViewContainerStyle={leftSwipeViewContainerStyle}
    rightSwipeViewContainerStyle={rightSwipeViewContainerStyle}
    leftFullSwipeViewContainerStyle={leftFullSwipeViewContainerStyle}
    rightFullSwipeViewContainerStyle={rightFullSwipeViewContainerStyle}
    itemContainerStyle={itemContainerStyle}>
    {children}
  </SwipeableItemWrapperComponent>
);
