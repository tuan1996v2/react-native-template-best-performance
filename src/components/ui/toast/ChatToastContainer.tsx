import React, { memo, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatMessage, { ChatMessageRef } from './ChatMessage';
import { vs } from '@/theme/Responsive';
import { chatToastManager } from './ChatToastManager';

const ChatToastContainer = memo(() => {
  const { top, bottom } = useSafeAreaInsets();
  const topRef = useRef<ChatMessageRef>(null);
  const bottomRef = useRef<ChatMessageRef>(null);

  useEffect(() => {
    const handleShow = (item: {
      message: string;
      type: 'success' | 'error' | 'warning';
      duration: number;
    }) => {
      if (item.positionDown) {
        bottomRef.current?.animate(item);
      } else {
        topRef.current?.animate(item);
      }
    };

    chatToastManager.addListener(handleShow);
    return () => {
      chatToastManager.removeListener(handleShow);
    };
  }, []);

  return (
    <>
      <View style={[styles.container, { top: top + vs(10) }]} pointerEvents="box-none">
        <ChatMessage ref={topRef} />
      </View>
      <View style={[styles.container, { bottom: bottom + vs(20) }]} pointerEvents="box-none">
        <ChatMessage ref={bottomRef} isBottom />
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 99999, // Render just behind system toast
  },
});

export default ChatToastContainer;
