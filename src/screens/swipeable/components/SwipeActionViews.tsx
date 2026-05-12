import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { getRandomColor, SCREEN_PADDING } from '../constants';
import { useStyles } from '@/theme/useStyles';
import createStyles from '../SwipeableScreen.styles';

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
}: SwipeActionProps) => {
  const styles = useStyles(createStyles);
  return (
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
};

export const LeftActions = () => {
  const styles = useStyles(createStyles);
  return (
    <View style={styles.row}>
      <SwipeAction text="Left 1" paddingHorizontal={SCREEN_PADDING * 2} borderRadius={10} />
      <SwipeAction text="Left 2" borderRadius={10} />
    </View>
  );
};

export const RightActions = () => {
  const styles = useStyles(createStyles);
  return (
    <View style={styles.row}>
      <SwipeAction text="Right 1" />
      <SwipeAction text="Right 2" />
    </View>
  );
};

export const FullSwipeAction = ({ text }: { text: string }) => (
  <SwipeAction text={text} fullWidth />
);
