import type { StaticScreenProps } from '@react-navigation/native';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaPadding } from '../hooks/useSafeAreaPadding';
import NavigationService from '@/navigation/NavigationService';

type Props = StaticScreenProps<{
  photoUri: string;
}>;

export function PhotoScreen({
  route: {
    params: { photoUri },
  },
}: Props) {
  const safePadding = useSafeAreaPadding();

  return (
    <View style={[styles.container, safePadding]}>
      <Image source={{ uri: photoUri }} style={styles.image} resizeMode="contain" />

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
import { CloseIcon } from '../icons/CloseIcon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
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
