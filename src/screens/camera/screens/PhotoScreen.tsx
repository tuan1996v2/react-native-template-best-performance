import type { StaticScreenProps } from '@react-navigation/native';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { CloseIcon } from '../icons/CloseIcon';
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
    paddingHorizontal: 20,
    paddingTop: 16,
    bottom: undefined,
  },
  flex: {
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
