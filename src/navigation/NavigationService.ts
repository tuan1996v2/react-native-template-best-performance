// src/navigation/NavigationService.ts
import {
  CommonActions,
  StackActions,
  createNavigationContainerRef,
  type StaticParamList,
} from '@react-navigation/native';
import { useNavigationStore } from '../store/useNavigationStore';
import { RootStack } from './AppNavigation';

export type RootStackParamList = StaticParamList<typeof RootStack>;

// Tạo Ref với Type chặt chẽ
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Hàm helper để bắt đầu đo thời gian
const startTimer = () => useNavigationStore.getState().setStartTransition();

const navigate = <RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName],
): void => {
  console.log('NavigationService.navigate called for:', name);
  if (navigationRef.isReady()) {
    startTimer();
    navigationRef.navigate(name, params);
  } else {
    console.warn('NavigationService.navigate failed: navigationRef is NOT ready');
  }
};

const push = <RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName],
): void => {
  if (navigationRef.isReady()) {
    startTimer();
    navigationRef.dispatch(StackActions.push(name as string, params));
  }
};

const replace = <RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName],
): void => {
  if (navigationRef.isReady()) {
    startTimer();
    navigationRef.dispatch(StackActions.replace(name as string, params));
  }
};

const back = (): void => {
  if (navigationRef.isReady()) {
    startTimer();
    navigationRef.dispatch(CommonActions.goBack());
  }
};

export default {
  navigate,
  push,
  replace,
  back,
  navigationRef,
};
