// src/store/useThemeStore.ts
import { create } from 'zustand';

interface ThemeState {
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>(set => ({
  mode: 'light',
  setMode: mode => set({ mode }),
}));
