import type { ReactElement, ReactNode } from 'react';
import { ESwipeType } from './constants';
import type { ViewStyle } from 'react-native';

export type TItemKey = string | number;

export type TSwipeableItemWrapper = {
  id: TItemKey;
  children: ReactElement;
  animationType?: ESwipeType;
  leftSwipeView?: ReactElement;
  rightSwipeView?: ReactElement;
  leftFullSwipeView?: ReactElement;
  rightFullSwipeView?: ReactElement;
  onLeftFullSwipe?: (key: TItemKey) => void;
  onRightFullSwipe?: (key: TItemKey) => void;
  leftSwipeViewContainerStyle?: ViewStyle;
  rightSwipeViewContainerStyle?: ViewStyle;
  leftFullSwipeViewContainerStyle?: ViewStyle;
  rightFullSwipeViewContainerStyle?: ViewStyle;
  itemContainerStyle?: ViewStyle;
};

export type TListItem = {
  id: TItemKey;
  children: ReactNode;
  animationType: ESwipeType | undefined;
  onLeftFullSwipe: ((key: TItemKey) => void) | undefined;
  onRightFullSwipe: ((key: TItemKey) => void) | undefined;
  leftSwipeViewWidth: number;
  rightSwipeViewWidth: number;
  itemWidth: number;
  itemContainerStyle?: ViewStyle;
};
