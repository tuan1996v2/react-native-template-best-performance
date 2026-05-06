import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { ESwipeType, SwipeableItemWrapper } from '@/components/ui/swipeItem';
import { Song } from '../types';
import SongItem from './SongItem';
import { FullSwipeAction, LeftActions, RightActions } from './SwipeActionViews';

interface SwipeableSongItemProps {
  item: Song;
  onDelete: (id: number) => void;
}

const SwipeableSongItem = ({ item, onDelete }: SwipeableSongItemProps) => {
  const isLeftSwipe = item.type === ESwipeType.LEFT || item.type === ESwipeType.LEFT_RIGHT;

  const isRightSwipe = item.type === ESwipeType.RIGHT || item.type === ESwipeType.LEFT_RIGHT;

  const isRightFullSwipe = item.type === ESwipeType.RIGHT_FULL;
  const isLeftFullSwipe = item.type === ESwipeType.LEFT_FULL;

  return (
    <SwipeableItemWrapper
      id={item.id}
      animationType={item.type}
      leftSwipeView={isLeftSwipe ? <LeftActions /> : undefined}
      rightSwipeView={isRightSwipe ? <RightActions /> : undefined}
      onLeftFullSwipe={() => onDelete(item.id)}
      onRightFullSwipe={() => onDelete(item.id)}
      rightFullSwipeView={isRightFullSwipe ? <FullSwipeAction text="Delete" /> : undefined}
      leftFullSwipeView={isLeftFullSwipe ? <FullSwipeAction text="Delete" /> : undefined}
      leftSwipeViewContainerStyle={styles.swipeViewContainer}>
      <SongItem item={item} />
    </SwipeableItemWrapper>
  );
};

const styles = StyleSheet.create({
  swipeViewContainer: {
    paddingVertical: 20,
  },
});

export default memo(SwipeableSongItem);
