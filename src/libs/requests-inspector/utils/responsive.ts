import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Standard mobile baseline (390 x 844)
const BASELINE_WIDTH = 390;
const BASELINE_HEIGHT = 844;

export const s = (size: number): number =>
  PixelRatio.roundToNearestPixel((SCREEN_WIDTH / BASELINE_WIDTH) * size);

export const vs = (size: number): number =>
  PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / BASELINE_HEIGHT) * size);

export const ms = (size: number, factor = 0.5): number => size + (s(size) - size) * factor;

export const fs = (size: number): number => ms(size) * PixelRatio.getFontScale();
