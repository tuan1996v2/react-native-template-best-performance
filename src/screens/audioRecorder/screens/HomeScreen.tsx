import React, { memo } from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView, View, Platform } from 'react-native';
import { useStyles } from '@/theme/useStyles';
import { AppTheme } from '@/theme/Colors';
import {
  IconMic,
  IconWave,
  IconPlay,
  IconSpeed,
  IconVideo,
  IconChevronRight,
} from '../components/RecorderIcons';

export type ScreenKey =
  | 'SoundHook'
  | 'SoundHookStates'
  | 'SoundDirect'
  | 'RapidSwitch'
  | 'Compatibility';

interface HomeScreenProps {
  onNavigate: (k: ScreenKey) => void;
}

export const HomeScreen = memo(({ onNavigate }: HomeScreenProps) => {
  const styles = useStyles(createStyles);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.brandTitle}>Nitro Sound</Text>
        <Text style={styles.subtitle}>High-performance audio recorder & player demos</Text>
      </View>

      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.7}
        onPress={() => onNavigate('SoundHook')}>
        <View style={[styles.iconBg, styles.iconBgMic]}>
          <IconMic color="#6366F1" size={24} />
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>NitroSound with Hook</Text>
          <Text style={styles.itemDesc}>(Recommended) useSound hook</Text>
        </View>
        <IconChevronRight color={styles.arrow.color} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.7}
        onPress={() => onNavigate('SoundHookStates')}>
        <View style={[styles.iconBg, styles.iconBgWave]}>
          <IconWave color="#10B981" size={24} />
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>NitroSound with States</Text>
          <Text style={styles.itemDesc}>useSoundWithStates hook</Text>
        </View>
        <IconChevronRight color={styles.arrow.color} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.7}
        onPress={() => onNavigate('SoundDirect')}>
        <View style={[styles.iconBg, styles.iconBgPlay]}>
          <IconPlay color="#3B82F6" size={24} />
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>Direct NitroSound Usage</Text>
          <Text style={styles.itemDesc}>createSound factory instance</Text>
        </View>
        <IconChevronRight color={styles.arrow.color} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.7}
        onPress={() => onNavigate('RapidSwitch')}>
        <View style={[styles.iconBg, styles.iconBgSpeed]}>
          <IconSpeed color="#F59E0B" size={24} />
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>Rapid Switch Test</Text>
          <Text style={styles.itemDesc}>Switch between multiple tracks quickly</Text>
        </View>
        <IconChevronRight color={styles.arrow.color} />
      </TouchableOpacity>

      {Platform.OS !== 'web' && (
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.7}
          onPress={() => onNavigate('Compatibility')}>
          <View style={[styles.iconBg, styles.iconBgVideo]}>
            <IconVideo color="#EF4444" size={24} />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Compatibility: react-native-video</Text>
            <Text style={styles.itemDesc}>Reproduce and test iOS AudioSession conflicts</Text>
          </View>
          <IconChevronRight color={styles.arrow.color} />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.background,
    },
    header: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 30,
    },
    brandTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.text,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 20,
      paddingHorizontal: 20,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    iconBg: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    iconBgMic: {
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
    },
    iconBgWave: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
    },
    iconBgPlay: {
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
    },
    iconBgSpeed: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
    },
    iconBgVideo: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    itemTextContainer: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 4,
    },
    itemDesc: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    arrow: {
      color: theme.textMuted,
    },
  });
