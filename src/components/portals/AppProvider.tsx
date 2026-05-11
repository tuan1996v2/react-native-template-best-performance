import React, { ReactNode, useEffect } from 'react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { LogBox, Platform, StatusBar } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { IntlayerProvider } from 'react-intlayer';
import { NavDebugger } from '../../navigation/NavDebugger';
import CustomAlert from './alert/CustomAlert';
import ToastContainer from './alert/ToastContainer';
import GlobalLoadingComponent from './GlobalLoadingComponent';
import { setupFCM } from '@/firebase/fcmService';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['Warning: ...']); //Hide warnings

type Props = {
  children: ReactNode;
  onReady?: () => void;
};
export default function AppProvider(props: Props) {
  const statusBarConfig = () => {
    if (Platform.OS !== 'ios') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
    StatusBar.setHidden(false);
    StatusBar.setBarStyle('dark-content');
  };

  useEffect(() => {
    statusBarConfig();
    setupFCM();
  }, []);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardProvider>
        <GestureHandlerRootView>
          <IntlayerProvider>{props.children}</IntlayerProvider>
        </GestureHandlerRootView>
        <NavDebugger />
        <GlobalLoadingComponent />
        <ToastContainer />
        <CustomAlert />
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
