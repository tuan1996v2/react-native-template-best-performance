import * as React from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import AppProvider from './src/components/portals/AppProvider';
import { RequestsInspector } from './src/libs/requests-inspector';
import AppNavigation from './src/navigation/AppNavigation';

export default function App() {
  return (
    <RequestsInspector enabled={__DEV__}>
      <AppProvider>
        <KeyboardProvider>
          <AppNavigation />
        </KeyboardProvider>
      </AppProvider>
    </RequestsInspector>
  );
}
