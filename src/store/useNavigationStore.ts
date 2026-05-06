// src/store/useNavigationStore.ts
import { create } from 'zustand';
import { StaticParamList } from '@react-navigation/native';
import { RootStack } from '../navigation/AppNavigation';

// Suy luận Type từ RootStack
type RootStackParamList = StaticParamList<typeof RootStack>;
type ScreenName = keyof RootStackParamList;

interface NavigationState {
  currentScreen: ScreenName | undefined;
  previousScreen: ScreenName | undefined;
  transitionTime: number;
  startTime: number;

  // Actions
  setStartTransition: () => void;
  setEndTransition: (screenName: ScreenName) => void;
}

export const useNavigationStore = create<NavigationState>(set => ({
  currentScreen: undefined,
  previousScreen: undefined,
  transitionTime: 0,
  startTime: 0,

  setStartTransition: () =>
    set({
      startTime: performance.now(), // Dùng performance.now() để độ chính xác cao hơn Date.now()
    }),

  setEndTransition: screenName =>
    set(state => {
      const endTime = performance.now();
      const duration = state.startTime > 0 ? endTime - state.startTime : 0;
      console.log(`🚀 [PERF] Chuyển đến: ${screenName} | Thời gian: ${duration}ms`);

      return {
        previousScreen: state.currentScreen,
        currentScreen: screenName,
        transitionTime: Math.round(duration),
        startTime: 0,
      };
    }),
}));
