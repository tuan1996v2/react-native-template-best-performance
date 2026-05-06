import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getRandomColor, SCREEN_PADDING } from '../constants';

interface SwipeActionProps {
  text: string;
  backgroundColor?: string;
  onPress?: () => void;
  fullWidth?: boolean;
  paddingHorizontal?: number;
  borderRadius?: number;
}

export const SwipeAction = ({
  text,
  backgroundColor,
  onPress,
  fullWidth,
  paddingHorizontal = SCREEN_PADDING,
  borderRadius = 0,
}: SwipeActionProps) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.actionContainer,
      fullWidth && styles.w100,
      {
        backgroundColor: backgroundColor || getRandomColor(),
        paddingHorizontal: paddingHorizontal,
        borderRadius: borderRadius,
      },
    ]}>
    <Text style={styles.actionText}>{text}</Text>
  </TouchableOpacity>
);

export const LeftActions = () => (
  <View style={styles.row}>
    <SwipeAction text="Left 1" paddingHorizontal={SCREEN_PADDING * 2} borderRadius={10} />
    <SwipeAction text="Left 2" borderRadius={10} />
  </View>
);

export const RightActions = () => (
  <View style={styles.row}>
    <SwipeAction text="Right 1" />
    <SwipeAction text="Right 2" />
  </View>
);

export const FullSwipeAction = ({ text }: { text: string }) => (
  <SwipeAction text={text} fullWidth />
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: '100%',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
  },
  w100: {
    width: '100%',
  },
});
