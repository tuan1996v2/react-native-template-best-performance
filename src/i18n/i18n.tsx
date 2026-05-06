// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './locales/vi.json';
import en from './locales/en.json';
import * as RNLocalize from 'react-native-localize';

export const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  console.log('getDeviceLanguage', locales);
  return locales[0]?.languageCode || 'vi';
};

const resources = {
  vi: { translation: vi },
  en: { translation: en },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: (typeof resources)['vi'];
  }
}

export default i18n;
