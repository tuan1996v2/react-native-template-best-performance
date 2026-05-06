import { PixelRatio, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// iPhone 14 chuẩn (390x844)
const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

/**
 * Scale theo chiều ngang (Width)
 * Dùng cho: width, paddingHorizontal, marginHorizontal, borderRadius...
 */
export const s = (size: number) =>
  PixelRatio.roundToNearestPixel((SCREEN_WIDTH / DESIGN_WIDTH) * size);

/**
 * Scale theo chiều dọc (Height)
 * Dùng cho: height, paddingTop, marginBottom...
 */
export const vs = (size: number) =>
  PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / DESIGN_HEIGHT) * size);

/**
 * Moderate Scale (Dùng cho Font Size)
 * Giúp font không bị quá to trên màn hình lớn hoặc quá nhỏ trên màn hình bé.
 */
export const ms = (size: number, factor = 0.5) => size + (s(size) - size) * factor;

/**
 * Scale cho Font chữ (Có tính đến cài đặt Font của hệ thống)
 */
export const fs = (size: number) =>
  // PixelRatio.getFontScale() giúp tôn trọng cài đặt trợ năng của người dùng
  ms(size) * PixelRatio.getFontScale();
