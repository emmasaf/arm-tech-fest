export const locales = ['en', 'am', 'ru'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

// Translation messages type
export type Messages = {
  [key: string]: string | Messages;
};

// Import all translations
const translations: Record<Locale, Messages> = {
  en: require('./locales/en/common.json'),
  am: require('./locales/am/common.json'),
  ru: require('./locales/ru/common.json'),
};

export { translations };