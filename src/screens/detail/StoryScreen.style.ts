import { AppTheme } from '@/theme/Colors';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { s, vs, fs } from '@/theme/Responsive';
const { width, height } = Dimensions.get('window');

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.black,
    },
    storyContainer: {
      flex: 1,
    },
    storyImage: {
      width: width,
      height: height,
      backgroundColor: theme.black,
    },
    progressContainer: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? vs(50) : vs(20),
      left: s(10),
      right: s(10),
      flexDirection: 'row',
      gap: s(5),
    },
    progressBarBg: {
      flex: 1,
      height: vs(2),
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: s(1),
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: theme.white,
    },
    userInfo: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? vs(70) : vs(40),
      left: s(15),
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(10),
    },
    userAvatar: {
      width: s(36),
      height: s(36),
      borderRadius: s(18),
      borderWidth: 1,
      borderColor: theme.white,
    },
    userName: {
      color: theme.white,
      fontWeight: 'bold',
      fontSize: fs(16),
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    tapAreaContainer: {
      ...StyleSheet.absoluteFillObject,
      flexDirection: 'row',
    },
    tapArea: {
      flex: 1,
    },
    closeBtn: {
      position: 'absolute',
      right: s(15),
      padding: s(10),
      zIndex: 100,
    },
    white: {
      color: theme.white,
    },
  });
