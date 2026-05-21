import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useStyles } from '@/theme/useStyles';
import { AppTheme } from '@/theme/Colors';
import RecorderHeader from '../components/RecorderHeader';
import { RapidSwitchTest } from './RapidSwitchTest';

interface RapidSwitchScreenProps {
  onBack: () => void;
}

export const RapidSwitchScreen = memo(({ onBack }: RapidSwitchScreenProps) => {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.container}>
      <RecorderHeader title="Rapid Switch Test" onBack={onBack} />
      <RapidSwitchTest />
    </View>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });
