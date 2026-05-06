import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Color_Pallete, SCREEN_PADDING, SONGS } from './constants';
import { Song } from './types';
import SwipeableSongItem from './components/SwipeableSongItem';

const SwipeableScreen = () => {
  const [songs, setSongs] = useState(SONGS);

  const deleteItem = useCallback((id: number) => {
    setSongs(prevSongs => prevSongs.filter(eachSong => eachSong.id !== id));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Song }) => <SwipeableSongItem item={item} onDelete={deleteItem} />,
    [deleteItem],
  );

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={songs}
        contentContainerStyle={styles.flatListContent}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: Color_Pallete.metal_black,
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: SCREEN_PADDING,
  },
});

export default SwipeableScreen;
