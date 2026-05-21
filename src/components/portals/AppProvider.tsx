import React, { ReactNode, useEffect } from 'react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { LogBox, Platform, StatusBar } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n';
import { NavDebugger } from '@/navigation/NavDebugger';
import { ButtonSwitchTheme } from '@/components/portals/ButtonSwitchTheme';
import CustomAlert from '@/components/ui/alert/CustomAlert';
import ToastContainer from '@/components/ui/toast/ToastContainer';
import ChatToastContainer from '@/components/ui/toast/ChatToastContainer';
import GlobalLoadingComponent from '@/components/ui/loading/GlobalLoadingComponent';
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
  };

  useEffect(() => {
    statusBarConfig();
    setupFCM();
  }, []);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardProvider>
        <GestureHandlerRootView>
          <I18nextProvider i18n={i18n}>{props.children}</I18nextProvider>
        </GestureHandlerRootView>
        <NavDebugger />
        <ButtonSwitchTheme />
        <GlobalLoadingComponent />
        <ToastContainer />
        <ChatToastContainer />
        <CustomAlert />
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
