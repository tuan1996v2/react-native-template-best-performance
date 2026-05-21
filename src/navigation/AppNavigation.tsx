import React from 'react';
import { useNavigationStore } from '../store/useNavigationStore';
import { createStaticNavigation, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { navigationRef, RootStackParamList } from '../navigation/NavigationService';
import DetailScreen from '../screens/detail/DetailScreen';
import HomeScreen from '../screens/home/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import MyModalScreen from '../screens/home/MyModalScreen';
import RegisterScreen from '@/components/ui/appTextInput/TmpMultiInput';
import StoryScreen from '../screens/detail/StoryScreen';
import SwipeableScreen from '../screens/swipeable/SwipeableScreen';
import { PhotoScreen } from '@/screens/camera/screens/PhotoScreen';
import { VideoScreen } from '@/screens/camera/screens/VideoScreen';
import { CameraScreen } from '@/screens/camera/screens/CameraScreen';
import QrScanScreen from '@/screens/qrScan/screen/QrScanScreen';
import OtpDemoScreen from '@/screens/otp/OtpDemoScreen';
import { useThemeStore } from '../store/useThemeStore';
import { ThemeTokens } from '../theme/Colors';
import AudioRecorderScreen from '@/screens/audioRecorder/AudioRecorderScreen';

const MainStack = {
  HomeScreen: {
    screen: HomeScreen,
    options: { title: 'Trang chủ', headerShown: false },
  },
  DetailScreen: {
    screen: DetailScreen,
    options: { title: 'Màn Detail', headerShown: false },
  },
  SwipeableScreen: {
    screen: SwipeableScreen,
    options: { title: 'Swipeable List', headerShown: true },
  },
  CameraScreen: {
    screen: CameraScreen,
    options: { title: 'Camera', headerShown: false },
  },
  QrScanScreen: {
    screen: QrScanScreen,
    options: { title: 'QrScanScreen', headerShown: false },
  },
  PhotoScreen: {
    screen: PhotoScreen,
    options: { title: 'Photo', headerShown: false },
  },
  VideoScreen: {
    screen: VideoScreen,
    options: { title: 'Video', headerShown: false },
  },
  RegisterScreen: {
    screen: RegisterScreen,
    options: { title: 'Màn RegisterScreen' },
  },
  AudioRecorderScreen: {
    screen: AudioRecorderScreen,
    options: { title: 'Màn Ghi âm', headerShown: false },
  },
  StoryScreen: {
    screen: StoryScreen,
    options: {
      presentation: 'transparentModal',
      headerShown: false,
      animation: 'fade',
    },
  },
  MyModalScreen: {
    screen: MyModalScreen,
    // options: {
    //   presentation: 'modal', // Ép kiểu hiển thị Modal
    //   headerShown: false,    // Thường Modal sẽ tự tùy chỉnh Header
    //   animation: 'slide_from_bottom', // Hiệu ứng trượt từ dưới lên
    // },

    options: {
      presentation: 'transparentModal', // QUAN TRỌNG 1
      headerShown: false,
      contentStyle: { backgroundColor: 'rgba(0,0,0,0.3)' }, // QUAN TRỌNG 2: Đục thủng nền Stack
      animation: 'fade_from_bottom', // Hiệu ứng mờ dần từ dưới lên
    },
  },
  OtpDemoScreen: {
    screen: OtpDemoScreen,
    options: { title: 'OTP Demo', headerShown: false },
  },
};
export const RootStack = createNativeStackNavigator({
  screens: MainStack,
  screenOptions: {
    headerShown: true,
    // animation: 'fade_from_bottom',
  },
});
const Navigation = createStaticNavigation(RootStack);

const AppNavigation = () => {
  const setEndTransition = useNavigationStore(state => state.setEndTransition);
  const mode = useThemeStore(state => state.mode);
  const theme = ThemeTokens[mode];

  const navTheme = {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    dark: mode === 'dark',
    colors: {
      ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.error,
    },
  };

  return (
    <Navigation
      theme={navTheme}
      onReady={() => {
        console.log('onReady');
        BootSplash.hide();
      }}
      ref={navigationRef}
      onStateChange={() => {
        const currentRoute = navigationRef.getCurrentRoute();
        if (currentRoute) {
          setEndTransition(currentRoute.name as keyof RootStackParamList);
        }
      }}
    />
  );
};

export default AppNavigation;
