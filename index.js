/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./ReactotronConfig');
}
AppRegistry.registerComponent(appName, () => App);
