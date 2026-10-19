import { create } from 'zustand';
import { Appearance, ColorSchemeName } from 'react-native';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  themePreference: ThemePreference;
  mode: ThemeMode;
  setThemePreference: (pref: ThemePreference) => void;
  setMode: (mode: ThemeMode) => void;
}

const getInitialMode = (pref: ThemePreference): ThemeMode => {
  if (pref === 'system') {
    const sys = Appearance.getColorScheme();
    return sys === 'dark' ? 'dark' : 'light';
  }
  return pref;
};

export const useThemeStore = create<ThemeState>((set, get) => {
  // Listen to OS Appearance changes
  Appearance.addChangeListener(({ colorScheme }: { colorScheme: ColorSchemeName }) => {
    if (get().themePreference === 'system') {
      const newMode = colorScheme === 'dark' ? 'dark' : 'light';
      if (get().mode !== newMode) {
        set({ mode: newMode });
      }
    }
  });

  return {
    themePreference: 'system',
    mode: getInitialMode('system'),
    setThemePreference: pref => {
      const mode = getInitialMode(pref);
      set({ themePreference: pref, mode });
    },
    setMode: mode => {
      set({ themePreference: mode, mode });
    },
  };
});
