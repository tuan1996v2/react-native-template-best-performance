import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import NavigationService from '@/navigation/NavigationService';

export interface LastMediaThumbnailRef {
  setMedia: (uri: string, type: 'photo' | 'video') => void;
}

interface MediaInfo {
  uri: string;
  type: 'photo' | 'video';
}

export const LastMediaThumbnail = React.memo(
  forwardRef<LastMediaThumbnailRef>((_props, ref) => {
    const [media, setMedia] = useState<MediaInfo | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        setMedia: (uri: string, type: 'photo' | 'video') => {
          setMedia({ uri, type });
        },
      }),
      [],
    );

    const handlePress = useCallback(() => {
      if (!media) return;
      if (media.type === 'video') {
        NavigationService.navigate('VideoScreen', { videoURL: media.uri });
      } else {
        // For photos, we navigate with the saved path
        // PhotoScreen can load from URI directly
        NavigationService.navigate('PhotoScreen', { photoUri: media.uri });
      }
    }, [media]);

    if (!media) {
      return <View style={styles.placeholder} />;
    }

    return (
      <Pressable style={styles.button} onPress={handlePress}>
        <Image source={{ uri: media.uri }} style={styles.image} />
      </Pressable>
    );
  }),
);

const styles = StyleSheet.create({
  placeholder: {
    width: 48,
    height: 48,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  image: {
    flex: 1,
  },
});
