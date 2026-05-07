import type React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { BlurContainer, type BlurContainerProps } from './BlurContainer';

interface Props extends BlurContainerProps {
  onPress: () => void;
  children?: React.ReactNode;
}

export function IconButton({ children, onPress, ...props }: Props): React.ReactElement {
  return (
    <Pressable onPress={onPress} {...props}>
      <BlurContainer style={styles.container}>{children}</BlurContainer>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    overflow: 'hidden',
    padding: 10,
  },
});
