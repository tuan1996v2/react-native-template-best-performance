// src/theme/Colors.ts
export const ThemeTokens = {
  light: {
    primary: '#3498db',
    background: '#ffffff',
    text: '#1a1a1a',
    inputBg: '#f0f0f0',
    border: '#e1e1e1',
    // ... 100+ màu khác ở đây
  },
  dark: {
    primary: '#2980b9',
    background: '#121212',
    text: '#ffffff',
    inputBg: '#1e1e1e',
    border: '#333333',
    // ... 100+ màu khác ở đây
  },
};

export type AppTheme = typeof ThemeTokens.light;
