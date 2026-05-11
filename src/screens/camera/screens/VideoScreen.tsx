import type { StaticScreenProps } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'react-native-video';
import { CloseIcon } from '../icons/CloseIcon';
import { useSafeAreaPadding } from '../hooks/useSafeAreaPadding';
import NavigationService from '@/navigation/NavigationService';

type Props = StaticScreenProps<{
  videoURL: string;
}>;

export function VideoScreen({
  route: {
    params: { videoURL },
  },
}: Props) {
  const safePadding = useSafeAreaPadding();
  const player = useVideoPlayer(videoURL, _player => {
    _player.play();
    _player.loop = true;
  });

  return (
    <View style={[styles.container, safePadding]}>
      <VideoView style={styles.video} player={player} controls />

      {/* Close button */}
      <View style={[styles.topBar, safePadding]}>
        <View style={styles.flex} />
        <Pressable style={styles.closeButton} onPress={() => NavigationService.back()}>
          <CloseIcon size={24} />
        </Pressable>
      </View>
    </View>
  );
}

import { s, vs } from '@/theme/Responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  topBar: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingHorizontal: s(20),
    paddingTop: vs(16),
    bottom: undefined,
  },
  flex: {
    flex: 1,
  },
  closeButton: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
