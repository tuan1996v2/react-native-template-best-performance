import React, { useState, memo, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  ImageSourcePropType,
  ImageProps,
  ActivityIndicator,
  NativeSyntheticEvent,
  ImageLoadEventData,
  ImageErrorEventData,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AppSkeleton from '../skeleton/AppSkeleton';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';
import { useStyles } from '@/theme/useStyles';
import { createStyles } from './AppImage.style';

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
  const styles = useStyles(createStyles);
  const mode = useThemeStore(state => state.mode);
  const theme = ThemeTokens[mode];
  const [isError, setIsError] = useState(false);

  const mainOpacity = useSharedValue(0);
  const placeholderOpacity = useSharedValue(1);

  // 🚀 TỐI ƯU CỐT LÕI: RESET STATE KHI SOURCE THAY ĐỔI
  // Sử dụng useEffect để tránh cảnh báo: [Reanimated] Writing to `value` during component render.
  useEffect(() => {
    mainOpacity.value = 0;
    placeholderOpacity.value = 1;
    if (isError) setIsError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]); // Reset khi source thay đổi

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [animationDuration, onLoad],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [errorSource, onError],
  );

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.absoluteFull, animatedPlaceholderStyle]} pointerEvents="none">
        {showIconLoading ? (
          <ActivityIndicator color={theme.primary} style={styles.absoluteFull} />
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
          <ActivityIndicator color={theme.accent} />
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

export default memo(AppImage);
