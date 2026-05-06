import React, { useState, memo, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Image,
  Text,
  ImageSourcePropType,
  StyleSheet,
  ImageProps,
  ActivityIndicator,
  NativeSyntheticEvent,
  ImageLoadEventData,
  ImageErrorEventData,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AppSkeleton from '../skeleton/AppSkeleton';
import { fs } from '../../../theme/Responsive';

interface AppImageProps extends ImageProps {
  thumbnailSource?: ImageSourcePropType;
  loadingSource?: ImageSourcePropType;
  errorSource?: ImageSourcePropType;
  errorText?: string;
  showIconLoading?: boolean;
  animationDuration?: number;
}

const AppImage: React.FC<AppImageProps> = ({
  source,
  thumbnailSource,
  loadingSource,
  errorSource,
  errorText = 'Ảnh bị lỗi',
  style,
  showIconLoading,
  animationDuration = 400,
  onLoad,
  onError,
  ...rest
}) => {
  const [isError, setIsError] = useState(false);

  const mainOpacity = useSharedValue(0);
  const placeholderOpacity = useSharedValue(1);

  // 🚀 TỐI ƯU CỐT LÕI: RESET STATE TRONG RENDER (Recycling Fix)
  // Khi FlashList tái sử dụng component (source đổi), ta reset animation ngay lập tức
  // mà không cần đợi đến useEffect (giúp tránh render 2 lần).
  const prevSource = useRef(source);
  if (prevSource.current !== source) {
    prevSource.current = source;
    mainOpacity.value = 0;
    placeholderOpacity.value = 1;
    if (isError) setIsError(false);
  }

  const finalSource = useMemo(() => {
    if (isError && errorSource) return errorSource;
    if (typeof source === 'string') return { uri: source };
    return source;
  }, [source, isError, errorSource]);

  const animatedMainStyle = useAnimatedStyle(() => ({
    opacity: mainOpacity.value,
  }));

  const animatedPlaceholderStyle = useAnimatedStyle(() => ({
    opacity: placeholderOpacity.value,
    zIndex: placeholderOpacity.value > 0.1 ? 1 : -1,
  }));

  const handleMainLoad = useCallback(
    (e: NativeSyntheticEvent<ImageLoadEventData>) => {
      mainOpacity.value = withTiming(1, { duration: animationDuration });
      placeholderOpacity.value = withTiming(0, { duration: animationDuration });
      onLoad?.(e);
    },
    [animationDuration, mainOpacity, placeholderOpacity, onLoad],
  );

  const handleError = useCallback(
    (e: NativeSyntheticEvent<ImageErrorEventData>) => {
      setIsError(true);
      placeholderOpacity.value = withTiming(0, { duration: 200 });

      if (errorSource) {
        mainOpacity.value = withTiming(1, { duration: 200 });
      }

      onError?.(e);
    },
    [mainOpacity, placeholderOpacity, errorSource, onError],
  );

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.absoluteFull, animatedPlaceholderStyle]} pointerEvents="none">
        {showIconLoading ? (
          <ActivityIndicator color={'#fff'} style={styles.absoluteFull} />
        ) : loadingSource ? (
          <Image source={loadingSource} style={styles.absoluteFull} resizeMode="center" />
        ) : (
          <AppSkeleton width="100%" height="100%" />
        )}
      </Animated.View>

      {thumbnailSource && (
        <Animated.View style={[styles.absoluteFull, animatedPlaceholderStyle, styles.center]}>
          <Animated.Image
            source={thumbnailSource}
            style={styles.absoluteFull}
            resizeMode={rest.resizeMode || 'cover'}
          />
          <ActivityIndicator color={'red'} />
        </Animated.View>
      )}

      <Animated.Image
        {...rest}
        source={finalSource}
        style={[styles.absoluteFull, animatedMainStyle]}
        onLoad={handleMainLoad}
        onError={handleError}
      />

      {isError && !errorSource && (
        <View style={[styles.absoluteFull, styles.errorContainer]}>
          <Text style={styles.errorText}>{errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  absoluteFull: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  errorText: {
    color: '#9E9E9E',
    fontSize: fs(12),
    fontWeight: '500',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(AppImage);
