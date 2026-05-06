import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { ANIMATION_DURATION, EDraggingDirection } from '../constants';
import type { TItemKey } from '../types';

export const usePanXGesture = (
  leftSwipeViewWidth: number,
  rightSwipeViewWidth: number,
  id: string | number,
  onLeftFullSwipe: ((key: TItemKey) => void) | undefined,
  onRightFullSwipe: ((key: TItemKey) => void) | undefined,
  isLeftSwipe: boolean,
  isRightSwipe: boolean,
  isLeftFullSwipe: boolean,
  isRightFullSwipe: boolean,
  itemWidth: number,
) => {
  //this is used to make scrollview active with pangesture
  const initialTouchLocation = useSharedValue<{
    x: number;
    y: number;
  } | null>(null);

  const offsetX = useSharedValue(0);
  const startX = useSharedValue(0);
  const dragDirectionShared = useSharedValue(EDraggingDirection.none);

  const resetOffsets = (duration?: number) => {
    'worklet';
    if (duration) {
      offsetX.value = withTiming(0, { duration });
    } else {
      offsetX.value = 0;
    }
    startX.value = 0;
  };

  const getLeftPanX = (value: number) => {
    'worklet';
    //in case user drags from right to left, values will always be negative.
    //in order to avoid dealing with negative values, convert them to positive
    return -value;
  };

  const panXGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown(e => {
      'worklet';
      if (e?.changedTouches[0]?.x && e?.changedTouches[0]?.y) {
        initialTouchLocation.value = {
          x: e.changedTouches[0].x,
          y: e.changedTouches[0].y,
        };
      }
    })
    .onTouchesMove((evt, state) => {
      'worklet';
      // Sanity checks
      if (!initialTouchLocation.value || !evt.changedTouches.length) {
        state.fail();
        return;
      }
      /*
      https://github.com/software-mansion/react-native-gesture-handler/issues/1933#issuecomment-2081857102
      Here we will decide if user is scrolling or swiping item horizontally.

      Case 1 : When user scrolled down the list, x values didn't change and y values changed.
      Before scroll
      initialTouchLocation.value.x = 118
      After scroll
      evt.changedTouches[0].x = 118

      Before scroll
      initialTouchLocation.value.y = 14.3
      After scroll
      evt.changedTouches[0].y = 15

      Here as only y values changed we can conclude user was scrolling vertically.

      Case 2: When item swiped horizontally right y values didn't change, x values changed
      Before scroll
      initialTouchLocation.value.x = 33.3
      After scroll
      evt.changedTouches[0].x = 32.6

      Before scroll
      initialTouchLocation.value.y = 25
      After scroll
      evt.changedTouches[0].y = 25

      Here as only x values changed we can conclude user was swiping item horizontally.
      Also I added additional check of isDragging. If user is dragging the item, state will never fail unless user end the drag.
      */
      const xDiff = Math.abs((evt?.changedTouches[0]?.x || 0) - initialTouchLocation.value.x);
      const yDiff = Math.abs((evt?.changedTouches[0]?.y || 0) - initialTouchLocation.value.y);
      const isHorizontalPanning = xDiff > yDiff;
      if (isHorizontalPanning) {
        state.activate();
      } else {
        if (dragDirectionShared.value === EDraggingDirection.none) {
          state.fail();
        } else {
          state.activate();
        }
      }
    })
    .onUpdate(e => {
      'worklet';
      const dragX = startX.value + e.translationX;
      //update drag direction
      dragDirectionShared.value =
        dragX > 0
          ? EDraggingDirection.right
          : dragX < 0
          ? EDraggingDirection.left
          : EDraggingDirection.none;
      /*
    dragX > 0 -> dragging to right side.
    dragX < 0 -> dragging to left side.
    here in one drag, we want to let user drag only one touchable either left or right
    User cannot see both touchables in one drag
    */
      if (dragDirectionShared.value === EDraggingDirection.right) {
        if (!isRightSwipe && !isRightFullSwipe) {
          return;
        }
        if (dragX > 0) {
          if (isRightSwipe && dragX > rightSwipeViewWidth) {
            return;
          }
          //drag item to right
          offsetX.value = dragX;
        } else {
          //while dragging right, if dragged to leftmost end reset values
          resetOffsets();
        }
      }
      if (dragDirectionShared.value === EDraggingDirection.left) {
        if (!isLeftSwipe && !isLeftFullSwipe) {
          return;
        }
        if (dragX < 0) {
          if (isLeftSwipe && getLeftPanX(dragX) > leftSwipeViewWidth) {
            return;
          }
          //drag item to left
          offsetX.value = dragX;
        } else {
          //while dragging left, if dragged to rightmost end reset values
          resetOffsets();
        }
      }
    })
    .onEnd(() => {
      'worklet';
      if (dragDirectionShared.value === EDraggingDirection.right) {
        //moving to right side

        if (isRightSwipe) {
          if (offsetX.value >= rightSwipeViewWidth / 2) {
            //move to right drag boundary
            offsetX.value = withTiming(rightSwipeViewWidth, {
              duration: ANIMATION_DURATION,
            });
            startX.value = rightSwipeViewWidth;
          } else if (offsetX.value < rightSwipeViewWidth / 2) {
            //move to leftmost end
            resetOffsets(ANIMATION_DURATION);
          }
        }

        if (isRightFullSwipe) {
          if (offsetX.value >= itemWidth / 2) {
            //move to rightmost side and remove item
            offsetX.value = withTiming(
              itemWidth,
              {
                duration: ANIMATION_DURATION,
              },
              () => {
                if (typeof onRightFullSwipe === 'function') {
                  runOnJS(onRightFullSwipe)(id);
                }
              },
            );
            startX.value = itemWidth;
          } else if (offsetX.value < itemWidth / 2) {
            //move to leftmost end
            resetOffsets(ANIMATION_DURATION);
          }
        }
      } else if (dragDirectionShared.value === EDraggingDirection.left) {
        //moving to left side

        if (isLeftSwipe) {
          if (getLeftPanX(offsetX.value) >= leftSwipeViewWidth / 2) {
            //move to left drag boundary

            //we set -leftSwipeViewWidth, as moving from left to right, values should be negative.
            offsetX.value = withTiming(-leftSwipeViewWidth, {
              duration: ANIMATION_DURATION,
            });
            startX.value = -leftSwipeViewWidth;
          } else if (getLeftPanX(offsetX.value) < leftSwipeViewWidth / 2) {
            //move to rightmost end
            resetOffsets(ANIMATION_DURATION);
          }
        }

        if (isLeftFullSwipe) {
          if (getLeftPanX(offsetX.value) >= itemWidth / 2) {
            //move to leftmost end and remove item

            //we set -itemWidth, as moving from left to right, values should be negative.
            offsetX.value = withTiming(
              -itemWidth,
              {
                duration: ANIMATION_DURATION,
              },
              () => {
                if (typeof onLeftFullSwipe === 'function') {
                  runOnJS(onLeftFullSwipe)(id);
                }
              },
            );
            startX.value = -itemWidth;
          } else if (getLeftPanX(offsetX.value) < itemWidth / 2) {
            //move to rightmost end
            resetOffsets(ANIMATION_DURATION);
          }
        }
      } else {
        //reset all values
        resetOffsets(ANIMATION_DURATION);
        dragDirectionShared.value = EDraggingDirection.none;
      }
    });

  const panXAnimatedStyles = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: offsetX.value,
        },
      ],
    }),
    [offsetX.value],
  );

  return {
    panXAnimatedStyles,
    panXGesture,
  };
};
