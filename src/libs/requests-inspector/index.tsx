import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { FloatingButton } from './components/FloatingButton';
import { RequestsInspectorModal } from './components/RequestsInspectorModal';
import { useNetworkStore } from './networkStore';
import { RequestsInspectorProps } from './types';

export const RequestsInspector: FC<RequestsInspectorProps> = ({ children, enabled = true }) => {
  const setEnabled = useNetworkStore(state => state.setEnabled);

  useEffect(() => {
    setEnabled(enabled);
  }, [enabled, setEnabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {children}
      <FloatingButton />
      <RequestsInspectorModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { copyToClipboard, extractAuthToken } from './clipboardHelper';
export { generateCurlCommand } from './curlHelper';
export {
  attachRequestsInspector,
  requestsInspectorAxiosInterceptor,
  requestsInspectorFetch,
} from './interceptor';
export { useNetworkStore } from './networkStore';
export * from './types';
