import React from 'react';
import { useNavigationStore } from '../store/useNavigationStore';
import { createStaticNavigation } from '@react-navigation/native';
import { navigationRef, RootStackParamList } from '../navigation/NavigationService';
import DetailScreen from '../screens/detail/DetailScreen';
import HomeScreen from '../screens/home/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import MyModalScreen from '../screens/home/MyModalScreen';
import RegisterScreen from '@/components/ui/appTextInput/TmpMultiInput';
import StoryScreen from '../screens/detail/StoryScreen';
import SwipeableScreen from '../screens/swipeable/SwipeableScreen';

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
  RegisterScreen: {
    screen: RegisterScreen,
    options: { title: 'Màn RegisterScreen' },
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

  return (
    <Navigation
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
