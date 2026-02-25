import * as React from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import AppProvider from './src/components/portals/AppProvider';
import AppNavigation from './src/navigation/AppNavigation';

export default function App() {
  return (
    <AppProvider>
      <KeyboardProvider>
        <AppNavigation />
      </KeyboardProvider>
    </AppProvider>
  );
}
