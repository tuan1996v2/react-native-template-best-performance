import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { SONGS } from './constants';
import { Song } from './types';
import { useStyles } from '@/theme/useStyles';
import createStyles from './SwipeableScreen.styles';
import { FlashList } from '@shopify/flash-list';
import SwipeableSongItem from './components/SwipeableSongItem';

const SwipeableScreen = () => {
  const styles = useStyles(createStyles);
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
      <FlashList
        data={songs}
        contentContainerStyle={styles.flatListContent}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        // initialNumToRender={10}
        // maxToRenderPerBatch={10}
        // windowSize={10}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export default SwipeableScreen;
