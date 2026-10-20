import React, { ReactNode, useEffect } from 'react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { LogBox, Platform, StatusBar, StyleSheet } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n';
import { ButtonSwitchTheme } from '@/components/portals/ButtonSwitchTheme';
import CustomAlert from '@/components/ui/alert/CustomAlert';
import ToastContainer from '@/components/ui/toast/ToastContainer';
import ChatToastContainer from '@/components/ui/toast/ChatToastContainer';
import GlobalLoadingComponent from '@/components/ui/loading/GlobalLoadingComponent';
import { setupFCM } from '@/firebase/fcmService';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBoundary from '@/libs/error-boundary';
import FpsHUD from '@/components/portals/FpsHUD';
import { PermissionModal, setPermissionModalRef } from '@/libs/permissions';

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
        <GestureHandlerRootView style={styles.rootView}>
          <ErrorBoundary>
            <I18nextProvider i18n={i18n}>{props.children}</I18nextProvider>
          </ErrorBoundary>
          <FpsHUD />
          <ButtonSwitchTheme />
          <GlobalLoadingComponent />
          <ToastContainer />
          <ChatToastContainer />
          <CustomAlert />
          <PermissionModal ref={setPermissionModalRef} />
        </GestureHandlerRootView>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
});
