import { getDefaultConfig, mergeConfig } from '@react-native/metro-config';
import { configMetroIntlayer } from 'react-native-intlayer/metro';

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = configMetroIntlayer(mergeConfig(getDefaultConfig(__dirname), config));
