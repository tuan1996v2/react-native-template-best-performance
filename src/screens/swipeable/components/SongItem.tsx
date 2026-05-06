import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Song } from '../types';
import { Color_Pallete, SONG_HEIGHT } from '../constants';

interface SongItemProps {
  item: Song;
}

const SongItem = ({ item }: SongItemProps) => (
  <View style={styles.container}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.imageSrc }} style={styles.image} borderRadius={8} />
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Color_Pallete.metal_black,
  },
  imageContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: '3%',
    paddingVertical: '3%',
  },
  image: {
    height: SONG_HEIGHT - 20,
    width: '97%',
  },
  descriptionContainer: {
    width: '80%',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color_Pallete.crystal_white,
  },
  singer: {
    color: Color_Pallete.silver_storm,
  },
});

export default memo(SongItem);
