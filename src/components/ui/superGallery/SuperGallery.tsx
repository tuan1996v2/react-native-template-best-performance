import React, {
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from 'react';
import useRenderLog from '@/hooks/useRenderLog';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { GestureViewer, useGestureViewerState } from 'react-native-gesture-image-viewer';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import AppImage from '@/components/ui/appImage/AppImage';

// ─── IMPERATIVE HANDLE TYPE ───────────────────────────────────
export interface SuperGalleryRef {
  open: (images: string[], initialIndex?: number) => void;
  close: () => void;
}

// ─── SUB-COMPONENT (memo → không bao giờ re-render khi swipe) ─
const GalleryImage = memo(({ uri }: { uri: string }) => (
  <Image
    source={{ uri }}
    style={StyleSheet.absoluteFillObject}
    resizeMode="contain"
  />
));

// ─── COUNTER (tách riêng — chỉ nó re-render khi swipe) ───────
const GalleryCounter = memo(() => {
  const { currentIndex, totalCount } = useGestureViewerState();
  if (totalCount <= 1) return null;
  return (
    <View style={styles.counter}>
      <Text style={styles.counterText}>
        {currentIndex + 1} / {totalCount}
      </Text>
    </View>
  );
});

// ─── INTERNAL STATE (chỉ dùng trong SuperGallery, parent KHÔNG biết) ─
interface InternalState {
  images: string[];
  initialIndex: number;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────
const SuperGallery = forwardRef<SuperGalleryRef>((_, ref) => {
  useRenderLog('SuperGallery');
  // ── State NỘI BỘ (chỉ re-render component này, KHÔNG lan lên parent) ──
  const [visible, setVisible] = useState(false);
  const dataRef = useRef<InternalState>({ images: [], initialIndex: 0 });

  // ── Reanimated: fade in/out toàn bộ overlay ──
  const opacity = useSharedValue(0);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // ── Imperative API: parent gọi ref.current.open() / close() ──
  useImperativeHandle(ref, () => ({
    open: (images: string[], initialIndex = 0) => {
      dataRef.current = { images, initialIndex };
      setVisible(true);
      opacity.value = withTiming(1, { duration: 200 });
    },
    close: () => {
      opacity.value = withTiming(0, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(setVisible)(false);
        }
      });
    },
  }), [opacity]);

  const handleDismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(setVisible)(false);
      }
    });
  }, [opacity]);

  const renderItem = useCallback(
    (item: string, _index: number) => <GalleryImage uri={item} />,
    [],
  );

  // ── Không mount GestureViewer khi đóng → giải phóng bộ nhớ ──
  if (!visible) return null;

  const { images, initialIndex } = dataRef.current;

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, styles.container, animatedContainerStyle]}>
      <GestureViewer
        data={images}
        initialIndex={initialIndex}
        onDismiss={handleDismiss}
        renderItem={renderItem}
        ListComponent={ScrollView}
        backdropStyle={styles.backdrop}
        containerStyle={styles.viewerContainer}
        maxZoomScale={5}
        enablePinchZoom
        enableDoubleTapZoom
      />

      {/* Nút đóng */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleDismiss}
        activeOpacity={0.7}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Counter ảnh (reactive — tự cập nhật khi vuốt) */}
      <GalleryCounter />
    </Animated.View>
  );
});

// ─── STYLES ───────────────────────────────────────────────────
import { s, vs, fs } from '../../../theme/Responsive';

const styles = StyleSheet.create({
  container: {
    zIndex: 9999,
    elevation: 9999,
    backgroundColor: '#000000',
  },
  // Nền đen cho GestureViewer (lớp sau ảnh)
  backdrop: {
    backgroundColor: '#000000',
  },
  viewerContainer: {
    backgroundColor: '#000000',
  },
  closeButton: {
    position: 'absolute',
    top: vs(50),
    right: s(16),
    zIndex: 999,
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: fs(20),
    fontWeight: '600',
  },
  counter: {
    position: 'absolute',
    top: vs(56),
    left: s(20),
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: vs(4),
    paddingHorizontal: s(12),
    borderRadius: s(12),
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: fs(13),
    fontWeight: '600',
  },
});


export default memo(SuperGallery);

