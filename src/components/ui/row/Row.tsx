import type React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

export function Row({ style, ...props }: ViewProps): React.ReactElement {
  return <View style={[styles.row, style]} {...props} />;
}

import { s } from '@/theme/Responsive';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: s(15),
    gap: s(15),
  },
});
