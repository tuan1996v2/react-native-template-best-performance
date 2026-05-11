/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { intlayerPolyfill } from 'react-native-intlayer';
import App from './App';
import { name as appName } from './app.json';

intlayerPolyfill();
if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./ReactotronConfig');
}
AppRegistry.registerComponent(appName, () => App);
