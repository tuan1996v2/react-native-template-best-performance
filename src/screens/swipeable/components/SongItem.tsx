import React, { memo } from 'react';
import { Image, Text, View } from 'react-native';
import { Song } from '../types';
import { useStyles } from '@/theme/useStyles';
import createStyles from '../SwipeableScreen.styles';
import { s } from '@/theme/Responsive';

interface SongItemProps {
  item: Song;
}

const SongItem = ({ item }: SongItemProps) => {
  const styles = useStyles(createStyles);
  return (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageSrc }} style={styles.image} borderRadius={s(8)} />
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.singer} numberOfLines={1}>
          {item.singer}
        </Text>
      </View>
    </View>
  );
};

export default memo(SongItem);
