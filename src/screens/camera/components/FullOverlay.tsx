import type React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

export function FullOverlay({ style, ...props }: ViewProps): React.ReactElement {
  return <View style={[styles.overlay, style]} {...props} />;
}

import { vs } from '@/theme/Responsive';

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    marginTop: vs(15),
    marginBottom: vs(25),
  },
});
