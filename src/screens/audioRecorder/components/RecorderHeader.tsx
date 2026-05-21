import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft } from './ChevronLeft';
import { useStyles } from '@/theme/useStyles';
import { AppTheme } from '@/theme/Colors';

interface Props {
  title: string;
  onBack: () => void;
}

const RecorderHeader = memo(({ title, onBack }: Props) => {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
        <ChevronLeft color={styles.backTxt.color} size={22} />
        <Text style={styles.backTxt}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.spacer} />
    </View>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    header: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      elevation: 2,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingRight: 12,
    },
    backTxt: {
      fontSize: 16,
      color: theme.primary,
      fontWeight: '600',
      marginLeft: 4,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      flex: 1,
      marginRight: 20, // offset spacing of back button slightly
    },
    spacer: {
      width: 50,
    },
  });

export default RecorderHeader;
