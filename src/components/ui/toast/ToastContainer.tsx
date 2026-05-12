import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlertStore } from '../alert/useAlertStore';
import Message from './Message';
import { vs } from '@/theme/Responsive';

const ToastContainer = memo(() => {
  const { top, bottom } = useSafeAreaInsets();

  // Selector: Chỉ re-render khi visible, msg hoặc type thay đổi
  const { visible, message, type, positionDown } = useAlertStore(state => state.toast);
  const hideToast = useAlertStore(state => state.hideToast);

  if (!visible) return null;

  return (
    <View
      style={[styles.container, positionDown ? { bottom: bottom + vs(20) } : { top: top + vs(10) }]}
      pointerEvents="box-none">
      <Message
        key={message} // Quan trọng: Reset animation khi spam message mới
        message={message}
        type={type}
        onHide={hideToast}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100000,
  },
});

export default ToastContainer;
